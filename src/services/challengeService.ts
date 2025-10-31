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

// 2. Calculate the Quadratic Cost (CORRECT IMPLEMENTATION)
// Get the current user's total pushes for this specific challenge
const userPushRecord = await prisma.push.aggregate({
  _sum: { quantity: true },
  where: { 
    userId: userId, 
    challengeId: challengeId 
  },
});

const currentUserPushCount = userPushRecord._sum.quantity || 0; // The N value in the formula
let quotedCost = 0;

// Calculate the sum of squares based on the user's specific push count
for (let i = 1; i <= quantity; i++) {
  const incrementalCount = currentUserPushCount + i;
  // Cost = pushPrice * (current pushes + i)^2
  // We use multiplication instead of **2 for wider compatibility
  quotedCost += challenge.pushPrice * (incrementalCount * incrementalCount); 
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
/**
 * Executes the second stage of the !push command: confirming the quote and executing the push.
 * @param userId - The ID of the user executing the command.
 * @param quoteId - The UUID of the temporary quote record.
 * @returns The updated Challenge record and details of the transaction.
 */
export async function processPushConfirm(
  userId: number,
  quoteId: string
): Promise<{ updatedChallenge: Challenge; transactionCost: number; quantity: number }> {
  
  // Use a transaction to ensure atomicity for the database updates
  return prisma.$transaction(async (tx) => {
    const EXPIRATION_TIMEOUT_MS = 30 * 1000; // 30 seconds
// 1. Fetch TempQuote and check ownership
    const quote = await tx.tempQuote.findUnique({
        where: { quoteId: quoteId },
    });

    if (!quote || quote.userId !== userId) {
        // This covers Quote Not Found and Wrong User
        throw new Error('Quote ID is invalid or does not belong to this user.'); 
    }
    
    // 2. Check Expiration
    const age = Date.now() - quote.timestampCreated.getTime();
    if (age > EXPIRATION_TIMEOUT_MS) {
        // Clean up and throw specific error
        await tx.tempQuote.delete({ where: { quoteId: quoteId } });
        throw new Error('The push quote has expired. Please run !push [ID] [N] again.');
    }

    if (quote.isLocked) {
        throw new Error('This quote is currently being processed by another transaction.');
    }

    
    // 3. Lock the quote to prevent double-spend attempts
    await tx.tempQuote.update({
      where: { quoteId: quoteId },
      data: { isLocked: true },
    });

    // 4. Fetch the target Challenge
    const challenge = await tx.challenge.findUnique({
      where: { challengeId: quote.challengeId },
    });

    if (!challenge || challenge.status !== 'Active') {
      // Clean up the quote since the condition is now invalid
      await tx.tempQuote.delete({ where: { quoteId: quoteId } });
      throw new Error(`Challenge ID ${quote.challengeId} is no longer 'Active' and cannot be pushed.`);
    }

    // --- CRITICAL LOGIC ---
    // 5. (MOCK) Deduct NUMBERS from user via external API (Lumia/Chatbot)
    const cost = quote.quotedCost;
    // In a real system:
    // const deductionSuccess = await callLumiaApiDeduct(user.platformId, cost);
    // if (!deductionSuccess) { 
    //   // Do NOT delete the quote if the external system failed; keep it locked for audit/retry
    //   throw new Error("External NUMBERS deduction failed. Check your balance."); 
    // }
    // ----------------------

    // 6. Execute Database Updates (Only runs if the MOCK deduction above is considered successful)

    // A. Update Challenge
    const updatedChallenge = await tx.challenge.update({
      where: { challengeId: challenge.challengeId },
      data: {
        totalPush: { increment: quote.quantity },
        totalNumbersSpent: { increment: cost },
        // Unique pusher logic would be complex here, often deferred to a separate count query or another table
      },
    });

    // B. Create records in Pushes table (one transaction entry for the total cost)
    await tx.push.create({
        data: {
            challengeId: challenge.challengeId,
            userId: userId,
            cost: cost,
            quantity: quote.quantity, // Add quantity to Push model if you want this detail
        }
    });

    // C. Update User Stats (Update total NUMBERS spent game-wide)
    await tx.user.update({
        where: { id: userId },
        data: {
          totalNumbersSpentGameWide: { increment: cost },
          lastActivityTimestamp: new Date(),
        },
    });

    // 7. Clean up TempQuote
    await tx.tempQuote.delete({ where: { quoteId: quoteId } });

    // 8. Return results
    return { updatedChallenge, transactionCost: cost, quantity: quote.quantity };
  });
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