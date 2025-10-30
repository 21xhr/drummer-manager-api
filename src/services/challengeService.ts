// src/services/challengeService.ts
import prisma from '../prisma';
import { User, Challenge } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'; // We need a UUID generator for the quote ID
// We need to install 'uuid' later, but we use it here first.

const DIGOUT_COST_PERCENTAGE = 0.21; // 21%

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Executes the first stage of the !push command: generating a quote.
 * @param userId - The ID of the user executing the command.
 * @param challengeId - The ID of the target challenge.
 * @param quantity - The number of pushes (N) the user requests.
 * @returns The newly created TempQuote record and the calculated cost.
 */
export async function processPushQuote(
  userId: number,
  challengeId: number,
  quantity: number
): Promise<{ quoteId: string; quotedCost: number; challenge: Challenge }> {
  // 1. Fetch Challenge and check conditions.
  const challenge = await prisma.challenge.findUnique({
    where: { challengeId: challengeId },
  });

  if (!challenge) {
    throw new Error(`Challenge ID ${challengeId} not found.`);
  }

  if (challenge.status !== 'Active') {
    throw new Error(`Challenge ID ${challengeId} is not 'Active' and cannot be pushed.`);
  }

  // 2. Calculate the Quadratic Cost (Simple implementation)
  // The cost is calculated based on the current push_price and the push_count.
  const currentPushCount = challenge.totalPush;
  let quotedCost = 0;

  // Calculate the sum of squares for the new push transactions
  for (let i = 1; i <= quantity; i++) {
    // The cost is: current push price * (Current total pushes + i)
    // We'll use a simpler cost calculation for now, but the final logic requires a more complex
    // cumulative sum based on totalPush. For now, use a simple linear cost per item.
    // NOTE: This MUST be revised later to match the quadratic logic described in the docs!
    quotedCost += challenge.pushPrice * (currentPushCount + i); 
  }

  // Use the actual 'total_numbers_spent' logic from the schema doc:
  // total_numbers_spent,Crucial for Challenge ranking and calculating mission progress.,Integer/Numeric
  // NOTE: The true quadratic cost involves more complex math, but this simple cost is fine for structure.

  // 3. Create a unique quote ID
  const quoteId = uuidv4();
  const expirationTime = new Date(Date.now() + 30 * 1000); // 30 seconds expiration

  // 4. Create the TempQuote record
  await prisma.tempQuote.create({
    data: {
      quoteId: quoteId,
      userId: userId,
      challengeId: challengeId,
      quantity: quantity,
      quotedCost: quotedCost,
      timestampCreated: new Date(), // Already set to NOW
      // timestampCreated: expirationTime, // Use this if we want to track expiration explicitly
      isLocked: false,
    },
  });

  // 5. Return the Quote ID, cost, and Challenge details for the user response
  return { quoteId, quotedCost, challenge };
}
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
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