// src/services/challengeService.ts
import prisma from '../prisma';
import { User, Challenge } from '@prisma/client';
import { v4 } from 'uuid'; // <-- CRITICAL: Use the simple named import
import { isStreamLive, getCurrentStreamSessionId} from './streamService';

// --- GLOBAL CONFIGURATION (SCREAMING_SNAKE_CASE) ---
const DIGOUT_COST_PERCENTAGE = 0.21; // 21%
const LIVE_DISCOUNT_MULTIPLIER = 0.79; // 1 - 0.21
const SUBMISSION_BASE_COST = 210; // Base cost for challenge submission
const DISRUPT_COST = 2100; // Fixed cost for Disrupt
export type RefundOption = 'community_forfeit' | 'pusher_refund' | 'author_and_chest' | 'author_and_pushers';

// ------------------------------------------------------------------
// CORE COST CALCULATIONS
// ------------------------------------------------------------------

/**
 * Calculates the next 21:00 UTC time that is in the future.
 * If 21:00 UTC today has passed, it returns 21:00 UTC tomorrow.
 * @returns {string} The next 21:00 UTC reset time as a standardized ISO 8601 string.
 */
export function getNextDailyResetTime(): string {
    const now = new Date();
    
    // 1. Start with today's date and set the time to 21:00:00.000 UTC
    const nextReset = new Date(now.getTime());
    nextReset.setUTCHours(21, 0, 0, 0);

    // 2. If 21:00 UTC today has already passed, advance to the next day
    if (nextReset <= now) {
        nextReset.setUTCDate(nextReset.getUTCDate() + 1);
    }
    
    return nextReset.toISOString(); // ⭐ CRITICAL: Convert to an unambiguous ISO string for storage/consistency.
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
    // This check strictly enforces the rule: Pushes only promote Active Challenges.
    // This implicitly blocks challenges that are InProgress (regardless of session count), Completed, etc.
    throw new Error(`Challenge ID ${challengeId} not found or is not 'Active'. Pushes are only allowed on 'Active' challenges.`);
  }
  
  // 2. Determine the user's current push count for THIS challenge.
  const userPushRecord = await prisma.push.aggregate({
    _sum: { quantity: true },
    where: { userId: userId, challengeId: challengeId },
  });

  const currentUserPushCount = userPushRecord._sum.quantity ?? 0; 
  let quotedCost = 0;

  // 3. Calculate the new quadratic cost for the requested quantity.
  for (let i = 1; i <= quantity; i++) {
    const incrementalCount = currentUserPushCount + i;
    // Cost formula: Base Cost * (User's Push Index)^2
    quotedCost += challenge.pushBaseCost * (incrementalCount * incrementalCount); 
  }

  // 4. Apply 21% discount if the stream is currently live.
    quotedCost = applyLiveDiscount(quotedCost); // <-- Keep this if function is implemented!

  // --- 4.5. CRITICAL: BALANCE PRE-CHECK ---
  const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastKnownBalance: true } 
  });
  
  if (!user) {
      throw new Error(`User ID ${userId} not found during push quote generation.`);
  }

  // Optimistic check: if the user's current known balance is less than the quote, fail fast.
  if (user.lastKnownBalance < quotedCost) {
      throw new Error(`Insufficient balance. Quoted push cost is ${quotedCost} NUMBERS.`);
  }

  // --- 5. Save the generated quote to the temporary quote table.
  // 1. Generate the unique ID and declare the variable
    const quoteId = v4();

    await prisma.tempQuote.create({
    data: {
        // 2. Use the defined variable. (Shorthand is clean here)
        quoteId, 
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
  quoteId?: string 
): Promise<{ updatedChallenge: Challenge; transactionCost: number; quantity: number }> {
    const currentStreamSessionId = getCurrentStreamSessionId(); 
    // ⭐ FIX: Define transactionTimestamp once
    const transactionTimestamp = new Date().toISOString();

  return prisma.$transaction(async (tx) => {
    const EXPIRATION_TIMEOUT_MS = 30 * 1000;
    let quote;
    const expirationCutoff = new Date(Date.now() - EXPIRATION_TIMEOUT_MS); 

    // --- 1. QUOTE RETRIEVAL & LOOKUP LOGIC ---
    if (quoteId) {
        // Case A: Direct lookup by UUID. We MUST still fetch the quote even if expired
        // because we need its timestamp to check validity in Step 2.
        quote = await tx.tempQuote.findUnique({ where: { quoteId: quoteId } });

    } else {
        // Case B: Efficiently find the single most recent, ACTIVE quote.
        // prevents fetching large amounts of history.
        const latestQuote = await tx.tempQuote.findFirst({
            where: { 
                userId: userId,
                // filter by expiration to avoid confirming a truly stale quote
                timestampCreated: { gte: expirationCutoff }, 
                isLocked: false, 
            },
            orderBy: { timestampCreated: 'desc' }, 
        });
        
        if (!latestQuote) {
            throw new Error('No active quote found. Please run !push [ID] [N] again.');
        } 
        
        // Use the single latest quote found. Older quotes are ignored by default.
        quote = latestQuote;
    }

    // --- 2. CORE QUOTE VALIDATION (Standardized Checks) ---
    if (!quote || quote.userId !== userId) {
        throw new Error('Quote is invalid or does not belong to this user.'); 
    }

    // **CRITICAL: EXPIRATION CHECK** - This now covers BOTH Case A (explicit ID) and 
    // Case B (where the quote *should* be active, but checking guards against clock drift or manual errors).
    if (quote.timestampCreated.getTime() < expirationCutoff.getTime()) { // <--- SIMPLIFIED CHECK
        // For Case B, this line should never be hit, but it's essential for Case A.
        await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });
        throw new Error('The push quote has expired. Please run !push [ID] [N] again.');
    }
    
    if (quote.isLocked) {
        throw new Error('This quote is currently being processed by another transaction.');
    }

    // --- 3. LOCK QUOTE & CHALLENGE VALIDATION ---
    await tx.tempQuote.update({ where: { quoteId: quote.quoteId }, data: { isLocked: true } });

    const challenge = await tx.challenge.findUnique({ where: { challengeId: quote.challengeId } });
    if (!challenge || challenge.status !== 'Active') {
      await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } }); 
      throw new Error(`Challenge ID ${quote.challengeId} is no longer 'Active' and cannot be pushed.`);
    }

    // --- 3.5. CRITICAL: BALANCE CHECK ---
    const user = await tx.user.findUnique({
        where: { id: userId },
        select: { lastKnownBalance: true } 
    });
    
    if (!user) {
        throw new Error(`User ID ${userId} not found during push confirmation.`);
    }
    
    const pushTransactionCost = quote.quotedCost; // Renamed for clarity

    if (user.lastKnownBalance < pushTransactionCost) {
        // IMPORTANT: Unlock/Delete the quote before throwing the error.
        await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });
        throw new Error(`Insufficient balance. Push costs ${pushTransactionCost} NUMBERS.`);
    }

    // --- 4. ATOMIC DATABASE UPDATES ---
    
    // A. Update Challenge: Increment total push count and total cost spent on the challenge.
    const updatedChallenge = await tx.challenge.update({
      where: { challengeId: challenge.challengeId },
      data: {
        totalPush: { increment: quote.quantity },
        totalNumbersSpent: { increment: pushTransactionCost },
      },
    });

    // B. Record Push: Create a historical record of this specific push transaction.
    await tx.push.create({
        data: {
            challengeId: challenge.challengeId,
            userId: userId,
            cost: pushTransactionCost, 
            quantity: quote.quantity,
        }
    });

    // C. Update User: Update the individual user's spending.
    await tx.user.update({
        where: { id: userId },
        data: {
            lastKnownBalance: { decrement: pushTransactionCost },
            totalNumbersSpent: { increment: pushTransactionCost },
            lastActivityTimestamp: transactionTimestamp, // ⭐ Use constant
            totalPushesExecuted: { increment: quote.quantity },
            ...(currentStreamSessionId && {
                lastLiveActivityTimestamp: transactionTimestamp, // ⭐ Use constant
            }),
        },
    });

    // D. Update Global Ledger (User ID 1): Increment the community's game-wide spending.
    await tx.user.updateMany({
        where: { id: 1 }, 
        data: {
            totalNumbersSpentGameWide: { increment: pushTransactionCost },
        }
    });

    // E. Update Stream Session Metrics (Only if a stream is active)
    if (currentStreamSessionId) {
        await tx.stream.update({
            where: { streamSessionId: currentStreamSessionId },
            data: {
                totalNumbersSpentInSession: { increment: pushTransactionCost },
                totalPushesInSession: { increment: quote.quantity },
                totalNumbersSpentOnPush: { increment: pushTransactionCost }
            }
        });
    }

    // --- 5. CLEANUP ---
    await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });

    return { updatedChallenge, transactionCost: pushTransactionCost, quantity: quote.quantity };
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
    const currentStreamSessionId = getCurrentStreamSessionId();
    // ⭐ FIX: Define transactionTimestamp once
    const transactionTimestamp = new Date().toISOString();

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
        const digoutTransactionCost = Math.ceil(challenge.totalNumbersSpent * DIGOUT_COST_PERCENTAGE); // Renamed for clarity

        if (user.lastKnownBalance < digoutTransactionCost) { 
            throw new Error(`Insufficient balance. Digout costs ${digoutTransactionCost} NUMBERS.`);
        }

        // 3. Execute Transaction: Deduct cost, update user, and update challenge
        
        // Deduct cost from user balance and update individual spending
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                lastKnownBalance: { decrement: digoutTransactionCost },
                totalNumbersSpent: { increment: digoutTransactionCost },
                totalDigoutsExecuted: { increment: 1 },
                lastActivityTimestamp: transactionTimestamp, // ⭐ Use constant
                ...(currentStreamSessionId && {
                    lastLiveActivityTimestamp: transactionTimestamp, // ⭐ Use constant
                }),
            },
        });

        // Update Global Ledger (User ID 1): Increment the community's game-wide spending.
        await tx.user.updateMany({
            where: { id: 1 }, 
            data: {
                totalNumbersSpentGameWide: { increment: digoutTransactionCost },
            }
        });

        // New Stream Session Metrics Update
        if (currentStreamSessionId) {
            await tx.stream.update({
                where: { streamSessionId: currentStreamSessionId },
                data: {
                    totalNumbersSpentInSession: { increment: digoutTransactionCost },
                    totalDigoutsInSession: { increment: 1 },
                    totalNumbersSpentOnDigout: { increment: digoutTransactionCost }
                }
            });
        }

        // Revive Challenge and reset clock
        const updatedChallenge = await tx.challenge.update({
            where: { challengeId: challengeId },
            data: {
                status: 'Active',
                streamDaysSinceActivation: 0,
                timestampLastActivation: transactionTimestamp, // ⭐ Use constant
                hasBeenDiggedOut: true,
            },
        });

        // 4. Return results
        return { 
            updatedChallenge, 
            updatedUser, 
            cost: digoutTransactionCost
        };
    });
}

