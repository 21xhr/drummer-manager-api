// src/services/challengeService.ts
import prisma from '../prisma';
import { User, Challenge } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { isStreamLive } from './streamService';

const DIGOUT_COST_PERCENTAGE = 0.21; // 21%
const LIVE_DISCOUNT_MULTIPLIER = 0.79; // 1 - 0.21
const SUBMISSION_BASE_COST = 210; // Base cost for challenge submission


// ------------------------------------------------------------------
// CORE COST CALCULATIONS
// ------------------------------------------------------------------

/**
 * Calculates the quadratic cost for submitting a new challenge, based on the user's
 * daily submission count. Applies live stream discount if applicable.
 */
function calculateSubmissionCost(challengeCountToday: number): number {
    const N = challengeCountToday;
    let cost = SUBMISSION_BASE_COST * ((N + 1) * (N + 1));
    
    // Apply LIVE STREAM Discount (21% off)
    if (isStreamLive()) {
        cost = Math.ceil(cost * LIVE_DISCOUNT_MULTIPLIER); // Round up after discount
    }
    
    return cost;
}

/**
 * Applies the live discount to a calculated cost, rounding up the final value.
 */
function applyLiveDiscount(cost: number): number {
  if (isStreamLive()) {
    return Math.ceil(cost * LIVE_DISCOUNT_MULTIPLIER);
  }
  return cost;
}

////////////////////////////////////////////////////////////////////////////////////////
// PROCESS PUSH QUOTE
////////////////////////////////////////////////////////////////////////////////////////
export async function processPushQuote(
  userId: number,
  challengeId: number,
  quantity: number
): Promise<{ quoteId: string; quotedCost: number; challenge: Challenge }> {
  const challenge = await prisma.challenge.findUnique({
    where: { challengeId: challengeId },
  });

  if (!challenge || challenge.status !== 'Active') {
    throw new Error(`Challenge ID ${challengeId} not found or is not 'Active'.`);
  }
  
  const userPushRecord = await prisma.push.aggregate({
    _sum: { quantity: true },
    where: { userId: userId, challengeId: challengeId },
  });

  const currentUserPushCount = userPushRecord._sum.quantity ?? 0;
  let quotedCost = 0;

  for (let i = 1; i <= quantity; i++) {
    const incrementalCount = currentUserPushCount + i;
    quotedCost += challenge.pushBaseCost * (incrementalCount * incrementalCount); 
  }

  quotedCost = applyLiveDiscount(quotedCost);

  const quoteId = uuidv4();

  await prisma.tempQuote.create({
    data: {
      quoteId: quoteId,
      userId: userId,
      challengeId: challengeId,
      quantity: quantity,
      quotedCost: quotedCost,
      timestampCreated: new Date(), 
      isLocked: false,
    },
  });

  return { quoteId, quotedCost, challenge };
}

////////////////////////////////////////////////////////////////////////////////////////
// PROCESS PUSH CONFIRM
////////////////////////////////////////////////////////////////////////////////////////
export async function processPushConfirm(
  userId: number,
  quoteId?: string
): Promise<{ updatedChallenge: Challenge; transactionCost: number; quantity: number }> {
  
  return prisma.$transaction(async (tx) => {
    const EXPIRATION_TIMEOUT_MS = 30 * 1000;
    let quote;

    if (quoteId) {
        quote = await tx.tempQuote.findUnique({ where: { quoteId: quoteId } });
    } else {
        const allUserQuotes = await tx.tempQuote.findMany({
            where: { userId: userId },
            orderBy: { timestampCreated: 'desc' },
        });

        const activeQuotes = allUserQuotes.filter(q => (Date.now() - q.timestampCreated.getTime()) <= EXPIRATION_TIMEOUT_MS);
        
        if (activeQuotes.length === 1) {
            quote = activeQuotes[0];
        } else if (activeQuotes.length === 0) {
            throw new Error('No active or unexpired quote found. Please run !push [ID] [N] again.');
        } else {
            throw new Error('Multiple active quotes found. Please confirm using the full command: !push confirm [UUID].');
        }
    }

    if (!quote || quote.userId !== userId) {
        throw new Error('Quote is invalid or does not belong to this user.'); 
    }
    
    if (quote.isLocked) {
        throw new Error('This quote is currently being processed by another transaction.');
    }
    
    if ((Date.now() - quote.timestampCreated.getTime()) > EXPIRATION_TIMEOUT_MS) {
        await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });
        throw new Error('The push quote has expired. Please run !push [ID] [N] again.');
    }

    await tx.tempQuote.update({ where: { quoteId: quote.quoteId }, data: { isLocked: true } });

    const challenge = await tx.challenge.findUnique({ where: { challengeId: quote.challengeId } });
    if (!challenge || challenge.status !== 'Active') {
      await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });
      throw new Error(`Challenge ID ${quote.challengeId} is no longer 'Active' and cannot be pushed.`);
    }

    const cost = quote.quotedCost;

    const updatedChallenge = await tx.challenge.update({
      where: { challengeId: challenge.challengeId },
      data: {
        totalPush: { increment: quote.quantity },
        totalNumbersSpent: { increment: cost },
      },
    });

    await tx.push.create({
        data: {
            challengeId: challenge.challengeId,
            userId: userId,
            cost: cost,
            quantity: quote.quantity,
        }
    });

    await tx.user.update({
        where: { id: userId },
        data: {
          totalNumbersSpentGameWide: { increment: cost },
          lastActivityTimestamp: new Date(),
        },
    });

    await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });

    return { updatedChallenge, transactionCost: cost, quantity: quote.quantity };
  });
}

