// src/services/clockService.ts

import prisma from '../prisma';
import { DurationType, ChallengeStatus, CadenceUnit } from '@prisma/client';
import { archiveExpiredChallenges } from './challengeService'; 

// ------------------------------------------------------------------
// USER TICK LOGIC
// ------------------------------------------------------------------
/**
 * Processes the daily tick for all users using the Two-Watermark system.
 * @param realDay - daysSinceInception (The audit watermark)
 * @param streamDay - streamDaysSinceInception (The stat watermark)
 * @param maintenanceAnchor - The timestamp of the last successful maintenance run
 */
export async function processDailyUserTick(
    realDay: number, 
    streamDay: number, 
    maintenanceAnchor: Date
): Promise<void> {
    
    // 1. Fetch users not audited for this Real-World Day
    const usersToUpdate = await prisma.user.findMany({
        where: { lastProcessedDay: { lt: realDay } },
        select: {
            id: true,
            lastActivityTimestamp: true,
            lastLiveActivityTimestamp: true,
        }
    });

    const cutoffTimeMs = maintenanceAnchor.getTime();

    await Promise.all(usersToUpdate.map(async (user) => {
        const isActiveThisWindow = (user.lastActivityTimestamp?.getTime() ?? 0) > cutoffTimeMs;
        const isActiveLiveThisWindow = (user.lastLiveActivityTimestamp?.getTime() ?? 0) > cutoffTimeMs; 
        
        let updateData: any = {
            lastProcessedDay: realDay 
        };

        if (isActiveThisWindow) {
            updateData.lastSeenDay = realDay;

            if (isActiveLiveThisWindow) {
                updateData.activeStreamDaysCount = { increment: 1 };
                updateData.lastSeenStreamDay = streamDay; 
            } else {
                updateData.activeOfflineDaysCount = { increment: 1 };
            }
        } 
        
        await prisma.user.update({
            where: { id: user.id },
            data: updateData
        });
    }));

    console.log(`[ClockService] Processed Two-Watermark tick for ${usersToUpdate.length} users.`);

    // --- FULL SANITY CHECK ---
    // Ensure only one Challenge is marked as executing (or zero)
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
// CHALLENGE MAINTENANCE LOGIC
// ------------------------------------------------------------------

/**
 * Enforces the contiguity rule for ONE_OFF challenges.
 * Rule: ONE_OFF challenges must be completed within the stream day they start.
 * If they are still in 'InProgress' when this daily maintenance runs, they are failed.
 * @returns {Promise<number>} The number of challenges that failed contiguity.
 */
export async function checkOneOffContiguity(): Promise<number> {
    // The presence in 'InProgress' for a ONE_OFF at the maintenance time is the failure condition.
    const updateResult = await prisma.challenge.updateMany({
        where: {
            status: ChallengeStatus.IN_PROGRESS,
            durationType: DurationType.ONE_OFF,
            isExecuting: false, // Prevents premature archival of a currently running challenge.
        },
        data: {
            status: ChallengeStatus.FAILED, 
            failureReason: 'Contiguity rule broken: Not completed by daily maintenance.',
            // timestampCompleted remains unset (null), which is correct for a failure.
        }
    });
    
    return updateResult.count;
}


// ------------------------------------------------------------------
// RECURRING CADENCE ENFORCEMENT LOGIC
// ------------------------------------------------------------------

/**
 * Enforces the cadence rules for all IN_PROGRESS recurring challenges.
 * Checks if the last period was completed and resets the counter, or fails the challenge.
 */
export async function enforceRecurringChallengeCadence(): Promise<number> {
    const now = new Date();
    let challengesChecked = 0;
    
    // 1. Find all IN_PROGRESS Recurring Challenges that are NOT currently executing
    const recurringChallenges = await prisma.challenge.findMany({
        where: {
            status: ChallengeStatus.IN_PROGRESS,
            durationType: DurationType.RECURRING,
            isExecuting: false,
        }
    });
    
    const failedChallengeIds: number[] = [];

    for (const challenge of recurringChallenges) {
        
        // CRITICAL: Ensure cadencePeriodStart is set. If not, skip (data error).
        if (!challenge.cadencePeriodStart) {
            console.error(`[CRITICAL DATA ERROR] Recurring Challenge #${challenge.challengeId} is IN_PROGRESS but cadencePeriodStart is null. Skipping cadence check.`);
            continue; 
        }
        
        const lastActiveDate = challenge.cadencePeriodStart;
        const requiredCount = challenge.cadenceRequiredCount ?? 1;

        let periodDays = 7; // Default to Weekly
        
        // Determine the period length in days
        if (challenge.cadenceUnit === CadenceUnit.DAILY) {
            periodDays = 1;
        } else if (challenge.cadenceUnit === CadenceUnit.MONTHLY) {
            periodDays = 30; 
        } else if (challenge.cadenceUnit === CadenceUnit.CUSTOM_DAYS) {
            const match = challenge.sessionCadenceText?.match(/every (\d+) days/);
            periodDays = match ? parseInt(match[1], 10) : 7; 
        }

        // --- Core Check: Has the period passed? ---
        const deadline = new Date(lastActiveDate.getTime() + periodDays * 24 * 60 * 60 * 1000);
        const periodPassed = now > deadline;
        
        if (periodPassed) {
            challengesChecked++;
            
            if (challenge.cadenceProgressCounter < requiredCount) {
                // FAILURE: Did not meet the required pace
                failedChallengeIds.push(challenge.challengeId);
                
                await prisma.challenge.update({
                    where: { challengeId: challenge.challengeId },
                    data: {
                        status: ChallengeStatus.FAILED, 
                        failureReason: `Cadence rule broken: Failed to complete ${requiredCount} sessions within the ${challenge.cadenceUnit} period.`,
                        timestampCompleted: now.toISOString(), 
                    }
                });
            } else {
                // SUCCESS: Met the required pace. Reset the counter and advance the period start date.
                await prisma.challenge.update({
                    where: { challengeId: challenge.challengeId },
                    data: {
                        cadenceProgressCounter: 0,         // Reset for the next period
                        cadencePeriodStart: now.toISOString(), // Set the new period's anchor to NOW
                    }
                });
            }
        }
    }
    
    console.log(`[Cadence Check] Checked ${challengesChecked} recurring challenges. Failed ${failedChallengeIds.length}.`);
    return failedChallengeIds.length;
}


// ------------------------------------------------------------------
// 3. DAILY MAINTENANCE ORCHESTRATOR
// ------------------------------------------------------------------
/**
 * Main function to run all scheduled maintenance tasks once per day (e.g., via cron job).
 * This function handles the Real-World Day advance, Archival, and ONE_OFF failure.
 */
export async function runDailyMaintenance(): Promise<"EXECUTED" | "SKIPPED"> {
    const stats = await prisma.streamStat.findUnique({ where: { id: 1 } });
    const now = new Date();

    // 1. Idempotency Check
    if (stats?.lastMaintenanceAt && 
        new Date(stats.lastMaintenanceAt).toDateString() === now.toDateString()) {
        console.log(`[ClockService] Maintenance already performed today. Skipping.`);
        return "SKIPPED";
    }

    // 2. Check for Stream Activity
    const streamOccurred = await prisma.stream.findFirst({
        where: { startTimestamp: { gte: stats?.lastMaintenanceAt || new Date(0) } }
    });

    // 3. Check if a stream is currently LIVE (Safety Layer)
    // Assuming a live stream has a start but no endTimestamp
    const liveStream = await prisma.stream.findFirst({
        where: { endTimestamp: null }
    });

    // 4. Update Global Stats
    const updatedStat = await prisma.streamStat.update({
        where: { id: 1 },
        data: {
            daysSinceInception: { increment: 1 },
            streamDaysSinceInception: streamOccurred ? { increment: 1 } : undefined,
            lastMaintenanceAt: now
        }
    });
    
    // Inside runDailyMaintenance
    const realDay = updatedStat.daysSinceInception;
    const streamDay = updatedStat.streamDaysSinceInception;
    const maintenanceAnchor = stats?.lastMaintenanceAt || new Date(0);

    console.log(`[ClockService] Starting Maintenance.`);
    console.log(` >> Real-World Day: ${realDay} (Calendar advancement)`);
    console.log(` >> Global Stream Day: ${streamDay} (Activity-based advancement)`);

    // --- TASK EXECUTION ---

    // A. Always process User Ticks (Daily engagement)
    await processDailyUserTick(realDay, streamDay, maintenanceAnchor);

    // B. Always check RECURRING Cadence (Real-world time-based)
    const failedCadenceCount = await enforceRecurringChallengeCadence();
    console.log(`[Maintenance] Failed ${failedCadenceCount} RECURRING challenges (Cadence).`);

    // C. Conditional Game-Logic Tasks (Only if a stream occurred and we aren't currently live)
    if (streamOccurred && !liveStream) {
        // 21-Day Expiry
        const archivedCount = await archiveExpiredChallenges();
        console.log(`[Maintenance] Archived ${archivedCount} challenges (21-day limit).`);

        // ONE_OFF Failure
        const failedCount = await checkOneOffContiguity();
        console.log(`[Maintenance] Failed ${failedCount} ONE_OFF challenges (Contiguity).`);
    } else {
        console.log(`[ClockService] Skipping Expiry/Contiguity checks: ${!streamOccurred ? 'No stream occurred.' : 'Stream is currently LIVE.'}`);
    }

    console.log(`[ClockService] Daily maintenance complete.`);
    return "EXECUTED";
}