////////////////////////////////////////////////////////////////////////////////////////
// PROCESS CHALLENGE SUBMISSION
////////////////////////////////////////////////////////////////////////////////////////
export async function processChallengeSubmission(
  userId: number,
  challengeText: string,
  totalSessions: number, 
  durationType: 'ONE_OFF' | 'RECURRING'
): Promise<{ newChallenge: Challenge, cost: number }> {
    const currentStreamSessionId = getCurrentStreamSessionId(); 
    const transactionTimestamp = new Date().toISOString(); 

    // ⭐ VALIDATION: Ensure required values are provided and valid
    if (!durationType || !['ONE_OFF', 'RECURRING'].includes(durationType)) {
        throw new Error("Invalid or missing durationType.");
    }
    if (totalSessions < 1) {
        throw new Error("totalSessions must be 1 or greater.");
    }
    
    // Note: The webform should handle the ONE_OFF session limit (e.g., max 21) before sending.

    return prisma.$transaction(async (tx) => {
        // 1. Fetch User data including counter and reset time
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { dailyChallengeResetAt: true, dailySubmissionCount: true, lastKnownBalance: true } // <-- ADD dailySubmissionCount
        });

        if (!user) { throw new Error("User not found during submission process."); }
        
        // --- CONDITIONAL RESET LOGIC ---
        // currentResetTime will now be a string (or Date object if the DB field is native type,
        // but for safety, we treat it as the value we need to compare)
        let currentResetTime = user.dailyChallengeResetAt;
        let N = user.dailySubmissionCount; // <-- Use the atomic counter
        const now = new Date();

        if (now > currentResetTime) {
            // The daily window has expired. Reset the counter and time.
            const nextReset = getNextDailyResetTime();

            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    dailyChallengeResetAt: nextReset,
                    dailySubmissionCount: 0, // <-- RESET COUNTER HERE
                },
                select: { dailyChallengeResetAt: true, dailySubmissionCount: true }
            });
            currentResetTime = updatedUser.dailyChallengeResetAt;
            N = updatedUser.dailySubmissionCount; // N is now 0
        }

        // 2. Calculate Cost: N is the count *before* this submission.
        const submissionCost = calculateSubmissionCost(N); 

        // 3. CRITICAL: BALANCE CHECK (using the user object fetched above)
        if (user.lastKnownBalance < submissionCost) {
            throw new Error(`Insufficient balance. Challenge submission costs ${submissionCost} NUMBERS.`);
        }
        
        // 4. (MOCK) Deduction...

        // 5. Create the new Challenge record
        const newChallenge = await tx.challenge.create({
            data: {
                challengeText: challengeText,
                proposerUserId: userId,
                pushBaseCost: 21,
                status: 'Active', // Always starts Active
                streamDaysSinceActivation: 0,
                category: "General", 
                durationType: durationType, 
                totalSessions: totalSessions, // Use required field
                currentSessionCount: 0, // Starts at 0
                timestampSubmitted: transactionTimestamp, 
                timestampLastActivation: transactionTimestamp,
            }
        });

        // 6. Update User Stats: Deduct balance, update spending, and submission count
        await tx.user.update({
            where: { id: userId },
            data: {
                lastKnownBalance: { decrement: submissionCost }, 
                totalNumbersSpent: { increment: submissionCost }, 
                totalChallengesSubmitted: { increment: 1 },
                lastActivityTimestamp: new Date().toISOString(),
                dailySubmissionCount: { increment: 1 },
                ...(currentStreamSessionId && {
                    lastLiveActivityTimestamp: transactionTimestamp,
                }),
            },
        });

        // 7., 8. Update Global Ledger and Stream Session Metrics (Unchanged)
        await tx.user.updateMany({ where: { id: 1 }, data: { totalNumbersSpentGameWide: { increment: submissionCost } } });
        if (currentStreamSessionId) {
            await tx.stream.update({
                where: { streamSessionId: currentStreamSessionId },
                data: { totalNumbersSpentInSession: { increment: submissionCost }, totalChallengesSubmittedInSession: { increment: 1 } }
            });
        }

        return { newChallenge, cost: submissionCost }; 
    });
}