////////////////////////////////////////////////////////////////////////////////////////
// PROCESS DIGOUT
////////////////////////////////////////////////////////////////////////////////////////
export async function processDigout(
  userId: number,
  challengeId: number
): Promise<{ updatedChallenge: Challenge; updatedUser: User; cost: number }> {
  
  return prisma.$transaction(async (tx) => {
    const challenge = await tx.challenge.findUnique({ where: { challengeId: challengeId } });

    if (!challenge || challenge.status !== 'Archived' || challenge.hasBeenDiggedOut) {
      throw new Error(`Digout failed. Status is not 'Archived' or already dug out.`);
    }

    let cost = Math.ceil(challenge.totalNumbersSpent * DIGOUT_COST_PERCENTAGE);
    
    cost = applyLiveDiscount(cost);

    const updatedChallenge = await tx.challenge.update({
      where: { challengeId: challengeId },
      data: {
        status: 'Active', 
        hasBeenDiggedOut: true, 
        streamDaysSinceActivation: 0, 
        timestampLastActivation: new Date(), 
      },
    });

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        totalNumbersSpentGameWide: { increment: cost },
        lastActivityTimestamp: new Date(),
      },
    });

    return { updatedChallenge, updatedUser, cost };
  });
}

////////////////////////////////////////////////////////////////////////////////////////
// PROCESS NEW CHALLENGE SUBMISSION
////////////////////////////////////////////////////////////////////////////////////////
export async function processNewChallengeSubmission(
  userId: number,
  challengeText: string
): Promise<{ newChallenge: Challenge, cost: number }> {

    return prisma.$transaction(async (tx) => {
        // 1. Fetch User's Submission Count for Today
        const user = await tx.user.findUnique({
            where: { id: userId },
            // Need to select the reset timestamp to calculate the daily count
            select: { dailyChallengeResetAt: true } 
        });

        if (!user) {
            throw new Error("User not found during submission process.");
        }

        // We count challenges submitted since the daily reset time.
        // FIX: Renamed 'authorId' to the correct schema field 'proposerUserId'
        const submittedToday = await tx.challenge.count({
            where: {
                proposerUserId: userId, // <--- CORRECTED FIELD NAME
                timestampSubmitted: { // Use the 'timestampSubmitted' field from your schema
                    gte: user.dailyChallengeResetAt, 
                },
            },
        });

        // 2. Calculate Cost (Quadratic logic acts as the limit)
        const cost = calculateSubmissionCost(submittedToday);
        
        // 3. (MOCK) Deduct NUMBERS from user via external API (Lumia/Chatbot)
        // ... success assumed ...

        // 4. Create the new Challenge record
        const newChallenge = await tx.challenge.create({
            data: {
                challengeText: challengeText,
                proposerUserId: userId, // <--- CORRECTED FIELD NAME
                pushBaseCost: 21,
                status: 'Active',
                streamDaysSinceActivation: 0,
                // These fields are required by your schema but not in the original call data:
                category: "General", // Default value
                durationType: "ONE_OFF", // Default value
                timestampSubmitted: new Date(), // Set submission time
                timestampLastActivation: new Date(), // Set activation time
            }
        });

        // 5. Update User Stats: Update spending and total submitted count
        await tx.user.update({
            where: { id: userId },
            data: {
                totalNumbersSpentGameWide: { increment: cost },
                totalChallengesSubmitted: { increment: 1 }, // Also increment the total challenges submitted
                lastActivityTimestamp: new Date(),
            },
        });

        // 6. Return the result
        return { newChallenge, cost };
    });
}

////////////////////////////////////////////////////////////////////////////////////////
// HANDLES ARCHIVAL LOGIC
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Archives challenges that have been active for 21 or more stream days.
 * @returns The number of challenges archived.
 */
export async function archiveExpiredChallenges(): Promise<number> {
    
    // We use updateMany within a transaction block for safety, though it's not strictly necessary here.
    const result = await prisma.$transaction(async (tx) => {
        
        // 1. Find and update all active challenges that have reached or passed the 21-day limit.
        const updateResult = await tx.challenge.updateMany({
            where: {
                status: 'Active',
                streamDaysSinceActivation: { gte: 21 }, // Greater than or equal to 21
            },
            data: {
                status: 'Archived',
            },
        });

        return updateResult.count; // Returns the number of updated records
    });

    console.log(`[ChallengeService] Archived ${result} challenges.`);
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////
// FETCH ACTIVE CHALLENGES
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Fetches all challenges that are currently 'Active'.
 */
export async function getActiveChallenges() {
    return prisma.challenge.findMany({
        where: { status: 'Active' },
        orderBy: { totalNumbersSpent: 'desc' }, // Sort by most pushed, for example
    });
}