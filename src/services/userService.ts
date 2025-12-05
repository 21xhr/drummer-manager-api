// src/services/userService.ts
// centralize all database interactions related to the User model into a dedicated service file.
// You can add other user-related database functions here (e.g., getUserStats, updateUserBalance)
import prisma from '../prisma';
import { User, PlatformName } from '@prisma/client';
import { getNextDailyResetTime } from './challengeService';

// Type definition for the user data coming from the external platform
interface PlatformUser {
  platformId: string;
  platformName: PlatformName;
  // You can add more initial fields here if the platform provides them
}


/**
 * Finds a User record by platform ID or creates a new one if it doesn't exist.
 * Now primarily handles initial user creation and returns the existing user on subsequent calls.
 * This is the mandatory first step for processing any user-initiated command.
 * The timestamp updating is delegated to the specific command functions (e.g., processDisrupt).
 * @param platformUser - The user data from the streaming platform (e.g., Twitch, Kick).
 * @returns The existing or newly created User record.
 */
export async function findOrCreateUser(platformUser: PlatformUser): Promise<User> {
  const { platformId, platformName } = platformUser;

  const INITIAL_BALANCE = 500; // Define an starting balance here for testing/incentive

  const user = await prisma.user.upsert({
    where: { 
      platformId_platformName: { // Prisma generates this name based on @@unique([platformId, platformName])
        platformId: platformId,
        platformName: platformName,
      }
    }, 
    // ⭐ SIMPLIFICATION: The 'update' block no longer updates activity timestamps.
    // The responsibility for setting 'lastActivityTimestamp' is delegated to the specific service function
    // (e.g., processDisrupt, processChallengeSubmission) to avoid redundant writes.
    update: {}, 
    create: {
      platformId: platformId,
      platformName: platformName,
      lastActivityTimestamp: new Date(), // Set initial timestamp on creation
      dailyChallengeResetAt: getNextDailyResetTime(),
      lastKnownBalance: INITIAL_BALANCE,
    },
  });

  return user;
}


/**
 * Fetches and formats comprehensive user statistics for the !mystats chat command.
 * @param userId - The ID of the user requesting stats.
 * @returns A formatted string containing the user's primary metrics.
 */
export async function processUserStats(userId: number): Promise<string> {
    
    // Fetch user record with all the necessary metrics
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            platformId: true,
            lastKnownBalance: true,
            totalNumbersSpent: true,
            totalChallengesSubmitted: true,
            totalRemovalsExecuted: true,
            totalDisruptsExecuted: true,
            totalPushesExecuted: true,
            totalDigoutsExecuted: true, // Added
            totalReceivedFromRemovals: true, // Added
            totalCausedByRemovals: true, // Added
            dailySubmissionCount: true,
        },
    });

    if (!user) {
        throw new Error("User record not found.");
    }

    // ⭐ Format numbers for readability (e.g., 1,234)
    // Note: BigInts (like totalCausedByRemovals) need to be converted to String before toLocaleString()
    const format = (n: number | BigInt) => (typeof n === 'bigint' ? n.toString() : n).toLocaleString();

    // 1. Core Financial Stats
    const balance = format(user.lastKnownBalance);
    const spent = format(user.totalNumbersSpent);
    const receivedFromRemovals = format(user.totalReceivedFromRemovals);

    // 2. Economic Impact (Liabilities)
    const causedByRemovals = format(user.totalCausedByRemovals); 
    
    // 3. Command Execution Counts
    const submissions = format(user.totalChallengesSubmitted);
    const pushes = format(user.totalPushesExecuted);
    const removals = format(user.totalRemovalsExecuted);
    const disrupts = format(user.totalDisruptsExecuted);
    const digouts = format(user.totalDigoutsExecuted); // Added

    // 4. Status/Context
    const dailyCount = user.dailySubmissionCount; // N for quadratic cost

    const statsMessage = 
        `📊 **@${user.platformId}'s Stats**\n` +
        `\n` + 
        `💰 **[ECONOMIC]**\n` +
        `  BALANCE: **${balance}** NUMBERS\n` +
        `  SPENT: ${spent} | RECEIVED from !remove: ${receivedFromRemovals}\n` +
        `  LIABILITY (Caused by your !remove): ${causedByRemovals}\n` +
        `\n` +
        `🛠️ **[ACTIVITY]**\n` +
        `  SUBMISSIONS: ${submissions} (N-Count: ${dailyCount})\n` +
        `  PUSHES: ${pushes} | REMOVALS: ${removals} | DIGOUTS: ${digouts} | DISRUPTS: ${disrupts}`;
        
    return statsMessage;
}