////////////////////////////////////////////////////////////////////////////////////////
// HANDLES ARCHIVAL LOGIC (No changes needed)
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
// FINALIZE EXECUTING "InProgress" CHALLENGE
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Finds the currently executing challenge (is_executing: true) and...
 * when the stream goes offline.
 * @returns The completed Challenge record, or null if none was executing.
 */
export async function finalizeInProgressChallenge(): Promise<Challenge | null> {
    
    // ... (find executingChallenge)
    const executingChallenge = await prisma.challenge.findFirst({
        where: { status: 'InProgress', isExecuting: true },
    });

    if (!executingChallenge) {
        console.log("[ChallengeService] No challenge found in 'InProgress' status to finalize.");
        return null;
    }
    
    const transactionTimestamp = new Date().toISOString();

    // ⭐ LOGIC: Session OUT - Increment count, THEN check for completion
    const nextSessionCount = executingChallenge.currentSessionCount + 1;
    const isCompleted = nextSessionCount >= executingChallenge.totalSessions;
    
    const updateData: any = { 
        isExecuting: false,
        currentSessionCount: nextSessionCount
    };

    if (isCompleted) {
        updateData.status = 'Completed';
        updateData.timestampCompleted = transactionTimestamp;
    } 
    // Else: Status remains 'InProgress'.

    let completedChallenge = await prisma.challenge.update({
        where: { challengeId: executingChallenge.challengeId },
        data: updateData
    });
    
    const statusText = isCompleted ? 'Completed' : `finished session ${nextSessionCount} of ${completedChallenge.totalSessions}. Status remains InProgress.`;
    console.log(`[ChallengeService] Challenge #${completedChallenge.challengeId} finalized as ${statusText}.`);

    return completedChallenge;
}


