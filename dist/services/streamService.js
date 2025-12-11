"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStreamLive = isStreamLive;
exports.processStreamLiveEvent = processStreamLiveEvent;
exports.processStreamOfflineEvent = processStreamOfflineEvent;
exports.getCurrentStreamSessionId = getCurrentStreamSessionId;
exports.initializeStreamState = initializeStreamState;
exports.getCurrentStreamDay = getCurrentStreamDay;
exports.incrementGlobalDayStat = incrementGlobalDayStat;
// src/services/streamService.ts
// This new service contains the core logic for advancing the 21-day clock on all active challenges, 
// ensuring it only happens once per calendar day, regardless of how many stream sessions per day. 
// It also contains the official source of truth for the isStreamLive() check.
const prisma_1 = __importDefault(require("../prisma"));
const client_1 = require("@prisma/client");
const challengeService_1 = require("./challengeService");
let currentStreamStatus = 'OFFLINE';
let currentStreamStartTime = null;
let currentStreamSessionId = null; // ID of the currently active 'streams' table record
/**
 * Returns the global stream status. Used by challengeService to apply the 21% discount.
 */
function isStreamLive() {
    return currentStreamStatus === 'LIVE';
}
/**
 * Ensures the single global StreamStat record exists, creating it if necessary.
 * @returns The current global stream day count and record ID.
 */
async function getOrCreateGlobalStreamStat(tx) {
    const streamStatsArray = await tx.streamStat.findMany({ take: 1 });
    let streamStatRecord;
    if (streamStatsArray.length === 0) {
        streamStatRecord = await tx.streamStat.create({
            data: {
                streamDaysSinceInception: 0,
            },
        });
    }
    else {
        streamStatRecord = streamStatsArray[0];
    }
    return {
        // NOTE: Your schema uses 'id' as the primary key for StreamStat
        statId: streamStatRecord.id,
        currentDay: streamStatRecord.streamDaysSinceInception
    };
}
////////////////////////////////////////////////////////////////////////////////////////
// HANDLES THE STREAM LIVE WEBHOOK EVENT
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the 'stream live' webhook event to start the clock and advance challenge counters.
 * @param streamStartTime - The timestamp of the 'Go Live' event.
 */
async function processStreamLiveEvent(streamStartTime) {
    // Check in-memory status first, outside transaction for quick exit
    if (currentStreamStatus === 'LIVE') {
        console.log(`[StreamService] Stream event received, but status was already LIVE. Skipping clock advancement.`);
        return;
    }
    // Use transaction for atomic DB updates
    await prisma_1.default.$transaction(async (tx) => {
        // 1. Advance Global Stream Day Counter (stream_stats)
        const { statId, currentDay } = await getOrCreateGlobalStreamStat(tx);
        // Find the most recent *processed* stream to check date boundary
        const lastStream = await tx.stream.findFirst({
            orderBy: { streamSessionId: 'desc' },
            where: { hasBeenProcessed: true } // Check against processed streams
        });
        let newGlobalDay = currentDay;
        // Check if the current stream start date is different from the last stream's end date.
        // Prevents the global streamDaysSinceInception counter from advancing if the current stream 
        // started on the same calendar day as the last processed stream session's end time.
        if (!lastStream || lastStream.endTimestamp.toDateString() !== streamStartTime.toDateString()) {
            newGlobalDay = currentDay + 1;
            // Update the single global stat record
            await tx.streamStat.update({
                where: { id: statId },
                data: {
                    streamDaysSinceInception: newGlobalDay,
                },
            });
            console.log(`[StreamService] Global Stream Day Counter advanced to Day ${newGlobalDay}.`);
        }
        // 2. Update Challenge Clocks (21-Day Counter) 
        const activeChallenges = await tx.challenge.findMany({
            where: {
                status: client_1.ChallengeStatus.ACTIVE,
                streamDaysSinceActivation: { lt: 21 }
            },
        });
        const streamEventDateUTC = streamStartTime.toISOString().substring(0, 10);
        for (const challenge of activeChallenges) {
            // ⭐ FIX: Use the new dedicated field for the daily check.
            const lastTickDateUTC = challenge.timestampLastStreamDayTicked.toISOString().substring(0, 10);
            // CRITICAL Archival Clock Logic: Check if this Challenge's counter has already been incremented
            // on the current UTC CALENDAR DAY (YYYY-MM-DD UTC). 
            if (streamEventDateUTC !== lastTickDateUTC) {
                await tx.challenge.update({
                    where: { challengeId: challenge.challengeId },
                    data: {
                        streamDaysSinceActivation: { increment: 1 },
                        timestampLastStreamDayTicked: streamStartTime,
                    },
                });
            }
        }
        // 3. Record the Stream Session
        const newStream = await tx.stream.create({
            data: {
                currentStreamNumber: newGlobalDay,
                startTimestamp: streamStartTime,
                hasBeenProcessed: false, // Must be false until /offline event runs
            }
        });
        // 4. Update In-Memory Status (outside the transaction, after DB success)
        currentStreamStatus = 'LIVE';
        currentStreamStartTime = streamStartTime;
        currentStreamSessionId = newStream.streamSessionId;
        console.log(`[StreamService] Stream set to LIVE. Session ID: ${currentStreamSessionId}`);
    });
}
////////////////////////////////////////////////////////////////////////////////////////
// HANDLES THE STREAM OFFLINE WEBHOOK EVENT
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the 'stream offline' webhook event to reset the stream status and finalize the session.
 * @param streamEndTime - The timestamp of the 'Go Offline' event.
 */
