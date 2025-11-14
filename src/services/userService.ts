// src/services/userService.ts
// centralize all database interactions related to the User model into a dedicated service file.
// You can add other user-related database functions here (e.g., getUserStats, updateUserBalance)
import prisma from '../prisma';
import { User } from '@prisma/client';
import { getNextDailyResetTime } from './challengeService';

// Type definition for the user data coming from the external platform
interface PlatformUser {
  platformId: string;
  platformName: string;
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
    // ⭐ SIMPLIFICATION: The 'update' block no longer updates timestamps
    // to avoid redundant writes, as the command function (e.g., processDisrupt)
    // will update them moments later within its transaction.
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

