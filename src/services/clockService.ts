// src/services/clockService.ts

import prisma from '../prisma';

/**
 * Processes the daily tick for all users, updating their active day counters.
 * Should be called once daily at the 21:00 UTC boundary.
 * * @param currentStreamDay - The global stream day number to mark users as 'seen'.
 */
export async function processDailyUserTick(currentStreamDay: number): Promise<void> {
    
    // 1. Fetch all users who haven't been processed for the current Stream Day
    // NOTE: This includes the necessary fields for the logic below.
    const usersToUpdate = await prisma.user.findMany({
        where: {
            lastSeenStreamDay: { lt: currentStreamDay } // Users processed on a previous stream day
        },
        select: {
            id: true,
            lastActivityTimestamp: true,
            lastLiveActivityTimestamp: true,
            activeOfflineDaysCount: true,
            activeStreamDaysCount: true,
        }
    });

    // We can run all updates in a single transaction or use Promise.all. 
    // Since we are updating many different users, Promise.all is more performant 
    // than a single large transaction in most ORMs, but we'll stick to a list of individual 
    // atomic updates which are inherently transaction-safe for each user's record.

    await Promise.all(usersToUpdate.map(async (user) => {
        const lastActivity = user.lastActivityTimestamp;
        const lastLiveActivity = user.lastLiveActivityTimestamp;
        
        // ⭐ IMPROVEMENT: Calculate the cutoff time based purely on UTC epoch milliseconds.
        // The current time is the time the CRON job executes.
        // This is the most direct and unambiguous way to calculate a rolling 24-hour window, 
        // as it completely bypasses the need to manipulate date parts 
        // and relies only on the universal millisecond epoch count (Date.now()):
        const nowMs = Date.now();
        // 24 hours in milliseconds
        const oneDayMs = 24 * 60 * 60 * 1000;
        
        // The cutoff is 24 hours before the current execution time.
        const cutoffTimeMs = nowMs - oneDayMs; 
        
        // ----------------------------------------------------------------------------------
        
        let updateData: any = {
            lastSeenStreamDay: currentStreamDay // Mark user as processed for today
        };
        
        // Activity check: Was the user active (spent numbers) within the last 24 hours?
        const isActiveToday = lastActivity && lastActivity.getTime() > cutoffTimeMs;
        
        // Live check: Was the user active LIVE within the last 24 hours?
        // Note: isActiveLiveToday implies isActiveToday is also true, as live activity is also general activity.
        const isActiveLiveToday = lastLiveActivity && lastLiveActivity.getTime() > cutoffTimeMs; 

        if (isActiveToday) {
            if (isActiveLiveToday) {
                // Active Stream Day: Spent numbers/submitted while the stream was live.
                // NOTE: Using increment operator ({ increment: 1 }) is an atomic operation.
                updateData.activeStreamDaysCount = { increment: 1 };
            } else {
                // Active Offline Day: Spent numbers/submitted while the stream was offline.
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
}