////////////////////////////////////////////////////////////////////////////////////////
// PROCESS EXECUTE CHALLENGE
////////////////////////////////////////////////////////////////////////////////////////
export async function processExecuteChallenge(challengeId: number): Promise<Challenge> {
    
    return prisma.$transaction(async (tx) => {
        const transactionTimestamp = new Date().toISOString();

        // 1. Finalize the previously executing challenge (if any)
        const previousChallenge = await tx.challenge.findFirst({ where: { isExecuting: true } });

        if (previousChallenge) {
            // ⭐ LOGIC: Session OUT - Increment count, THEN check for completion
            const nextSessionCount = previousChallenge.currentSessionCount + 1;
            const isCompleted = nextSessionCount >= previousChallenge.totalSessions;
            
            const updateData: any = { 
                isExecuting: false,
                currentSessionCount: nextSessionCount
            };

            if (isCompleted) {
                // Rule: Set status to 'Completed' if final session finishes
                updateData.status = 'Completed';
                updateData.timestampCompleted = transactionTimestamp;
            } 
            // Else: Status remains 'InProgress'.
            
            // NOTE ON ONE_OFF CONTIGUITY: Validation that the new session is on the same day for a ONE_OFF challenge 
            // should be done by the calling route/service, but the clockService.ts function ensures the state update is correct.

            await tx.challenge.update({
                where: { challengeId: previousChallenge.challengeId },
                data: updateData
            });

            const statusText = isCompleted ? 'Completed' : `finished session ${nextSessionCount} of ${previousChallenge.totalSessions}. Status remains InProgress.`;
            console.log(`[ChallengeService] Previous challenge #${previousChallenge.challengeId} ${statusText} before launch.`);
        }

        // 2. Validate the challenge to be executed
        const challenge = await tx.challenge.findUnique({
            where: { challengeId: challengeId },
        });

        if (!challenge) { throw new Error(`Challenge ID ${challengeId} not found.`); }
        
        // Only Active (first session) or InProgress (resuming) challenges can be Executed.
        if (challenge.status !== 'Active' && challenge.status !== 'InProgress') {
            throw new Error(`Challenge #${challengeId} cannot be executed. Status must be 'Active' or 'InProgress'`);
        }

        // 3. Execute the new challenge
        // Set status to 'InProgress' ONLY if it's coming from 'Active' (first session)
        const newStatus = challenge.status === 'Active' ? 'InProgress' : challenge.status;

        const executingChallenge = await tx.challenge.update({
            where: { challengeId: challengeId },
            data: {
                status: newStatus, 
                isExecuting: true,
                sessionStartTimestamp: transactionTimestamp,
            }
        });

        return executingChallenge;
    });
}