async function processStreamOfflineEvent(streamEndTime) {
    // Safety check for an unexpected offline event
    if (!currentStreamSessionId) {
        console.warn(`[StreamService] Offline event received but no active session ID found. Status reset forced.`);
        currentStreamStatus = 'OFFLINE';
        return;
    }
    // Use transaction for atomic DB updates
    await prisma_1.default.$transaction(async (tx) => {
        // Calculate duration and finalize stats
        const durationMs = streamEndTime.getTime() - currentStreamStartTime.getTime();
        const durationMinutes = Math.floor(durationMs / (1000 * 60));
        // 1. Finalize the Stream Session record
        await tx.stream.update({
            // FIX: Use non-null assertion '!' to satisfy TypeScript compiler (number | null -> number)
            where: { streamSessionId: currentStreamSessionId },
            data: {
                endTimestamp: streamEndTime,
                durationMinutes: durationMinutes,
                hasBeenProcessed: true,
            }
        });
        // 2. ARCHIVE EXPIRED CHALLENGES
        // Note: Because this is an external function, we call the imported service function, 
        // which uses its own prisma client, but runs *after* the stream record is updated.
        const archivedCount = await (0, challengeService_1.archiveExpiredChallenges)();
        console.log(`[StreamService] Challenge archival complete. ${archivedCount} challenges archived.`);
        // 3. FINALIZE CURRENTLY EXECUTING CHALLENGE
        const completedChallenge = await (0, challengeService_1.finalizeInProgressChallenge)();
        if (completedChallenge) {
            console.log(`[StreamService] Challenge #${completedChallenge.challengeId} completed upon stream end.`);
        }
        // 4. Reset In-Memory Status
        currentStreamStatus = 'OFFLINE';
        currentStreamStartTime = null;
        currentStreamSessionId = null;
        console.log(`[StreamService] Stream set to OFFLINE. Session finalized.`);
    });
}
////////////////////////////////////////////////////////////////////////////////////////
// RETURN THE ID OF THE ACTIVE STREAM SESSION
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Returns the ID of the currently active stream session from the in-memory state.
 */
function getCurrentStreamSessionId() {
    return currentStreamSessionId;
}
////////////////////////////////////////////////////////////////////////////////////////
// SERVER STARTUP / STATE RECOVERY
////////////////////////////////////////////////////////////////////////////////////////
async function initializeStreamState() {
    // 1. Fetch the global stat record first. (Assuming it's a singleton with ID 1 or findFirst)
    // This is needed for the logging of the current global days.
    const streamStat = await prisma_1.default.streamStat.findFirst({
        where: { id: 1 } // Assuming ID 1 for singleton
    });
    // Provide defaults if the stat record doesn't exist yet (though it shouldn't happen in production)
    const currentGlobalDay = streamStat?.daysSinceInception ?? 0;
    const currentStreamDay = streamStat?.streamDaysSinceInception ?? 0;
    // 2. Look for the most recent stream session that has not yet been processed (i.e., still LIVE)
    const lastActiveStream = await prisma_1.default.stream.findFirst({
        where: { hasBeenProcessed: false },
        orderBy: { streamSessionId: 'desc' },
    });
    if (lastActiveStream) {
        // Synchronize the in-memory state with the database record
        currentStreamStatus = 'LIVE';
        currentStreamStartTime = lastActiveStream.startTimestamp;
        currentStreamSessionId = lastActiveStream.streamSessionId;
        // Corrected Log: Use fetched variables and literal strings
        console.log(`[StreamService] State recovered: Session #${currentStreamSessionId} loaded as ${currentStreamStatus}. Global Day: ${currentGlobalDay}. Stream Day: ${currentStreamDay}.`);
    }
    else {
        // Corrected Log: Include the global days even when offline
        console.log(`[StreamService] State initialized: No active session found. Status is OFFLINE. Global Day: ${currentGlobalDay}. Stream Day: ${currentStreamDay}.`);
    }
}
////////////////////////////////////////////////////////////////////////////////////////
// RETRIEVE CURRENT STREAM DAY
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Retrieves the current global Stream Day number from the StreamStat record.
 * Used by the daily scheduler for the user tick.
 */
async function getCurrentStreamDay() {
    const streamStat = await prisma_1.default.streamStat.findFirst();
    return streamStat ? streamStat.streamDaysSinceInception : 0;
    //The expression is a ternary operator (a shorthand if-else statement) used to safely retrieve the global stream day count.
}
////////////////////////////////////////////////////////////////////////////////////////
// ADVANCE GLOBAL DAY CLOCK ONCE PER DAY
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Ensures the global Real-World Day clock (daysSinceInception) advances by one day.
 * This is called by the daily scheduler (21:00 UTC) to guarantee the clock advances
 * regardless of stream activity.
 */
async function incrementGlobalDayStat() {
    await prisma_1.default.$transaction(async (tx) => {
        // 1. Fetch the existing stat record
        const { statId } = await getOrCreateGlobalStreamStat(tx);
        // 2. Atomically increment only the Real-World Clock (daysSinceInception)
        await tx.streamStat.update({
            where: { id: statId },
            data: {
                daysSinceInception: { increment: 1 },
            },
        });
        console.log(`[StreamService] Real-World Day Clock advanced by 1 via scheduler.`);
    });
}
