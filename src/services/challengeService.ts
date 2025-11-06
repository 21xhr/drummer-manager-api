// src/services/challengeService.ts
import prisma from '../prisma';
import { User, Challenge } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { isStreamLive, getCurrentStreamSessionId} from './streamService';

const DIGOUT_COST_PERCENTAGE = 0.21; // 21%
const LIVE_DISCOUNT_MULTIPLIER = 0.79; // 1 - 0.21
const SUBMISSION_BASE_COST = 210; // Base cost for challenge submission


// ------------------------------------------------------------------
// CORE COST CALCULATIONS
// ------------------------------------------------------------------

/**
 * Calculates the next 21:00 UTC time that is in the future.
 * If 21:00 UTC today has passed, it returns 21:00 UTC tomorrow.
 * @returns Date object representing the next 21:00 UTC reset time.
 */
export function getNextDailyResetTime(): Date {
    const now = new Date();
    
    // 1. Start with today's date and set the time to 21:00:00.000 UTC
    const nextReset = new Date(now.getTime());
    nextReset.setUTCHours(21, 0, 0, 0);

    // 2. If 21:00 UTC today has already passed, advance to the next day
    if (nextReset <= now) {
        nextReset.setUTCDate(nextReset.getUTCDate() + 1);
    }
    
    return nextReset;
}

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
  // 1. Fetch Challenge Details for validation and base cost
  const challenge = await prisma.challenge.findUnique({
    where: { challengeId: challengeId },
  });

  if (!challenge || challenge.status !== 'Active') {
    throw new Error(`Challenge ID ${challengeId} not found or is not 'Active'.`);
  }
  
  // 2. Determine the user's current push count for THIS challenge.
  // This is CRITICAL for the per-user quadratic scaling.
  const userPushRecord = await prisma.push.aggregate({
    _sum: { quantity: true },
    where: { userId: userId, challengeId: challengeId },
  });

  // 'currentUserPushCount' is the N-value for the last push this user made.
  const currentUserPushCount = userPushRecord._sum.quantity ?? 0; 
  let quotedCost = 0;

  // 3. Calculate the new quadratic cost for the requested quantity.
  // The loop calculates the cost for the N+1, N+2, ... pushes.
  for (let i = 1; i <= quantity; i++) {
    // 'incrementalCount' is the index (1st, 2nd, 3rd...) of the push this user is making.
    const incrementalCount = currentUserPushCount + i;
    // Cost formula: Base Cost * (User's Push Index)^2
    quotedCost += challenge.pushBaseCost * (incrementalCount * incrementalCount); 
  }

  // 4. Apply 21% discount if the stream is currently live.
  quotedCost = applyLiveDiscount(quotedCost);

  const quoteId = uuidv4();

  // 5. Save the generated quote to the temporary quote table.
  await prisma.tempQuote.create({
    data: {
      quoteId: quoteId,
      userId: userId,
      challengeId: challengeId,
      quantity: quantity,
      quotedCost: quotedCost,
      timestampCreated: new Date().toISOString(), 
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
  quoteId?: string // Optional UUID provided by the user via chat command (!push confirm [UUID])
): Promise<{ updatedChallenge: Challenge; transactionCost: number; quantity: number }> {
  
  // Start an atomic database transaction. This ensures that all steps—
  // from validation to updates—either fully succeed or fully fail.
  return prisma.$transaction(async (tx) => {
    const EXPIRATION_TIMEOUT_MS = 30 * 1000; // 30-second quote validity
    let quote;

    // --- 1. QUOTE RETRIEVAL & LOOKUP LOGIC ---
    if (quoteId) {
        // If a UUID is provided, fetch that specific quote.
        quote = await tx.tempQuote.findUnique({ where: { quoteId: quoteId } });
    } else {
        // If no UUID is provided, attempt to find the most recent, active quote for this user.
        const allUserQuotes = await tx.tempQuote.findMany({
            where: { userId: userId },
            orderBy: { timestampCreated: 'desc' },
        });

        // Filter for quotes that are still within the 30-second window.
        const activeQuotes = allUserQuotes.filter(q => (Date.now() - q.timestampCreated.getTime()) <= EXPIRATION_TIMEOUT_MS);
        
        if (activeQuotes.length === 1) {
            quote = activeQuotes[0];
        } else if (activeQuotes.length === 0) {
            throw new Error('No active or unexpired quote found. Please run !push [ID] [N] again.');
        } else {
            // Safety check: Prevents ambiguity if a user somehow generates multiple quotes quickly.
            throw new Error('Multiple active quotes found. Please confirm using the full command: !push confirm [UUID].');
        }
    }

    // --- 2. CORE QUOTE VALIDATION ---
    if (!quote || quote.userId !== userId) {
        throw new Error('Quote is invalid or does not belong to this user.'); 
    }
    
    // Concurrency lock: Check if the quote is already being processed.
    if (quote.isLocked) {
        throw new Error('This quote is currently being processed by another transaction.');
    }
    
    // Expiration check: If the quote is older than 30 seconds, delete it and fail the transaction.
    if ((Date.now() - quote.timestampCreated.getTime()) > EXPIRATION_TIMEOUT_MS) {
        await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });
        throw new Error('The push quote has expired. Please run !push [ID] [N] again.');
    }

    // --- 3. LOCK QUOTE & CHALLENGE VALIDATION ---
    // Acquire the lock to prevent a race condition where two requests confirm the same quote.
    await tx.tempQuote.update({ where: { quoteId: quote.quoteId }, data: { isLocked: true } });

    // Ensure the challenge is still active before applying pushes.
    const challenge = await tx.challenge.findUnique({ where: { challengeId: quote.challengeId } });
    if (!challenge || challenge.status !== 'Active') {
      await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } }); // Clean up the quote
      throw new Error(`Challenge ID ${quote.challengeId} is no longer 'Active' and cannot be pushed.`);
    }

    // --- 4. ATOMIC DATABASE UPDATES ---
    const cost = quote.quotedCost;

    // A. Update Challenge: Increment total push count and total cost spent on the challenge.
    const updatedChallenge = await tx.challenge.update({
      where: { challengeId: challenge.challengeId },
      data: {
        totalPush: { increment: quote.quantity },
        totalNumbersSpent: { increment: cost },
      },
    });

    // B. Record Push: Create a historical record of this specific push transaction.
    await tx.push.create({
        data: {
            challengeId: challenge.challengeId,
            userId: userId,
            cost: cost,
            quantity: quote.quantity,
        }
    });

    // C. Update User: Update the individual user's spending.
    await tx.user.update({
        where: { id: userId },
        data: {
            lastKnownBalance: { decrement: cost }, // Deduct cost from balance
            totalNumbersSpent: { increment: cost }, // User's individual spending
            lastActivityTimestamp: new Date().toISOString(),
            totalPushesExecuted: { increment: quote.quantity },
        },
    });

    // D. Update Global Ledger (User ID 1): Increment the community's game-wide spending.
    await tx.user.updateMany({
        where: { id: 1 }, 
        data: {
            totalNumbersSpentGameWide: { increment: cost }, // Global spending ledger
        }
    });

    // --- 5. CLEANUP ---
    // Delete the temporary quote now that the transaction is successfully recorded.
    await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });

    return { updatedChallenge, transactionCost: cost, quantity: quote.quantity };
  });
}

