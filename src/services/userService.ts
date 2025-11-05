// src/services/userService.ts
// centralize all database interactions related to the User model into a dedicated service file.
import prisma from '../prisma';
import { User } from '@prisma/client';

// Type definition for the user data coming from the external platform
interface PlatformUser {
  platformId: string;
  platformName: string;
  // You can add more initial fields here if the platform provides them
}

/**
 * Finds a User record by platform ID or creates a new one if it doesn't exist.
 * This is the mandatory first step for processing any user-initiated command.
 * @param platformUser - The user data from the streaming platform (e.g., Twitch, Kick).
 * @returns The existing or newly created User record.
 */
export async function findOrCreateUser(platformUser: PlatformUser): Promise<User> {
  const { platformId, platformName } = platformUser;

  const user = await prisma.user.upsert({
    // 👇 CORRECT WHERE CLAUSE: Uses the composite field name
    where: { 
      platformId_platformName: { // Prisma generates this name based on @@unique([platformId, platformName])
        platformId: platformId,
        platformName: platformName,
      }
    }, 
    update: {
      // Update activity timestamps when an existing user performs a command
      lastActivityTimestamp: new Date(),
      // Note: last_live_activity_timestamp logic needs knowledge of stream status (live/offline)
    },
    create: {
      platformId: platformId,
      platformName: platformName,
      lastActivityTimestamp: new Date(),
      dailyChallengeResetAt: new Date(new Date().setHours(24, 0, 0, 0)), // Default reset to tomorrow midnight
      lastKnownBalance: 0, // Default values are handled by the model, but we can set them explicitly here too
    },
  });

  return user;
}

// You can add other user-related database functions here (e.g., getUserStats, updateUserBalance)