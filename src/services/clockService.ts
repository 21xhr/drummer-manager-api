// src/services/clockService.ts

import prisma from '../prisma';
import { User, Challenge } from '@prisma/client';
// Import the entire module as 'Prisma' to ensure the namespace is correct
import * as Prisma from '@prisma/client';
import { archiveExpiredChallenges } from './challengeService'; 

// ------------------------------------------------------------------
// 1. USER TICK LOGIC (Provided and Verified)
// ------------------------------------------------------------------

/**
 * Processes the daily tick for all users, updating their active day counters.
 * Should be called once daily at the 21:00 UTC boundary.
 * @param currentStreamDay - The global stream day number to mark users as 'seen'.
 */
export async function processDailyUserTick(currentStreamDay: number): Promise<void> {
    
    // 1. Fetch all users who haven't been processed for the current Stream Day
    const usersToUpdate = await prisma.user.findMany({
        where: {
            lastSeenStreamDay: { lt: currentStreamDay }
        },
        select: {
            id: true,
            lastActivityTimestamp: true,
            lastLiveActivityTimestamp: true,
            activeOfflineDaysCount: true,
            activeStreamDaysCount: true,
        }
    });

    await Promise.all(usersToUpdate.map(async (user) => {
        const nowMs = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const cutoffTimeMs = nowMs - oneDayMs; 
        
        let updateData: any = {
            lastSeenStreamDay: currentStreamDay // Mark user as processed for today
        };
        
        // Use null coalescing to safely access timestamps
        const isActiveToday = (user.lastActivityTimestamp?.getTime() ?? 0) > cutoffTimeMs;
        const isActiveLiveToday = (user.lastLiveActivityTimestamp?.getTime() ?? 0) > cutoffTimeMs; 

        if (isActiveToday) {
            if (isActiveLiveToday) {
                // Active Stream Day
                updateData.activeStreamDaysCount = { increment: 1 };
            } else {
                // Active Offline Day
                updateData.activeOfflineDaysCount = { increment: 1 };
            }
        } 
        
        // Perform the atomic update
        await prisma.user.update({
            where: { id: user.id },
            data: updateData
        });
    }));

    console.log(`[ClockService] Processed daily tick for ${usersToUpdate.length} users.`);

    // ⭐ SANITY CHECK: Ensure only one Challenge is marked as executing (or zero)
    try {
        const executingCount = await prisma.challenge.count({
            where: { isExecuting: true }
        });

        if (executingCount > 1) {
            console.error(`[CRITICAL SANITY CHECK] ${executingCount} Challenges are currently marked as isExecuting=true. This indicates a severe race condition bug.`);
        } else if (executingCount === 1) {
             console.log(`[ClockService] Sanity Check: One Challenge is currently executing.`);
        } else {
             console.log(`[ClockService] Sanity Check: No Challenge is currently executing.`);
        }
    } catch (e) {
        console.error(`[CRITICAL SANITY CHECK FAILED] Could not check executing challenge count:`, e);
    }
}


// ------------------------------------------------------------------
// 2. CHALLENGE MAINTENANCE LOGIC
// ------------------------------------------------------------------

/**
 * Enforces the contiguity rule for ONE_OFF challenges.
 * Rule: ONE_OFF challenges must be completed within the stream day they start.
 * If they are still in 'InProgress' when this daily maintenance runs, they are failed.
 * @returns {Promise<number>} The number of challenges that failed contiguity.
 */
export async function checkOneOffContiguity(): Promise<number> {
    const transactionTimestamp = new Date().toISOString();

    // Find all ONE_OFF challenges that are InProgress (started but not finished)
    // The presence in 'InProgress' for a ONE_OFF at the maintenance time is the failure condition.
    const updateResult = await prisma.challenge.updateMany({
        where: {
            status: 'InProgress',
            durationType: Prisma.DurationType.ONE_OFF,
            isExecuting: false, // Prevents premature archival of a currently running challenge.
        },
        data: {
            status: 'Archived', // Fail and archive the challenge
        }
    });
    
    return updateResult.count;
}

// ------------------------------------------------------------------
// 3. DAILY MAINTENANCE ORCHESTRATOR
// ------------------------------------------------------------------

/**
 * Main function to run all scheduled maintenance tasks once per day (e.g., via cron job).
 * This function handles the Real-World Day advance, Archival, and ONE_OFF failure.
 */
export async function runDailyMaintenance() {
    
    // 1. Advance the Real-World Day Counter and get the current stream day
    // NOTE: We assume a separate, reliable process updates StreamStat.streamDaysSinceInception when a stream starts/ends.
    const updatedStat = await prisma.streamStat.update({
        where: { id: 1 }, // Assuming StreamStat is a singleton with ID 1
        data: {
            daysSinceInception: { increment: 1 }
        }
    });
    
    // The stream day to tick users for is the currently available stream day number
    const currentStreamDay = updatedStat.streamDaysSinceInception;
    
    console.log(`[ClockService] Starting daily maintenance for Real Day ${updatedStat.daysSinceInception}...`);

    // 2. User Activity Tick
    await processDailyUserTick(currentStreamDay); // This is run using the latest available stream day counter
    
    // 3. Archive Expired Active Challenges (21-Day Clock)
    const archivedCount = await archiveExpiredChallenges();
    console.log(`[Maintenance] Archived ${archivedCount} challenges that passed the 21-day limit.`);

    // 4. ONE_OFF Contiguity Check
    const failedCount = await checkOneOffContiguity();
    console.log(`[Maintenance] Failed and Archived ${failedCount} ONE_OFF challenges due to discontinuity.`);

    console.log(`[ClockService] Daily maintenance complete.`);
}