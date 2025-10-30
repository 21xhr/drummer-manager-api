// src/services/challengeService.ts
import prisma from '../prisma';
import { User, Challenge } from '@prisma/client';

const DIGOUT_COST_PERCENTAGE = 0.21; // 21%

/**
 * Executes the !digout command logic.
 * @param userId - The ID of the user executing the command.
 * @param challengeId - The ID of the challenge to dig out.
 * @returns The updated Challenge record.
 */
export async function processDigout(
  userId: number,
  challengeId: number
): Promise<{ updatedChallenge: Challenge; cost: number }> {
  // Use a transaction to ensure atomicity: read challenge, check user, update challenge.
  return prisma.$transaction(async (tx) => {
    // 1. Fetch Challenge and check conditions (pessimistic locking is ideal but complex for Prisma,
    // so we check conditions within the transaction).
    const challenge = await tx.challenge.findUnique({
      where: { challengeId: challengeId },
    });

    if (!challenge) {
      throw new Error(`Challenge ID ${challengeId} not found.`);
    }

    if (challenge.status !== 'Archived') {
      throw new Error(`Challenge ID ${challengeId} cannot be dug out; current status is not 'Archived'.`);
    }

    if (challenge.hasBeenDiggedOut) {
      throw new Error(`Challenge ID ${challengeId} has already been dug out once.`);
    }

    // 2. Calculate the Cost
    const cost = Math.ceil(challenge.totalNumbersSpent * DIGOUT_COST_PERCENTAGE);

    // --- CRITICAL LOGIC ---
    // 3. (MOCK) Deduct NUMBERS from user via external API (Lumia/Chatbot)
    // In a real system, this is where you'd call the external API:
    // const success = await callLumiaApiDeduct(user.platformId, cost);
    // if (!success) { throw new Error("External API deduction failed."); }
    // ----------------------

    // 4. Update Challenge Status and Clocks
    const updatedChallenge = await tx.challenge.update({
      where: { challengeId: challengeId },
      data: {
        status: 'Active', // Change status from 'Archived' to 'Active'
        hasBeenDiggedOut: true, // Mark as dug out
        streamDaysSinceActivation: 0, // Reset the 21-day clock
        timestampLastActivation: new Date(), // Update the clock start time
      },
    });

    // 5. Update User Stats (Update total NUMBERS spent game-wide)
    // This is crucial for the leaderboard/audit
    await tx.user.update({
      where: { id: userId },
      data: {
        totalNumbersSpentGameWide: {
          increment: cost,
        },
        lastActivityTimestamp: new Date(), // Update user activity
      },
    });

    // 6. Return the result
    return { updatedChallenge, cost };
  });
}

// You can add other challenge-related database functions here (e.g., getChallengeList)