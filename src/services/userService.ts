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
  username?: string; // Make this optional (username is for display, not core identity)
  // You can add more initial fields here if the platform provides them
}

const ADMIN_USER_ID = 21; // Define this once in your config/constants
const INITIAL_BALANCE = 500; // Define a starting balance here for testing/incentive

/**
 * Checks if the external identity (platformName + platformId) belongs to the
 * single ADMIN_USER_ID (21), using the new Account table for resolution.
 */
export async function isGameMaster(platformName: PlatformName, platformId: string): Promise<boolean> {
    
    // 1. Find the Account record that matches the incoming external identity.
    const account = await prisma.account.findUnique({
        where: {
            platformId_platformName: {
                platformId: platformId,
                platformName: platformName,
            }
        },
        select: {
            userId: true // Only need the foreign key reference to the Users table
        }
    });

    // 2. Perform the critical check: Does the found account exist AND link to ID 21?
    if (account && account.userId === ADMIN_USER_ID) {
        return true;
    }

    return false;
}


/**
 * Ensures a central User identity exists for a new platform account.
 * This is ONLY called when an Account is created for the very first time.
 */
async function createNewCentralUser(): Promise<User> {
    const user = await prisma.user.create({
        data: {
            // These are the only required fields for a brand new user
            dailyChallengeResetAt: getNextDailyResetTime(),
            lastActivityTimestamp: new Date(),
        }
    });
    return user;
}


/**
 * Finds the User (via Account) or creates a new User/Account pair.
 * @param platformUser - The user data from the streaming platform.
 * @returns The existing or newly created User record.
 */
export async function findOrCreateUser(platformUser: PlatformUser): Promise<User> {
    const { platformId, platformName, username } = platformUser; 
    const transactionTimestamp = new Date();

    // 1. Check if an Account already exists for this platform identity.
    const existingAccount = await prisma.account.findUnique({
        where: {
            platformId_platformName: {
                platformId: platformId,
                platformName: platformName,
            }
        },
        include: {
            user: true // Fetch the linked User record if the Account exists
        }
    });

    if (existingAccount) {
        // Account found: return the linked central User.
        // Update the username on the existing account
        await prisma.account.update({
             where: { id: existingAccount.id },
             data: {
                 username: username,
                 lastActivityTimestamp: transactionTimestamp,
                 // Include other fields you want to update on activity
             }
         });
         return existingAccount.user;
    }

    // 2. Account not found: This is a brand new user/account pair.
    
    // 2a. Create the central User identity first.
    const newUser = await createNewCentralUser();

    // 2b. Create the Account record, linking it to the new User.
    await prisma.account.create({
        data: {
            userId: newUser.id,
            platformId: platformId,
            platformName: platformName,
            username: username, // Save the username on creation
            currentBalance: INITIAL_BALANCE, // Set the initial balance on the platform account
            lastActivityTimestamp: new Date(),
            lastLiveActivityTimestamp: new Date(),
            // No need for lastKnownBalance/lastBalanceUpdate yet, that's done by Lumia sync
        }
    });

    // 3. Return the newly created central User.
    return newUser;
}


/**
 * Fetches and formats comprehensive user statistics for the !mystats chat command.
 * Displays individual account balances and unified wealth.
 * * @param userId - The ID of the user requesting stats.
 * @returns A formatted string containing the user's primary metrics.
 */
export async function processUserStats(userId: number): Promise<string> {
    
    // Fetch user record, including ALL linked accounts to get detailed balances
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true, // Internal User ID
            // Include ALL accounts to get platform names, IDs, balances
            accounts: {
                select: {
                    platformId: true,
                    platformName: true,
                    currentBalance: true,
                    username: true,
                },
                // Order by platform name for stable display order
                orderBy: { platformName: 'asc' }, 
            },
            
            // Core Game Stats (remain on the User table)
            totalNumbersSpent: true,
            totalChallengesSubmitted: true,
            totalRemovalsExecuted: true,
            totalDisruptsExecuted: true,
            totalPushesExecuted: true,
            totalDigoutsExecuted: true, 
            totalReceivedFromRemovals: true, 
            totalCausedByRemovals: true, 
            dailySubmissionCount: true,
            activeOfflineDaysCount: true, 
            activeStreamDaysCount: true,
        },
    });

    if (!user) {
        throw new Error("User record not found.");
    }

    // --- 1. Calculate Unified Balance and Account List ---
    
    let unifiedBalance = 0;
    const accountDetails: string[] = [];

    // Iterate through all linked accounts
    user.accounts.forEach(account => {
        unifiedBalance += account.currentBalance;
        
        // Example: TWITCH (@userA): 100 NUMBERS
        // Using username now, but falling back to platformId if username is null
        const display = account.username || account.platformId;
        
        accountDetails.push(
            `  - **${account.platformName}** (@${display}): **${account.currentBalance.toLocaleString()}** NUMBERS`
        );
    });

    // --- 2. Format and Construct Message ---
    
    // Helper function for formatting numbers
    const format = (n: number | BigInt) => (typeof n === 'bigint' ? n.toString() : n).toLocaleString();

    // Core Financial Stats
    const totalSpent = format(user.totalNumbersSpent);
    const receivedFromRemovals = format(user.totalReceivedFromRemovals);
    const causedByRemovals = format(user.totalCausedByRemovals); 
    
    // Command Execution Counts
    const submissions = format(user.totalChallengesSubmitted);
    const pushes = format(user.totalPushesExecuted);
    const removals = format(user.totalRemovalsExecuted);
    const disrupts = format(user.totalDisruptsExecuted);
    const digouts = format(user.totalDigoutsExecuted); 
    const dailyCount = user.dailySubmissionCount;
    // User Day Counts
    const activeOffline = format(user.activeOfflineDaysCount);
    const activeStream = format(user.activeStreamDaysCount);
    const totalActiveDays = format(user.activeOfflineDaysCount + user.activeStreamDaysCount);

    // Construct the final message
    const statsMessage = 
        `📊 **Stats for User ID: ${user.id}** (${user.accounts.length} Accounts Linked)\n` +
        `\n` + 
        `💰 **[ECONOMIC BREAKDOWN]**\n` +
        accountDetails.join('\n') + // List individual accounts
        `\n` +
        `  **TOTAL WEALTH:** **${format(unifiedBalance)}** NUMBERS\n` +
        `\n` +
        `  SPENT (Total): ${totalSpent} | RECEIVED from !remove: ${receivedFromRemovals}\n` +
        `  WAIVED (Refunds from your !remove): ${causedByRemovals}\n` +
        `\n` +
        `🛠️ **[ACTIVITY]**\n` +
        `  DAYS ACTIVE: ${totalActiveDays} (Stream: ${activeStream} | Offline: ${activeOffline})\n` +
        `  SUBMISSIONS: ${submissions} (N-Count: ${dailyCount})\n` +
        `  PUSHES: ${pushes} | REMOVALS: ${removals} | DIGOUTS: ${digouts} | DISRUPTS: ${disrupts}`;
        
    return statsMessage;
}