////////////////////////////////////////////////////////////////////////////////////////
// FETCH ACTIVE CHALLENGES (No changes needed)
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Fetches all challenges that are currently 'Active'.
 */
export async function getActiveChallenges() {
    return prisma.challenge.findMany({
        where: { status: 'Active' },
        orderBy: { totalNumbersSpent: 'desc' },
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
export async function processRemove(
    authorUserId: number, 
    challengeId: number,
    option: RefundOption = 'community_forfeit' // Default to Community Forfeit
): Promise<{ 
    updatedChallenge: Challenge, 
    refundsProcessed: number, 
    totalRefundsAmount: number, 
    failedRefunds: number, 
    fundsSink: string, 
    toAuthor: number, 
    toCommunityChest: number, 
    toExternalPushers: number }> {
    
    const refundsToProcess: { userId: number, refundAmount: number }[] = [];
    let totalRefundsAmount = 0; // The 21% amount
    
    // Fetch the current Stream Session ID ONCE before the transaction begins
    const currentStreamSessionId = getCurrentStreamSessionId(); 
    const transactionTimestamp = new Date().toISOString();

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
        
        // 2. Calculate Refunds (Separate Author's portion from Pushers' portions)
        let authorRefundAmount = 0;
        let pushersRefundAmount = 0;
        const pushersRefundsToProcess: { userId: number, refundAmount: number }[] = [];

        const pusherContributions = await tx.push.groupBy({
            by: ['userId'],
            where: { challengeId: challengeId },
            _sum: { cost: true },
        });

        for (const contribution of pusherContributions) {
            const spent = contribution._sum?.cost || 0; 
            const refund = Math.floor(spent * 0.21); 
            
            if (refund > 0) {
                if (contribution.userId === authorUserId) {
                    authorRefundAmount = refund;
                } else {
                    pushersRefundAmount += refund;
                    pushersRefundsToProcess.push({ userId: contribution.userId, refundAmount: refund });
                }
            }
        }
        
        const totalRefundsAmount = authorRefundAmount + pushersRefundAmount;

        // --- 3. DETERMINE DISTRIBUTION & UPDATE LEDGERS ---
        
        let toCommunityChest = 0;
        let toExternalPushers = 0;
        let toAuthor = 0;
        let fundsSinkText = '';

        if (option === 'community_forfeit') { // Option A
            toCommunityChest = totalRefundsAmount;
            fundsSinkText = 'Community Chest';
        } else if (option === 'pusher_refund') { // Option B
            toExternalPushers = totalRefundsAmount;
            fundsSinkText = 'Pushers';
        } else if (option === 'author_and_chest') { // Option C
            toAuthor = authorRefundAmount;
            toCommunityChest = pushersRefundAmount;
            fundsSinkText = 'Author + Community Chest';
        } else if (option === 'author_and_pushers') { // Option D
            toAuthor = authorRefundAmount;
            toExternalPushers = pushersRefundAmount;
            fundsSinkText = 'Author + Pushers';
        }

        // A. Global Ledger (ID 1): Track Gross Refund (UNCHANGED)
        await tx.user.updateMany({
            where: { id: 1 }, 
            data: {
                totalNumbersReturnedFromRemovalsGameWide: { increment: totalRefundsAmount }
            }
        });

        // B. Update Stream Session Metrics (UNCHANGED)
        if (currentStreamSessionId) {
            await tx.stream.update({
                where: { streamSessionId: currentStreamSessionId },
                data: {
                    totalRemovalsInSession: { increment: 1 },
                    totalNumbersReturnedFromRemovalsInSession: { increment: totalRefundsAmount }
                }
            });
        }
        
        // C. Update Author's Balance (If reclaiming share)
        if (toAuthor > 0) {
            await tx.user.update({
                where: { id: authorUserId },
                data: {
                    lastKnownBalance: { increment: toAuthor }, // Reclaim author's own share locally
                }
            });
        }
        
        // D. Update Community Chest (ID 1) Balance (If money is forfeited)
        if (toCommunityChest > 0) {
            await tx.user.update({
                where: { id: 1 },
                data: {
                    lastKnownBalance: { increment: toCommunityChest },
                }
            });
        }

        // E. Update Author's Per-User Stats (Tracking metrics)
        await tx.user.update({
            where: { id: authorUserId },
            data: {
                totalRemovalsExecuted: { increment: 1 },
                lastActivityTimestamp: transactionTimestamp,
                totalCausedByRemovals: { increment: totalRefundsAmount }, 
                totalToCommunityChest: { increment: toCommunityChest }, 
                totalToPushers: { increment: toExternalPushers },
            }
        });

        // 5. Update Challenge Status (CRITICAL STATE CHANGE)
        const updatedChallenge = await tx.challenge.update({
            where: { challengeId: challengeId },
            data: {                            
                status: 'Removed', 
                isExecuting: false
            },
        });

        return { 
            updatedChallenge, 
            pushersRefundsToProcess, 
            totalRefundsAmount, 
            option,
            fundsSinkText,
            toAuthor,
            toExternalPushers,
            toCommunityChest
        };
    });

    // --- STEP 2: EXTERNAL REFUND CALLS (Lumia API INTEGRATION POINT) ---
    const successfulRefunds: { userId: number, amount: number }[] = [];
    
    // Only process external calls if the option involved Pushers (B or D)
    const requiresExternalRefund = result.option === 'pusher_refund' || result.option === 'author_and_pushers';
    
    if (requiresExternalRefund) {
        // ... (External Refund Logic UNCHANGED, uses result.pushersRefundsToProcess)
        // ...
    }

    // --- STEP 4: FINAL RESPONSE ---
    return {
        updatedChallenge: result.updatedChallenge,
        refundsProcessed: successfulRefunds.length,
        totalRefundsAmount: result.totalRefundsAmount,
        failedRefunds: result.pushersRefundsToProcess.length - successfulRefunds.length, 
        fundsSink: result.fundsSinkText,
        toAuthor: result.toAuthor,
        toCommunityChest: result.toCommunityChest,
        toExternalPushers: result.toExternalPushers,
    };
}


////////////////////////////////////////////////////////////////////////////////////////
// PROCESS DISRUPT (Placeholder for Future Chaos) (No changes needed)
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Executes a placeholder 'Disrupt' command, applying a fixed cost while tracking metrics.
 * Actual disrupt logic will be implemented post-launch.
 */
export async function processDisrupt(userId: number): Promise<string> {
    const currentStreamSessionId = getCurrentStreamSessionId();
    // ⭐ FIX: Define transactionTimestamp once
    const transactionTimestamp = new Date().toISOString();
    
    return prisma.$transaction(async (tx) => {
        // 1. Fetch User and check balance
        const user = await tx.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error(`User ID ${userId} not found during transaction.`);
        }

        if (user.lastKnownBalance < DISRUPT_COST) {
            throw new Error(`Insufficient balance. Disrupt costs ${DISRUPT_COST} NUMBERS.`);
        }

        // 2. Execute Transaction: Deduct cost and update metrics
        
        // A. Update User Stats
        await tx.user.update({
            where: { id: userId },
            data: {
                lastKnownBalance: { decrement: DISRUPT_COST },
                totalNumbersSpent: { increment: DISRUPT_COST },
                totalDisruptsExecuted: { increment: 1 },
                lastActivityTimestamp: transactionTimestamp, // ⭐ Use constant
                ...(currentStreamSessionId && {
                    lastLiveActivityTimestamp: transactionTimestamp, // ⭐ Use constant
                }),
            },
        });

        // B. Update Global Ledger (User ID 1)
        await tx.user.updateMany({
            where: { id: 1 }, 
            data: {
                totalNumbersSpentGameWide: { increment: DISRUPT_COST }, // Global spending ledger
            }
        });

        // C. Update Stream Session Metrics (Conditional)
        if (currentStreamSessionId) {
            await tx.stream.update({
                where: { streamSessionId: currentStreamSessionId },
                data: {
                    totalNumbersSpentInSession: { increment: DISRUPT_COST },
                    totalDisruptsInSession: { increment: 1 }, // Track disrupt count
                    totalNumbersSpentOnDisrupt: { increment: DISRUPT_COST } // Track spending breakdown
                }
            });
        }

        // 3. Return placeholder success message (handled outside the transaction block for clarity)
        return "Disrupt successful.";
    }).then(() => {
        // Return the required launch message upon successful transaction commit
        return (
            "Congratulations, you just paid 2100 NUMBERS to commit pre-release performance art. " +
            "You've disrupted exactly nothing, but your commitment to chaos is noted. " +
            "We promise to make it hurt later. (Maybe.)"
        );
    });
}