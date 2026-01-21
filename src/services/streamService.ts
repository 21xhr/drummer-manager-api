// src/services/streamService.ts
// This new service contains the core logic for advancing the 21-day clock on all active challenges, 
// ensuring it only happens once per calendar day, regardless of how many stream sessions per day. 
// It also contains the official source of truth for the isStreamLive() check.
import prisma from '../prisma';
import { ChallengeStatus } from '@prisma/client';
import { archiveExpiredChallenges, finalizeInProgressChallenge } from './challengeService';

// Use string literals for better state management and scaling (e.g., 'BREAK', 'PRE-STREAM' later)
type StreamStatus = 'OFFLINE' | 'LIVE';
let currentStreamStatus: StreamStatus = 'OFFLINE'; 
let currentStreamStartTime: Date | null = null;
let currentStreamSessionId: number | null = null; // ID of the currently active 'streams' table record


/**
 * Returns the global stream status. Used by challengeService to apply the 21% discount.
 */
export function isStreamLive(): boolean {
  return currentStreamStatus === 'LIVE';
}


/**
 * Ensures the single global StreamStat record exists, creating it if necessary.
 * @returns The current global stream day count and record ID.
 */
async function getOrCreateGlobalStreamStat(tx: any): Promise<{ statId: number, currentDay: number }> {
    
    const streamStatsArray = await tx.streamStat.findMany({ take: 1 });
    
    let streamStatRecord;

    if (streamStatsArray.length === 0) {
        streamStatRecord = await tx.streamStat.create({
            data: {
                id: 1,
                streamDaysSinceInception: 0,
            },
        });
    } else {
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
export async function processStreamLiveEvent(streamStartTime: Date): Promise<void> {
    
    // Check in-memory status first, outside transaction for quick exit
    if (currentStreamStatus === 'LIVE') {
        console.log(`[StreamService] Stream event received, but status was already LIVE. Skipping clock advancement.`);
        return; 
    }
    
    // Use transaction for atomic DB updates
    await prisma.$transaction(async (tx) => {
        
        // 1. Advance Global Stream Day Counter (stream_stats)
        const { statId, currentDay } = await getOrCreateGlobalStreamStat(tx);
        
        // Find the most recent *processed* stream to check date boundary
        const lastStream = await tx.stream.findFirst({
            orderBy: { streamSessionId: 'desc' },
            where: { hasBeenProcessed: true } // Check against processed streams
        });
        
        let newGlobalDay = currentDay;

        // Check if the current stream start date is different from the last stream's end date.
        if (!lastStream || lastStream.endTimestamp!.toDateString() !== streamStartTime.toDateString()) {
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

        const streamEventDateUTC = streamStartTime.toISOString().substring(0, 10);
        const startOfTodayUTC = new Date(streamEventDateUTC);

        // 2. Update Challenge Clocks (21-Day Counter) if needed
        const updateResult = await tx.challenge.updateMany({
            where: {
                status: ChallengeStatus.ACTIVE,
                streamDaysSinceActivation: { lt: 21 },
                // ONLY update if the last tick happened BEFORE today's date
                timestampLastStreamDayTicked: { lt: startOfTodayUTC }
            },
            data: {
                streamDaysSinceActivation: { increment: 1 }, 
                timestampLastStreamDayTicked: streamStartTime,
            },
        });

        if (updateResult.count > 0) {
            console.log(`[StreamService] Advanced clocks for ${updateResult.count} active challenges.`);
        }

        // 3. Record the Stream Session
        const newStream = await tx.stream.create({
            data: {
                currentStreamNumber: newGlobalDay, 
                startTimestamp: streamStartTime,
                hasBeenProcessed: false, // Must be false until /offline event runs
            }
        });

        // Fetch stats for logging
        const stats = await tx.streamStat.findFirst({ where: { id: 1 } });
        
        // 4. Update In-Memory Status (outside the transaction, after DB success)
        currentStreamStatus = 'LIVE';
        currentStreamStartTime = streamStartTime;
        currentStreamSessionId = newStream.streamSessionId;
        console.log(`[StreamService] Stream set to LIVE. Session ID: ${currentStreamSessionId}`);

        // Formatted log block for clarity
        console.log(`
╔════════════════ SESSION STARTED ════════════════╗
  ID: ${newStream.streamSessionId} | Number: #${newStream.currentStreamNumber}
  Start: ${streamStartTime.toISOString().replace('T', ' ').substring(0, 19)} UTC
  
  CLOCKS:
  Stream Days: ${stats?.streamDaysSinceInception}
  Real Days:   ${stats?.daysSinceInception}
  
  ACTIVITY:
  Advanced Clocks: ${updateResult.count} Challenges
╚══════════════════════════════════════════════════╝
        `);
        
    }, {
        timeout: 15000 // Added a safety timeout (15s) for bulk processing
    });
}


////////////////////////////////////////////////////////////////////////////////////////
// HANDLES THE STREAM OFFLINE WEBHOOK EVENT
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the 'stream offline' webhook event to reset the stream status and finalize the session.
 * @param streamEndTime - The timestamp of the 'Go Offline' event.
 */
export async function processStreamOfflineEvent(streamEndTime: Date): Promise<void> {
    if (!currentStreamSessionId) {
        console.warn(`[StreamService] Offline event received but no active session ID found.`);
        currentStreamStatus = 'OFFLINE';
        return;
    }

    // 1. Calculate duration
    const durationMs = streamEndTime.getTime() - currentStreamStartTime!.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    // 2. Perform DB updates in a tight, fast transaction
    const result = await prisma.$transaction(async (tx) => {
        const finalized = await tx.stream.update({
            where: { streamSessionId: currentStreamSessionId! },
            data: {
                endTimestamp: streamEndTime,
                durationMinutes: durationMinutes,
                hasBeenProcessed: true,
            }
        });

        const stats = await tx.streamStat.findFirst({ where: { id: 1 } });
        
        return { finalized, stats };
    });

    // 3. Move archival/finalization OUTSIDE the transaction
    // This prevents the "Transaction not found" error because the transaction is already closed.
    const archivedCount = await archiveExpiredChallenges();
    const completedChallenge = await finalizeInProgressChallenge();

    // 4. Update memory and log
    currentStreamStatus = 'OFFLINE';
    
    console.log(`
╔════════════════ SESSION FINALIZED ════════════════╗
  ID: ${result.finalized.streamSessionId} | Number: #${result.finalized.currentStreamNumber}
  Duration: ${result.finalized.durationMinutes} minutes
  
  CLOCKS:
  Stream Days: ${result.stats?.streamDaysSinceInception}
  Real Days:   ${result.stats?.daysSinceInception}
  
  ACTIVITY:
  Archived:  ${archivedCount} | Completed: ${completedChallenge ? `#${completedChallenge.challengeId}` : 'None'}
╚═══════════════════════════════════════════════════╝
    `);

    currentStreamStartTime = null;
    currentStreamSessionId = null;
}

////////////////////////////////////////////////////////////////////////////////////////
// RETURN THE ID OF THE ACTIVE STREAM SESSION
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Returns the ID of the currently active stream session from the in-memory state.
 */
export function getCurrentStreamSessionId(): number | null {
  return currentStreamSessionId;
}

////////////////////////////////////////////////////////////////////////////////////////
// SERVER STARTUP / STATE RECOVERY
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Its Single Purpose: Its only job is "Memory Recovery." 
 * If the Node.js process restarts (due to a Vercel deployment or a crash), 
 * it looks at the DB and asks: "Was I in the middle of a stream when I died?" 
 * If it finds a record where hasBeenProcessed: false, it re-hydrates the memory variables.
 */
export async function initializeStreamState(): Promise<void> {
    // 1. Fetch the global stat record first. (Assuming it's a singleton with ID 1 or findFirst)
    // This is needed for the logging of the current global days.
    const streamStat = await prisma.streamStat.findFirst({
        where: { id: 1 } // Assuming ID 1 for singleton
    });
    
    // Provide defaults if the stat record doesn't exist yet (though it shouldn't happen in production)
    const currentGlobalDay = streamStat?.daysSinceInception ?? 0;
    const currentStreamDay = streamStat?.streamDaysSinceInception ?? 0;

    // 2. Look for the most recent stream session that has not yet been processed (i.e., still LIVE)
    const lastActiveStream = await prisma.stream.findFirst({
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
    } else {
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
export async function getCurrentStreamDay(): Promise<number> {
    const streamStat = await prisma.streamStat.findFirst();
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
export async function incrementGlobalDayStat(): Promise<void> { 
    await prisma.$transaction(async (tx) => {
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