////////////////////////////////////////////////////////////////////////////////////////
// PROCESS DIGOUT
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Revives an 'Archived' challenge, deducting 21% of its total spent cost from the user.
 * @param userId - The ID of the user executing the command.
 * @param challengeId - The ID of the challenge to dig out.
 * @returns The updated Challenge and User records.
 */
export async function processDigout(userId: number, challengeId: number) {
    
    return prisma.$transaction(async (tx) => {
        // 1. Fetch Challenge and User for validation
        const challenge = await tx.challenge.findUnique({
            where: { challengeId: challengeId },
        });

        const user = await tx.user.findUnique({
            where: { id: userId },
        });

        if (!challenge) {
            throw new Error(`Challenge ID ${challengeId} not found.`);
        }
        
        if (!user) {
            throw new Error(`User ID ${userId} not found during transaction.`);
        }

        if (challenge.status !== 'Archived') {
            throw new Error(`Challenge #${challengeId} cannot be dug out: Status is '${challenge.status}'.`);
        }

        if (challenge.hasBeenDiggedOut) {
            throw new Error(`Challenge #${challengeId} has already been dug out once and cannot be revived again.`);
        }

        // 2. Calculate Cost (21% of total_numbers_spent, rounded up)
        const digoutCost = Math.ceil(challenge.totalNumbersSpent * 0.21);

        if (user.lastKnownBalance < digoutCost) { 
            throw new Error(`Insufficient balance. Digout costs ${digoutCost} NUMBERS.`);
        }

        // 3. Execute Transaction: Deduct cost, update user, and update challenge
        
        // Deduct cost from user balance and update individual spending
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                lastKnownBalance: { decrement: digoutCost },
                totalNumbersSpent: { increment: digoutCost }, // User's individual spending
                totalDigoutsExecuted: { increment: 1 },
                lastActivityTimestamp: new Date().toISOString(), 
            },
        });

        // Update Global Ledger (User ID 1): Increment the community's game-wide spending.
        await tx.user.updateMany({
            where: { id: 1 }, 
            data: {
                totalNumbersSpentGameWide: { increment: digoutCost }, // Global spending ledger
            }
        });


        // Revive Challenge and reset clock
        const updatedChallenge = await tx.challenge.update({
            where: { challengeId: challengeId },
            data: {
                status: 'Active', // CHANGE STATUS
                streamDaysSinceActivation: 0, // RESET CLOCK
                timestampLastActivation: new Date().toISOString(), // UPDATE ACTIVATION TIME
                hasBeenDiggedOut: true, // SET DIGOUT FLAG (can only be done once)
            },
        });

        // 4. Return results
        return { 
            updatedChallenge, 
            updatedUser, 
            cost: digoutCost 
        };
    });
}

