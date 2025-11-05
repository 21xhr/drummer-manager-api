// src/services/streamService.ts
// This new service contains the core logic for advancing the 21-day clock on all active challenges, ensuring it only happens once per calendar day, regardless of how many times you stream. It also contains the official source of truth for the isStreamLive() check.
import prisma from '../prisma';
import { archiveExpiredChallenges, finalizeExecutingChallenge} from './challengeService'; // <-- NEW IMPORT

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

        // Check if the current stream start date is different from the last stream's end date
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

        // 2. Update Challenge Clocks (21-Day Counter) (Logic remains the same)
        const activeChallenges = await tx.challenge.findMany({
            where: {
                status: 'Active',
                streamDaysSinceActivation: { lt: 21 } 
            },
        });

        for (const challenge of activeChallenges) {
            const lastActivationDate = challenge.timestampLastActivation.toDateString(); 
            const streamEventDate = streamStartTime.toDateString(); 

            if (streamEventDate !== lastActivationDate) {
                await tx.challenge.update({
                    where: { challengeId: challenge.challengeId },
                    data: {
                        streamDaysSinceActivation: { increment: 1 }, 
                        timestampLastActivation: streamStartTime,
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
export async function processStreamOfflineEvent(streamEndTime: Date): Promise<void> {
    
    // Safety check for an unexpected offline event
    if (!currentStreamSessionId) {
        console.warn(`[StreamService] Offline event received but no active session ID found. Status reset forced.`);
        currentStreamStatus = 'OFFLINE';
        return;
    }

    // Use transaction for atomic DB updates
    await prisma.$transaction(async (tx) => {
        
        // Calculate duration and finalize stats
        const durationMs = streamEndTime.getTime() - currentStreamStartTime!.getTime();
        const durationMinutes = Math.floor(durationMs / (1000 * 60));
        
        // 1. Finalize the Stream Session record
        await tx.stream.update({
            // FIX: Use non-null assertion '!' to satisfy TypeScript compiler (number | null -> number)
            where: { streamSessionId: currentStreamSessionId! }, 
            data: {
                endTimestamp: streamEndTime,
                durationMinutes: durationMinutes,
                hasBeenProcessed: true, 
            }
        });

        // 2. ARCHIVE EXPIRED CHALLENGES (The new step)
        // Note: Because this is an external function, we call the imported service function, 
        // which uses its own prisma client, but runs *after* the stream record is updated.
        const archivedCount = await archiveExpiredChallenges();
        console.log(`[StreamService] Challenge archival complete. ${archivedCount} challenges archived.`);

        // 3. FINALIZE CURRENTLY EXECUTING CHALLENGE (New Step)
        const completedChallenge = await finalizeExecutingChallenge();
        if (completedChallenge) {
            console.log(`[StreamService] Challenge #${completedChallenge.challengeId} completed upon stream end.`);
        }

        // 4. Reset In-Memory Status (same as before)
        currentStreamStatus = 'OFFLINE';
        currentStreamStartTime = null;
        currentStreamSessionId = null;
        console.log(`[StreamService] Stream set to OFFLINE. Session finalized.`);
    });
}

/**
 * Returns the ID of the currently active stream session from the in-memory state.
 */
export function getCurrentStreamSessionId(): number | null {
  return currentStreamSessionId;
}