////////////////////////////////////////////////////////////////////////////////////////
// PROCESS CHALLENGE SUBMISSION
////////////////////////////////////////////////////////////////////////////////////////
// src/services/challengeService.ts (Updated processChallengeSubmission)

export async function processChallengeSubmission(
  userId: number,
  challengeText: string
): Promise<{ newChallenge: Challenge, cost: number }> {

    return prisma.$transaction(async (tx) => {
        // 1. Fetch User's Reset Time
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { dailyChallengeResetAt: true } 
        });

        if (!user) {
            throw new Error("User not found during submission process.");
        }
        
        // --- CONDITIONAL RESET LOGIC ---
        let currentResetTime = user.dailyChallengeResetAt;
        const now = new Date();

        if (now > currentResetTime) {
            // The daily window has expired. Calculate and update the new reset time.
            const nextReset = getNextDailyResetTime();

            // Update the user's record with the new reset time.
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    dailyChallengeResetAt: nextReset,
                },
                select: { dailyChallengeResetAt: true }
                // ensures the freshly written timestamp is immediately retrieved 
                // and used correctly for the quadratic cost calculation later in the transaction.
            });
            currentResetTime = updatedUser.dailyChallengeResetAt;
        }

        // 2. Count Challenges Submitted since the latest Reset Time.
        const submittedToday = await tx.challenge.count({
            where: {
                proposerUserId: userId,
                timestampSubmitted: {
                    gte: currentResetTime, 
                },
            },
        });

        // 3. Calculate Cost (Quadratic logic acts as the limit)
        const cost = calculateSubmissionCost(submittedToday);
        
        // 4. (MOCK) Deduct NUMBERS from user via external API (Lumia/Chatbot)
        // ... success assumed ...

        // 5. Create the new Challenge record
        const newChallenge = await tx.challenge.create({
            data: {
                challengeText: challengeText,
                proposerUserId: userId,
                pushBaseCost: 21,
                status: 'Active',
                streamDaysSinceActivation: 0,
                category: "General", // Default value
                durationType: "ONE_OFF", // Default value
                timestampSubmitted: new Date().toISOString(),
                timestampLastActivation: new Date().toISOString(),
            }
        });

        // 6. Update User Stats: Deduct balance, update spending, and submission count
        await tx.user.update({
            where: { id: userId },
            data: {
                lastKnownBalance: { decrement: cost }, // Deduct cost from balance
                totalNumbersSpent: { increment: cost }, // User's individual spending
                totalChallengesSubmitted: { increment: 1 },
                lastActivityTimestamp: new Date().toISOString(),
            },
        });

        // 7. Update Global Ledger (User ID 1): Increment the community's game-wide spending.
        await tx.user.updateMany({
            where: { id: 1 }, 
            data: {
                totalNumbersSpentGameWide: { increment: cost }, // Global spending ledger
            }
        });


        // 8. Return the result
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
// FINALIZE EXECUTING CHALLENGE
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Finds the currently executing challenge (Status: 'InProgress') and sets its status to 'Completed'
 * when the stream goes offline.
 * @returns The completed Challenge record, or null if none was executing.
 */
export async function finalizeExecutingChallenge(): Promise<Challenge | null> {
    
    // This runs outside a transaction, using the standard Prisma client, similar to archiveExpiredChallenges.
    
    // 1. Find the currently executing challenge
    const executingChallenge = await prisma.challenge.findFirst({
        where: { 
            status: 'InProgress', 
            isExecuting: true 
        },
    });

    if (!executingChallenge) {
        console.log("[ChallengeService] No challenge found in 'InProgress' status to finalize.");
        return null;
    }

    // 2. Update its status to 'Completed', set isExecuting to false, and record the completion time.
    const completedChallenge = await prisma.challenge.update({
        where: { challengeId: executingChallenge.challengeId },
        data: {
            status: 'Completed',
            isExecuting: false,
            timestampCompleted: new Date().toISOString(), 
        }
    });

    console.log(`[ChallengeService] Challenge #${completedChallenge.challengeId} finalized as 'Completed'.`);
    
    // Future reward/metric logic would go here.

    return completedChallenge;
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

////////////////////////////////////////////////////////////////////////////////////////
// PROCESS CHALLENGES REMOVAL
////////////////////////////////////////////////////////////////////////////////////////
 /**
 * Allows the Challenge author to remove their Challenge, refunding 21% of
 * the total spent cost back to all contributing pushers via an external API call.
 * @param authorUserId - The ID of the user executing the command (must be the author).
 * @param challengeId - The ID of the challenge to remove.
 */
export async function processRemove(authorUserId: number, challengeId: number) {
    
    const refundsToProcess: { userId: number, refundAmount: number }[] = [];
    let totalRefundsAmount = 0;
    
    // Fetch the current Stream Session ID ONCE before the transaction begins
    const currentStreamSessionId = getCurrentStreamSessionId(); 

    // --- STEP 1: ATOMIC DATABASE TRANSACTION (Local State Change: Challenge/Global) ---
    const result = await prisma.$transaction(async (tx) => {
        // 1. Validation and Fetch
        const challenge = await tx.challenge.findUnique({
            where: { challengeId: challengeId },
        });

        if (!challenge) {
            throw new Error(`Challenge ID ${challengeId} not found.`);
        }

        if (challenge.proposerUserId !== authorUserId) {
            throw new Error(`Challenge #${challengeId} can only be removed by the author.`);
        }

        if (['Archived', 'Auctioning','InProgress', 'Completed', 'Removed'].includes(challenge.status)) { 
             throw new Error(`Challenge #${challengeId} cannot be removed while in status: ${challenge.status}.`);
        }  
        
        // 2. Calculate Refunds (Store details, DO NOT update balance yet)
        const pusherContributions = await tx.push.groupBy({
            by: ['userId'],
            where: { challengeId: challengeId },
            _sum: { cost: true },
        });

        for (const contribution of pusherContributions) {
            const spent = contribution._sum?.cost || 0; 
            const refund = Math.floor(spent * 0.21); 
            
            if (refund > 0) {
                totalRefundsAmount += refund;
                refundsToProcess.push({ userId: contribution.userId, refundAmount: refund });
            }
        }

        // --- 3. UPDATE LEDGERS (Transaction Totals) ---
        
        // 3a. Update Global Ledger (ID 1): Track Gross Refund
        await tx.user.updateMany({
            where: { id: 1 }, 
            data: {
                // This updates the GLOBAL counter for all refunds ever processed
                totalNumbersReturnedFromRemovalsGameWide: { increment: totalRefundsAmount }
            }
        });

        // 3b. Update Stream Session Metrics (Only if a stream is active)
        if (currentStreamSessionId) {
            await tx.stream.update({
                where: { streamSessionId: currentStreamSessionId },
                data: {
                    totalRemovalsInSession: { increment: 1 },
                    totalNumbersReturnedFromRemovalsInSession: { increment: totalRefundsAmount }
                }
            });
        }
        
        // 3c. Update Author's Per-User Stats (User who ran the !remove command)
        await tx.user.update({
            where: { id: authorUserId },
            data: {
                totalRemovalsExecuted: { increment: 1 },
                lastActivityTimestamp: new Date().toISOString(),
            }
        });


        // 4. Update Challenge Status (CRITICAL STATE CHANGE)
        const updatedChallenge = await tx.challenge.update({
            where: { challengeId: challengeId },
            data: {                            
                status: 'Removed', 
                isExecuting: false
            },
        });

        return { updatedChallenge, refundsToProcess, totalRefundsAmount };
    });

    // --- STEP 2: EXTERNAL REFUND CALLS (Lumia API INTEGRATION POINT) ---
    const successfulRefunds: { userId: number, amount: number }[] = [];
    
    for (const refundDetail of result.refundsToProcess) {
        // ⚠️ REAL-WORLD INTEGRATION: Here, you would await a function:
        // const success = await callLumiaRefundAPI(refundDetail.userId, refundDetail.refundAmount);

        // For now, we simulate success:
        const success = true; // Assume Lumia API call was successful
        
        if (success) {
            // STEP 3: FINALIZATION (Local Balance & Per-User Refund Update) 
            await prisma.user.update({
                where: { id: refundDetail.userId },
                data: {
                    lastKnownBalance: { increment: refundDetail.refundAmount },
                    // 🚨 USING THE CORRECT FIELD NAME: totalReceivedFromRemovals
                    totalReceivedFromRemovals: { increment: refundDetail.refundAmount } 
                },
            });
            successfulRefunds.push({ userId: refundDetail.userId, amount: refundDetail.refundAmount });
        } else {
            // ERROR HANDLING: Log the failure. A manual check/retry for this user might be necessary.
            console.error(`[LUMIA REFUND FAILED] Failed to refund ${refundDetail.refundAmount} to User ID ${refundDetail.userId}. Manual review needed.`);
        }
    }


    // --- STEP 4: FINAL RESPONSE ---
    return {
        updatedChallenge: result.updatedChallenge,
        refundsProcessed: successfulRefunds.length,
        totalRefundsAmount: result.totalRefundsAmount,
        failedRefunds: result.refundsToProcess.length - successfulRefunds.length
    };
}