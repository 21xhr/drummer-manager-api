// src/services/challengeService.ts

import prisma from '../prisma';
import { Account, Challenge, ChallengeStatus, CadenceUnit, DurationType, PlatformName, User } from '@prisma/client';
import { isStreamLive, getCurrentStreamSessionId} from './streamService';
import { generateToken, validateDuration } from './jwtService';
import { addNumbersViaLumia, deductNumbersViaLumia } from './lumiaService';
import { publishChallengeEvent, ChallengeEvents } from './eventService';
import logger from '../logger';

// --- GLOBAL CONFIGURATION (SCREAMING_SNAKE_CASE) ---
const DIGOUT_COST_PERCENTAGE = 0.21; // 21%
const LIVE_DISCOUNT_MULTIPLIER = 0.79; // 1 - 0.21
const SUBMISSION_BASE_COST = 210;
const PUSH_BASE_COST = 21;
const DISRUPT_COST = 2100; 
const SESSION_DURATION_MS = 21 * 60 * 1000; // 21 minutes in milliseconds
export type RefundOption = 'community_forfeit' | 'author_and_chest' | 'author_and_pushers';


// Define the return type interface (or type alias)
interface SessionTickResult {
    challenge: Challenge;
    eventType: 'SESSION_TICKED' | 'SESSION_COMPLETED';
}


// Define the return type for the execute function
interface ExecuteResult {
    executingChallenge: Challenge; // The challenge we just launched/re-launched
    wasPreviousChallengeStopped: boolean; // True if a previous challenge was finalized
}


// --- Global Variable for Dynamic Import ---
let uuidv4: Function | null = null;


// Function to get the v4 function dynamically
async function getV4() {
    if (!uuidv4) {
        // CRITICAL: This dynamic import resolves the ERR_REQUIRE_ESM
        const uuidModule = await import('uuid');
        uuidv4 = uuidModule.v4;
    }
    return uuidv4;
}

/**
 * Parses the required session count (X) from the cadence text.
 * Expects format: "X session(s) every..."
 */
function parseCadenceRequiredCount(sessionCadenceText: string | undefined): number {
    if (!sessionCadenceText) return 1; 
    const match = sessionCadenceText.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 1; 
}


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
 * Generates a secure, expiring challenge submission link using a JWT,
 * and calculates the current quadratic cost for user transparency.
 * * @param userId The numeric DB ID of the user.
 * @param platformId The platform-specific ID (e.g., Twitch name).
 * @param platformName The platform name (e.g., 'TWITCH').
 * @param duration The requested link expiry duration (e.g., '5m').
 * @param reqHostname The request hostname for URL construction.
 * @returns An object containing the chat response message and the generated URL/token details.
 */
export async function processSubmissionLinkGeneration(
    userId: number, 
    platformId: string, 
    platformName: string, 
    duration: string | undefined, 
    reqHostname: string,
): Promise<{ chatResponse: string, details: any }> {
    
    // 1. Fetch the user's current daily submission context to get N and cost
    const { dailySubmissionCount, baseCostPerSession } = await getCurrentDailySubmissionContext(userId);

    // 2. Generate the JWT token
    const tokenDuration = validateDuration(duration); // Use validateDuration from jwtService
    // NOTE: The TokenPayload interface in jwtService requires userId, platformId, platformName
    const token = generateToken({ userId, platformId, platformName }, tokenDuration);
    
    // 3. Dynamic URL Construction
    const isLocalHost = reqHostname === 'localhost' || reqHostname === '127.0.0.1' || reqHostname === '0.0.0.0';
    
    const WEBFORM_BASE_URL = 
        isLocalHost
        ? `http://192.168.1.37:5500` // Your local dev address
        : process.env.WEBFORM_BASE_URL || "https://drummer-manager-website.vercel.app";

    const secureUrl = `${WEBFORM_BASE_URL}/challengesubmitform/index.html?token=${token}`;
    
    // 4. Construct the response
    const formattedCost = baseCostPerSession.toLocaleString();
    
    const chatResponse = 
        `Please use the following secure link to submit your challenge (valid for ${tokenDuration}).\n` + 
        `Your daily submission count is **${dailySubmissionCount}** (Base Cost: **${formattedCost}** NUMBERS).\n` + // Added line break here too for better flow
        `Link: ${secureUrl}`;

    return {
        chatResponse,
        details: {
            token: token,
            secureUrl: secureUrl,
            duration: tokenDuration,
            dailySubmissionCount: dailySubmissionCount,
            baseCostPerSession: baseCostPerSession 
        }
    };
}


/**
 * Checks the currently executing challenge for session completion via timestamp.
 * If the 21-minute duration has elapsed, it increments the session count and updates the status.
 * @returns The updated challenge or null if no action was taken.
 */
export async function processAutomaticSessionTick(): Promise<SessionTickResult | null> {
    const now = new Date(); 
    const currentTimeMs = now.getTime();
    
    // TEMPORARY DEBUG LOG
    logger.info('Auto Tick: Checking for executing challenge...'); 

    // 1. Find the currently executing challenge
    const executingChallenge = await prisma.challenge.findFirst({
        where: { isExecuting: true },
        // Ensure ALL required fields for the logic below are selected
        select: {
            challengeId: true,
            totalSessions: true,
            currentSessionCount: true,
            timestampLastSessionTick: true,
            isExecuting: true,
        }
    });

    if (!executingChallenge) {
        return null; 
    }

    // Check for null on timestampLastSessionTick and return early if null
    // This handles the case where a challenge might be set to isExecuting=true but the clock wasn't initialized
    if (!executingChallenge.timestampLastSessionTick) {
        // This is safe because we checked if (!executingChallenge) above
        logger.warn(`Auto Tick: Skipping Challenge #${executingChallenge.challengeId}. Clock not initialized/is NULL.`);
        return null;
    }

    // TypeScript narrowing fix
    // As we've checked for null on timestampLastSessionTick and returned early if null
    // TypeScript from now knows executingChallenge and timestampLastSessionTick are non-null.
    const sessionLastTickMs = executingChallenge.timestampLastSessionTick.getTime();
    
    // Calculate elapsed time
    const timeElapsedMs = currentTimeMs - sessionLastTickMs;

    // The core check: Has the 21-minute duration elapsed?
    if (timeElapsedMs < SESSION_DURATION_MS) {
        // Session duration has not yet elapsed
        return null; 
    }
    
    // 2. The session has expired (21 minutes passed) - Process the tick!
    logger.info(`Auto Tick: Session expired for Challenge #${executingChallenge.challengeId}. Processing session increment.`);

    return prisma.$transaction(async (tx) => {
        const nextSessionCount = executingChallenge.currentSessionCount + 1;
        const isCompleted = nextSessionCount >= executingChallenge.totalSessions;
        
        const txNow = new Date(); 

        const updateData: any = {
            currentSessionCount: nextSessionCount,
            isExecuting: false, //CRITICAL The challenge STOPS execution after ONE automatic tick.
            timestampLastSessionTick: null, // CRITICAL: Clear the tick timestamp to prevent re-ticking (re-incrementing) on next check.
        };

        if (isCompleted) {
            updateData.status = ChallengeStatus.COMPLETED;
            updateData.timestampCompleted = txNow.toISOString();
            logger.info(`Auto Tick: Challenge #${executingChallenge.challengeId} is COMPLETED.`);
        } 
        // If NOT completed, the status remains IN_PROGRESS, but isExecuting is false.

        // Near-completion check
        const SESSIONS_REMAINING_ALERT = 3;
        const sessionsRemaining = executingChallenge.totalSessions - nextSessionCount;

        if (sessionsRemaining > 0 && sessionsRemaining <= SESSIONS_REMAINING_ALERT) {
            console.log(`[ChallengeService] ALERT: Challenge #${executingChallenge.challengeId} is entering its final ${sessionsRemaining} sessions! (Auto Tick)`);
        }
        
        // 3. Update the database
        const updatedChallenge = await tx.challenge.update({
            where: { challengeId: executingChallenge.challengeId },
            data: updateData
        });

        // Return data needed for external event triggering
        return {
            challenge: updatedChallenge,
            eventType: isCompleted ? 'SESSION_COMPLETED' : 'SESSION_TICKED', 
        };
    });
}


// ------------------------------------------------------------------
// CORE SUBMISSION CONTEXT
// ------------------------------------------------------------------

/**
 * Retrieves the user's current daily submission context, performing a reset
 * of the daily counter if the current time is past the dailyChallengeResetAt time.
 * @param userId - The ID of the user.
 * @returns An object containing the current state needed for submission cost calculation.
 */
export async function getCurrentDailySubmissionContext(userId: number | string): Promise<{
    dailySubmissionCount: number;
    baseCostPerSession: number;
}> {
    const idToLookup = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    // We use a transaction to ensure atomicity in case a reset is needed.
    return prisma.$transaction(async (tx) => {
        // 1. Fetch User data
        const user = await tx.user.findUnique({
            where: { id: idToLookup }, // Use the resolved numeric ID
            select: { dailyChallengeResetAt: true, dailySubmissionCount: true }
        });

        // 🛑 We throw here if the user is not found, but tokenRoutes.ts now calls
        // findOrCreateUser *before* calling this function, guaranteeing the user exists.
        if (!user) { throw new Error("User not found."); } // This is now a safety net.

        let currentResetTime = user.dailyChallengeResetAt;
        let N = user.dailySubmissionCount; // N is the count *before* this submission
        const now = new Date();

        // --- CONDITIONAL RESET LOGIC ---
        if (now > currentResetTime) {
            // The daily window has expired. Reset the counter and time.
            const nextReset = getNextDailyResetTime();

            const updatedUser = await tx.user.update({
                where: { id: idToLookup },
                data: {
                    dailyChallengeResetAt: nextReset,
                    dailySubmissionCount: 0, // <-- RESET COUNTER HERE
                },
                select: { dailySubmissionCount: true } // Only need the new count
            });
            N = updatedUser.dailySubmissionCount; // N is now 0
        }

        // 2. Calculate the base cost using the (potentially reset) daily count
        const cost = calculateSubmissionCost(N);

        return {
            dailySubmissionCount: N,
            baseCostPerSession: cost
        };
    });
}


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
  platformId: string, 
  platformName: PlatformName,
  challengeId: number,
  quantity: number
): Promise<{ quoteId: string; quotedCost: number; challenge: Challenge }> {
  
  // 1. Fetch Challenge Details for validation and base cost
  const challenge = await prisma.challenge.findUnique({
    where: { challengeId: challengeId },
  });

  if (!challenge || challenge.status !== ChallengeStatus.ACTIVE) {
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
  // Fetch the specific Account instead of the User
  const account = await prisma.account.findUnique({
      where: { 
          platformId_platformName: { 
              platformId: platformId,
              platformName: platformName 
          }
      },
      select: { currentBalance: true } 
  });
  
  if (!account) {
      throw new Error(`Account not found for user ${userId} on platform ${platformName}.`);
  }

  // Check Account balance
  // Optimistic check: if the user's current known balance is less than the quote, fail fast.
  if (account.currentBalance < quotedCost) {
      throw new Error(`Insufficient balance on ${platformName} account. Quoted push cost is ${quotedCost} NUMBERS.`);
  }

  // --- 5. Save the generated quote to the temporary quote table.
  // 1. Generate the unique ID and declare the variable

  // 🛑 IMPORTANT: Use await to get the dynamically loaded function
    const v4 = await getV4(); 
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
  platformId: string,
  platformName: PlatformName,
  quoteId?: string 
): Promise<{ updatedChallenge: Challenge; transactionCost: number; quantity: number, updatedAccount: Account }> {
    const currentStreamSessionId = getCurrentStreamSessionId(); 
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
    if (!challenge || challenge.status !== ChallengeStatus.ACTIVE) {
      await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } }); 
      throw new Error(`Challenge ID ${quote.challengeId} is no longer 'Active' and cannot be pushed.`);
    }

    // --- 3.5. CRITICAL: BALANCE CHECK & LUMIA DEDUCTION ---
    // Fetch the specific Account instead of the User
    const accountContext = await tx.account.findUnique({
        where: {
             platformId_platformName: {
                platformId: platformId, 
                platformName: platformName
            }
        },
        select: { currentBalance: true } 
    });
    
    if (!accountContext) {
        throw new Error(`Account not found for user ${userId} on platform ${platformName}.`);
    }
    
    // Remove the now-redundant check for `user.platformId`

    const pushTransactionCost = quote.quotedCost;

    // Optimistic Local Balance Check (Check Account balance)
    if (accountContext.currentBalance < pushTransactionCost) {
        await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } });
        throw new Error(`Insufficient balance on ${platformName} account. Push costs ${pushTransactionCost} NUMBERS.`);
    }

    // ⭐ CRITICAL: Execute Authoritative Deduction via Lumia API
    let newAuthoritativeBalance: number;
        
    try {
        // Use the platformId passed in the function signature
        const lumiaResult = await deductNumbersViaLumia(platformId, pushTransactionCost); 
        newAuthoritativeBalance = lumiaResult.newBalance; 

    } catch (error) {
        // If Lumia fails, delete the quote and re-throw the error to rollback the entire Prisma transaction
        logger.error(`Lumia Push Deduction Failed for User ${userId} (Cost: ${pushTransactionCost}): ${error instanceof Error ? error.message : 'Unknown error'}`, { userId, platformId: platformId });
        await tx.tempQuote.delete({ where: { quoteId: quote.quoteId } }); 
        const errorMessage = error instanceof Error ? error.message : 'Unknown payment failure.';
        throw new Error(`Payment failed. ${errorMessage.includes('Insufficient funds') ? 'Insufficient funds.' : 'Lumia connection error.'}`);
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

    // C. Update User: Update the individual user's spending metrics (No balance update here)
    await tx.user.update({
        where: { id: userId },
        data: {
            totalNumbersSpent: { increment: pushTransactionCost },
            totalPushesExecuted: { increment: quote.quantity },
            lastActivityTimestamp: transactionTimestamp,
            ...(currentStreamSessionId && {
                lastLiveActivityTimestamp: transactionTimestamp,
            }),
        },
    });
    // ⭐ Update Account Balance: Update the specific Account with the authoritative balance
    const updatedAccount = await tx.account.update({
        where: {
            platformId_platformName: {
                platformId: platformId, 
                platformName: platformName
            }
        },
        data: {
            currentBalance: newAuthoritativeBalance,
        }
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

    return { updatedChallenge, transactionCost: pushTransactionCost, quantity: quote.quantity, updatedAccount: updatedAccount as Account };
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
export async function processDigout(
    userId: number,
    platformId: string, // ⭐ NEW PARAMETER
    platformName: PlatformName, // ⭐ NEW PARAMETER
    challengeId: number
): Promise<{ updatedChallenge: Challenge; updatedUser: User; updatedAccount: Account; cost: number }> {

    const currentStreamSessionId = getCurrentStreamSessionId();
    const transactionTimestamp = new Date().toISOString();

    const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch Challenge and User for validation
        const challenge = await tx.challenge.findUnique({
            where: { challengeId: challengeId },
        });

        // ⭐ FIX 1: Fetch the specific Account instead of the User
        const accountContext = await tx.account.findUnique({
            where: {
                 platformId_platformName: {
                    platformId: platformId, 
                    platformName: platformName
                }
            },
            select: { currentBalance: true } 
        });

        if (!challenge) { throw new Error(`Challenge ID ${challengeId} not found.`); }
        
        if (!accountContext) { throw new Error(`Account not found for user ${userId} on platform ${platformName}.`); }

        // ⭐ FIX 2: Remove the check for `user.platformId`

        if (challenge.status !== ChallengeStatus.ARCHIVED) {
            // Clarified message: Digout is only for time-expired challenges.
            const eligibleStatus = ChallengeStatus.ARCHIVED; 
            throw new Error(`Challenge #${challengeId} cannot be dug out. Only status '${eligibleStatus}' is eligible. Current status is '${challenge.status}'.`);
        }

        if (challenge.hasBeenDiggedOut) {
            throw new Error(`Challenge #${challengeId} has already been dug out once and cannot be revived again.`);
        }

        // if (!user.platformId) {
        //     throw new Error("User is missing required platform identity for payment.");
        // }

        // 2. Calculate Cost (21% of total_numbers_spent, rounded up)
        const digoutTransactionCost = Math.ceil(challenge.totalNumbersSpent * DIGOUT_COST_PERCENTAGE); 

        // Check Account balance
        if (accountContext.currentBalance < digoutTransactionCost) { 
            throw new Error(`Insufficient balance on ${platformName} account. Digout costs ${digoutTransactionCost} NUMBERS.`);
        }

        // ⭐ CRITICAL: Execute Authoritative Deduction via Lumia API
        let newAuthoritativeBalance: number;
        
        try {
            // Use the platformId passed in the function signature
            const lumiaResult = await deductNumbersViaLumia(platformId, digoutTransactionCost); 
            newAuthoritativeBalance = lumiaResult.newBalance; 
        } catch (error) {
            logger.error(`Lumia Digout Deduction Failed for User ${userId} (Cost: ${digoutTransactionCost}): ${error instanceof Error ? error.message : 'Unknown error'}`, { userId, platformId: platformId });
            const errorMessage = error instanceof Error ? error.message : 'Unknown payment failure.';
            throw new Error(`Payment failed. ${errorMessage.includes('Insufficient funds') ? 'Insufficient funds.' : 'Lumia connection error.'}`);
        }

        // 3. Execute Transaction: Deduct cost, update user, and update challenge
        
        // Update User: Deduct cost from user spending and update individual spending metrics
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                // REMOVE lastKnownBalance update from User
                totalNumbersSpent: { increment: digoutTransactionCost },
                totalDigoutsExecuted: { increment: 1 },
                lastActivityTimestamp: transactionTimestamp,
                ...(currentStreamSessionId && {
                    lastLiveActivityTimestamp: transactionTimestamp,
                }),
            },
        });

        // Update Account Balance: Update the specific Account with the authoritative balance
        const updatedAccount = await tx.account.update({
            where: {
                platformId_platformName: {
                    platformId: platformId, 
                    platformName: platformName
                }
            },
            data: {
                currentBalance: newAuthoritativeBalance,
            }
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
                status: ChallengeStatus.ACTIVE,
                streamDaysSinceActivation: 0,
                timestampLastActivation: transactionTimestamp, 
                hasBeenDiggedOut: true,
            },
        });
        
        // 4. Return results
        return { 
            updatedChallenge, 
            updatedUser: updatedUser as User,
            updatedAccount: updatedAccount as Account,
            cost: digoutTransactionCost
        };
    }); // <-- The transaction block ends here. If successful, 'result' is populated.
    
    // OPTIMIZATION: Publish the event AFTER the transaction commits
    publishChallengeEvent(ChallengeEvents.CHALLENGE_DIGGED_OUT, result.updatedChallenge);

    // 4. Return results (using the result of the transaction)
    return result;
}


////////////////////////////////////////////////////////////////////////////////////////
// PROCESS CHALLENGE SUBMISSION
////////////////////////////////////////////////////////////////////////////////////////
export async function processChallengeSubmission(
    userId: number,
    platformId: string, 
    platformName: PlatformName, 
    challengeText: string,
    totalSessions: number,
    durationType: DurationType,
    sessionCadenceText?: string,
    cadenceUnit?: CadenceUnit
): Promise<{ newChallenge: Challenge, cost: number, updatedUser: User, updatedAccount: Account }> { 
    const currentStreamSessionId = getCurrentStreamSessionId();
    const transactionTimestamp = new Date().toISOString();

    // VALIDATION: Ensure required values are provided and valid
    if (!durationType || !Object.values(DurationType).includes(durationType)) {
        throw new Error("Invalid or missing durationType.");
    }
    if (totalSessions < 1) {
        throw new Error("totalSessions must be 1 or greater.");
    }
    // VALIDATION: sessionCadenceText is mandatory for Recurring challenges
    if (durationType === DurationType.RECURRING && !sessionCadenceText) {
    throw new Error("sessionCadenceText is required for Recurring challenges.");
    }

    // Note: The webform should handle the ONE_OFF session limit (e.g., max 21) before sending.
    return prisma.$transaction(async (tx) => {
        
        // 1. Get Submission Context (handles conditional reset and returns cost for N daily submission)
        const { dailySubmissionCount: N, baseCostPerSession: submissionCost } = 
            await getCurrentDailySubmissionContext(userId); 
        
        // 2. Fetch User and Account Context
        // Fetch the specific Account using all three keys
        const accountContext = await tx.account.findUnique({
            where: {
                 platformId_platformName: {
                    platformId: platformId, 
                    platformName: platformName
                }
            }
        });

        // 3. Validation
        // If the user was just created in authMiddleware, the account is guaranteed to exist.
        if (!accountContext) { throw new Error(`Account not found for user ${userId} on platform ${platformName}.`); }

        // Optimistic Local Balance Check (Check Account.currentBalance)
        if (accountContext.currentBalance < submissionCost) {
            throw new Error(`Insufficient balance on ${platformName} account. Challenge submission costs ${submissionCost} NUMBERS.`);
        }
        
        // 4. CRITICAL: Execute Authoritative Deduction via Lumia API
        let newAuthoritativeBalance: number;
        
        try {
            // Pass the correct platformId and cost to the external API
            const lumiaResult = await deductNumbersViaLumia(platformId, submissionCost); 
            newAuthoritativeBalance = lumiaResult.newBalance; // Store the new authoritative balance

        } catch (error) {
            // If Lumia fails, re-throw the error to rollback the entire Prisma transaction
            logger.error(`Lumia Deduction Failed for User ${userId} (Cost: ${submissionCost}): ${error instanceof Error ? error.message : 'Unknown error'}`, { userId, platformId: accountContext.platformId });
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown payment failure.';
            // Only expose a user-friendly message
            throw new Error(`Payment failed. ${errorMessage.includes('Insufficient funds') ? 'Insufficient funds.' : 'Lumia connection error.'}`);
        }

        // Parse required count for recurring challenges
        let cadenceRequiredCount: number | undefined;
        if (durationType === DurationType.RECURRING) {
            cadenceRequiredCount = parseCadenceRequiredCount(sessionCadenceText);
        }

        // 5. Create the new Challenge record
        const newChallenge = await tx.challenge.create({
            data: {
                challengeText: challengeText, // Required field
                proposerUserId: userId, // Required field
                status: ChallengeStatus.ACTIVE, // Required field (Always starts Active)
                category: "General", // Required field (Defaulted here)
                durationType: durationType, // Required field
                pushBaseCost: PUSH_BASE_COST,
                submissionCost: submissionCost,
                // --- CADENCE FIELDS ---
                ...(sessionCadenceText && { sessionCadenceText: sessionCadenceText }),
                ...(cadenceUnit && { cadenceUnit: cadenceUnit }),
                
                // Always include these for RECURRING challenges
                cadenceRequiredCount: cadenceRequiredCount || null, // SET REQUIRED COUNT
                cadenceProgressCounter: 0,
                cadencePeriodStart: null, // CORRECT: Set on first execution

                totalSessions: totalSessions, // Required field
                timestampSubmitted: transactionTimestamp, // Required field
                timestampLastActivation: transactionTimestamp, // Required field
            }
        });

        // 6. Update User Stats: Update the central User metrics (Submission count, spending)
        const userUpdateResult = await tx.user.update({ // Store the update result
            where: { id: userId },
            data: {
                // Remove lastKnownBalance update from User
                totalNumbersSpent: { increment: submissionCost }, 
                totalChallengesSubmitted: { increment: 1 },
                lastActivityTimestamp: new Date().toISOString(),
                dailySubmissionCount: { increment: 1 },
                ...(currentStreamSessionId && {
                    lastLiveActivityTimestamp: transactionTimestamp,
                }),
            },
            // Update Selection - Ensure we select fields required by the router (now `updatedUser` metrics)
            select: {
                id: true, 
                dailySubmissionCount: true, 
                totalChallengesSubmitted: true,
                totalNumbersSpent: true,
                // Remove lastKnownBalance, platformId, platformName from select list
                // Add any other User fields required by your `User` type here
                totalPushesExecuted: true,
                totalDigoutsExecuted: true,
                totalRemovalsExecuted: true,
                totalReceivedFromRemovals: true,
            }
        });

        // Update Account Balance: Update the specific Account with the authoritative balance
        const updatedAccount = await tx.account.update({
            where: {
                platformId_platformName: {
                    platformId: platformId, 
                    platformName: platformName
                }
            },
            data: {
                currentBalance: newAuthoritativeBalance,
            }
        });

        // 7., 8. Update Global Ledger and Stream Session Metrics (Unchanged)
        await tx.user.updateMany({ where: { id: 1 }, data: { totalNumbersSpentGameWide: { increment: submissionCost } } });
        if (currentStreamSessionId) {
            await tx.stream.update({
                where: { streamSessionId: currentStreamSessionId },
                data: { totalNumbersSpentInSession: { increment: submissionCost }, totalChallengesSubmittedInSession: { increment: 1 } }
            });
        }

        // 9. PUBLISH EVENT: CHALLENGE_SUBMITTED
        publishChallengeEvent(ChallengeEvents.CHALLENGE_SUBMITTED, newChallenge);

        // 10. Return results
        return { 
            newChallenge, 
            cost: submissionCost, 
            updatedUser: userUpdateResult as User,
            updatedAccount: updatedAccount as Account
        };
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
                status: ChallengeStatus.ACTIVE,
                streamDaysSinceActivation: { gte: 21 }, // Greater than or equal to 21
            },
            data: {
                status: ChallengeStatus.ARCHIVED,
            },
        });

        return updateResult.count; // Returns the number of updated records
    });

    console.log(`[ChallengeService] Archived ${result} challenges.`);
    return result;
}


////////////////////////////////////////////////////////////////////////////////////////
// FINALIZE EXECUTING "InProgress" CHALLENGE | DAILY MAINTENANCE
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Finds the currently executing challenge (is_executing: true) and...
 * when the stream goes offline.
 * @returns The completed Challenge record, or null if none was executing.
 */
export async function finalizeInProgressChallenge(): Promise<Challenge | null> {
    
    // ... (find executingChallenge)
    const executingChallenge = await prisma.challenge.findFirst({
        where: { status: ChallengeStatus.IN_PROGRESS, isExecuting: true },
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
        updateData.status = ChallengeStatus.COMPLETED;
        updateData.timestampCompleted = transactionTimestamp;
    } 
    // Else: Status remains 'InProgress'.

    let completedChallenge = await prisma.challenge.update({
        where: { challengeId: executingChallenge.challengeId },
        data: updateData
    });
    
    const statusText = isCompleted ? ChallengeStatus.COMPLETED : `finished session ${nextSessionCount} of ${completedChallenge.totalSessions}. Status remains InProgress.`;
    console.log(`[ChallengeService] Challenge #${completedChallenge.challengeId} finalized as ${statusText}.`);

    return completedChallenge;
}


////////////////////////////////////////////////////////////////////////////////////////
// PROCESS EXECUTE CHALLENGE
////////////////////////////////////////////////////////////////////////////////////////
export async function processExecuteChallenge(challengeId: number): Promise<ExecuteResult> {
    
    return prisma.$transaction(async (tx) => {
        const transactionTimestamp = new Date().toISOString();

        // 1. Finalize the previously executing challenge (if any)
        const previousChallenge = await tx.challenge.findFirst({ where: { isExecuting: true } });
        
        // Store the boolean result of whether a previous challenge was found/stopped
        let wasPreviousChallengeStopped = false; 

        if (previousChallenge) {
            
            await tx.challenge.update({
                where: { challengeId: previousChallenge.challengeId },
                data: {
                    isExecuting: false,
                    // Clearing the tick ensures the scheduler ignores it immediately.
                    timestampLastSessionTick: null, 
                }
            });
            console.log(`[ChallengeService] Previous challenge #${previousChallenge.challengeId} manually stopped before launch.`);
            wasPreviousChallengeStopped = true; // Set the flag to true
        }

        // 2. Validate and fetch the challenge to be executed
        const challenge = await tx.challenge.findUnique({
            where: { challengeId: challengeId },
        });

        if (!challenge) { throw new Error(`Challenge ID ${challengeId} not found.`); }
        
        // Only Active (first session) or InProgress (resuming) challenges can be Executed.
        if (challenge.status !== ChallengeStatus.ACTIVE && challenge.status !== ChallengeStatus.IN_PROGRESS) {
            throw new Error(`Challenge #${challengeId} cannot be executed. Status must be 'ACTIVE' or 'IN_PROGRESS'`);
        }

        // 3. Execute the new challenge
        const newStatus = challenge.status === ChallengeStatus.ACTIVE ? ChallengeStatus.IN_PROGRESS : challenge.status;

        const updateData: any = {
            status: newStatus, 
            isExecuting: true,
            sessionStartTimestamp: transactionTimestamp,
            timestampLastSessionTick: new Date(), // CRITICAL: Start the 21-minute clock NOW!
        };

        // Set cadencePeriodStart ONLY when transitioning from ACTIVE to IN_PROGRESS
        if (challenge.status === ChallengeStatus.ACTIVE && challenge.durationType === 'RECURRING') {
            updateData.cadencePeriodStart = transactionTimestamp;
        }

        // Rename the returned variable to match the return block
        const executingChallenge = await tx.challenge.update({
            where: { challengeId: challengeId },
            data: updateData
        });

        if (executingChallenge.isExecuting) {
            // PUBLISH EVENT: CHALLENGE_EXECUTED
            publishChallengeEvent(ChallengeEvents.CHALLENGE_EXECUTED, executingChallenge);
        }

        // Use the correct variable names in the return object
        return {
            executingChallenge: executingChallenge, 
            wasPreviousChallengeStopped: wasPreviousChallengeStopped, 
        };
    });
}


////////////////////////////////////////////////////////////////////////////////////////
// FETCH ACTIVE CHALLENGES
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Fetches all challenges that are currently 'Active'.
 */
export async function getActiveChallenges() {
    return prisma.challenge.findMany({
        where: { status: ChallengeStatus.ACTIVE },
        orderBy: { totalNumbersSpent: 'desc' },
    });
}


////////////////////////////////////////////////////////////////////////////////////////
// PROCESS CHALLENGES REMOVERS
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Allows the Challenge author to remove their Challenge, refunding 21% of
 * the total spent cost back to all contributing pushers via an external API call.
 * @param authorUserId - The ID of the user executing the command (must be the author).
 * @param challengeId - The ID of the challenge to remove.
 */
// Type definition for the return value of the Prisma transaction
type ProcessRemoveTransactionResult = {
    updatedChallenge: Challenge;
    allExternalRefundsToProcess: { userId: number, refundAmount: number }[];
    totalRefundsAmount: number;
    option: RefundOption;
    fundsSinkText: string;
    toAuthor: number;
    toExternalPushers: number;
    toCommunityChest: number;
};

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
    toExternalPushers: number,
    option: RefundOption
}> {

    const refundsToProcess: { userId: number, refundAmount: number }[] = [];
    let totalRefundsAmount = 0; // The 21% amount

    // Fetch the current Stream Session ID ONCE before the transaction begins
    const currentStreamSessionId = getCurrentStreamSessionId();
    const transactionTimestamp = new Date().toISOString();

    // --- STEP 1: ATOMIC DATABASE TRANSACTION (Local State Change: Challenge/Global) ---
    const result: ProcessRemoveTransactionResult = await prisma.$transaction(async (tx): Promise<ProcessRemoveTransactionResult> => {
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

        // Explicitly type the array as ChallengeStatus[] to satisfy the compiler
        const unremovableStatuses: ChallengeStatus[] = [
            ChallengeStatus.ARCHIVED,
            ChallengeStatus.AUCTIONED,
            ChallengeStatus.IN_PROGRESS,
            ChallengeStatus.COMPLETED,
            ChallengeStatus.REMOVED
        ];

        if (unremovableStatuses.includes(challenge.status)) {
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
        } else if (option === 'author_and_chest') { // Option B
            toAuthor = authorRefundAmount;
            toCommunityChest = pushersRefundAmount;
            fundsSinkText = 'Author + Community Chest';
        } else if (option === 'author_and_pushers') { // Option C
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

        // C. Update Author's Per-User Stats (Tracking metrics)
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

        // D. Update Community Chest Ledger (User ID 1) and Balance
        if (toCommunityChest > 0) {
            
            // D1. Update the Community Chest's Aggregate Metrics (User ID 1)
            // This is the global running total for the chest.
            await tx.user.update({
                where: { id: 1 },
                data: {
                    totalToCommunityChest: { increment: toCommunityChest },
                }
            });
            
            // D2. Update the designated Community Chest Account balance
            await tx.account.update({
                where: {
                    platformId_platformName: {
                        platformId: 'community_chest', // Dedicated fixed platformId
                        platformName: PlatformName.GAME_MASTER // Designated sink platform
                    }
                },
                data: {
                    currentBalance: { increment: toCommunityChest }
                }
            });
        }
        
        // 5. Update Challenge Status (CRITICAL STATE CHANGE)
        const updatedChallenge = await tx.challenge.update({
            where: { challengeId: challengeId },
            data: {
                status: ChallengeStatus.REMOVED,
                isExecuting: false
            },
        });

        // --- Prepare the Consolidated External Refund List (TS/Logic FIX) ---
        // Start with the list of non-author pushers
        const allExternalRefundsToProcess = [...pushersRefundsToProcess];

        // If the author's share is meant for refund (Options B or C), add them to the list
        if (toAuthor > 0) {
            // Add the author to the list that needs to be processed by the external API in Step 2
            allExternalRefundsToProcess.push({ userId: authorUserId, refundAmount: toAuthor });
        }

        return {
            updatedChallenge,
            allExternalRefundsToProcess, // This is the consolidated list returned as 'result'
            totalRefundsAmount,
            option: option as RefundOption, // Cast to the expected type
            fundsSinkText,
            toAuthor,
            toExternalPushers,
            toCommunityChest
        };
    });

    // --- STEP 2: EXTERNAL REFUND CALLS (Lumia API INTEGRATION POINT) ---
    const successfulRefunds: { userId: number, amount: number }[] = [];
    const attemptedRefundCount = result.allExternalRefundsToProcess.length; // Max possible refunds

    // Only process external calls if the option involved External Refunds (Options B or C)
    const requiresExternalRefund = result.option === 'author_and_chest' || result.option === 'author_and_pushers';

    if (requiresExternalRefund && attemptedRefundCount > 0) {

        // 2a. Fetch platform IDs for all users requiring an external refund
        const userIdsToRefund = result.allExternalRefundsToProcess.map(r => r.userId);

        // Fetch ALL Accounts belonging to the users being refunded.
        // We must assume the refund is applied to ONE account. Let's arbitrarily choose the first one found
        // (or you can adjust this logic if you have a rule, like "Twitch account only").
        const accountsToRefund = await prisma.account.findMany({
            where: { userId: { in: userIdsToRefund } },
            select: { userId: true, platformId: true }
        });

        // Create a map from userId to platformId using the first Account found for that user.
        // This is a simplification; a more robust system might require tracking which platform
        // they were originally pushing from. Since the Push model only tracks `userId`,
        // we must default to a single Account per User for the refund.
        const platformIdMap = new Map<number, string>();
        accountsToRefund.forEach(account => {
            // Only map the first account found for each user
            if (!platformIdMap.has(account.userId)) {
                platformIdMap.set(account.userId, account.platformId);
            }
        });

        // 2b. Execute external refund calls (using Promise.all for potential parallel execution)
        const refundPromises = result.allExternalRefundsToProcess.map(async (refund) => {
            const platformId = platformIdMap.get(refund.userId);

            if (!platformId) {
                logger.error(`Refund Failed: User ${refund.userId} is missing platformId.`);
                return; // Failed to refund, no platform ID
            }

            try {
                // ⭐ CRITICAL: Call the authoritative credit API
                await addNumbersViaLumia(platformId, refund.refundAmount);

                // Track success (no need to update local balance here as Lumia is authoritative)
                successfulRefunds.push({ userId: refund.userId, amount: refund.refundAmount });

            } catch (error) {
                // 🛠️ FIX: Safely check if 'error' is an Error object before accessing '.message'
                const errorMessage = error instanceof Error ? error.message : 'Unknown payment error during refund.';

                logger.error(`Lumia Refund Failed for User ${refund.userId} (Amount: ${refund.refundAmount}): ${errorMessage}`, { userId: refund.userId, platformId });
            }
        });

        // Wait for all refund attempts to complete
        await Promise.all(refundPromises);
    }

    // --- STEP 3: FINAL RESPONSE ---

    // PUBLISH EVENT: CHALLENGE_REMOVED_BY_AUTHOR
    // The event payload includes the updated challenge status (REMOVED)
    publishChallengeEvent(ChallengeEvents.CHALLENGE_REMOVED_BY_AUTHOR, result.updatedChallenge);

    return {
        updatedChallenge: result.updatedChallenge,
        refundsProcessed: successfulRefunds.length,
        totalRefundsAmount: result.totalRefundsAmount,
        // Calculate failed refunds by subtracting successful attempts from the total possible attempts
        failedRefunds: attemptedRefundCount - successfulRefunds.length,
        fundsSink: result.fundsSinkText,
        toAuthor: result.toAuthor,
        toCommunityChest: result.toCommunityChest,
        toExternalPushers: result.toExternalPushers,
        option: result.option,
    };
}


////////////////////////////////////////////////////////////////////////////////////////
// PROCESS DISRUPT (Placeholder for Future Chaos) (No changes needed)
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Executes a placeholder 'Disrupt' command, applying a fixed cost while tracking metrics.
 * Actual disrupt logic will be implemented post-launch.
 */
export async function processDisrupt(
    userId: number,
    platformId: string, // ⭐ NEW PARAMETER
    platformName: PlatformName // ⭐ NEW PARAMETER
): Promise<string> {

    const currentStreamSessionId = getCurrentStreamSessionId();
    const transactionTimestamp = new Date().toISOString();
    
    return prisma.$transaction(async (tx) => {
        // 1. Fetch User and Account and check balance
        // Fetch the specific Account instead of the User
        const accountContext = await tx.account.findUnique({
            where: {
                 platformId_platformName: {
                    platformId: platformId, 
                    platformName: platformName
                }
            },
            select: { currentBalance: true } 
        });

        if (!accountContext) {
            throw new Error(`Account not found for user ${userId} on platform ${platformName}.`);
        }

        // Optimistic Local Balance Check (Check Account balance)
        if (accountContext.currentBalance < DISRUPT_COST) {
            throw new Error(`Insufficient balance on ${platformName} account. Disrupt costs ${DISRUPT_COST} NUMBERS.`);
        }

        // Execute Authoritative Deduction via Lumia API
        let newAuthoritativeBalance: number;
        
        try {
            // Use the platformId passed in the function signature
            const lumiaResult = await deductNumbersViaLumia(platformId, DISRUPT_COST); 
            newAuthoritativeBalance = lumiaResult.newBalance; 
        } catch (error) {
            logger.error(`Lumia Disrupt Deduction Failed for User ${userId} (Cost: ${DISRUPT_COST}): ${error instanceof Error ? error.message : 'Unknown error'}`, { userId, platformId: platformId });
            const errorMessage = error instanceof Error ? error.message : 'Unknown payment failure.';
            throw new Error(`Payment failed. ${errorMessage.includes('Insufficient funds') ? 'Insufficient funds.' : 'Lumia connection error.'}`);
        }

        // 2. Execute Transaction: Deduct cost and update metrics
        
        // A. Update User Stats: REMOVE BALANCE UPDATE
        await tx.user.update({
            where: { id: userId },
            data: {
                // REMOVE lastKnownBalance update from User
                totalNumbersSpent: { increment: DISRUPT_COST },
                totalDisruptsExecuted: { increment: 1 },
                lastActivityTimestamp: transactionTimestamp,
                ...(currentStreamSessionId && {
                    lastLiveActivityTimestamp: transactionTimestamp,
                }),
            },
        });

        // Update Account Balance: Update the specific Account with the authoritative balance
        await tx.account.update({
            where: {
                platformId_platformName: {
                    platformId: platformId, 
                    platformName: platformName
                }
            },
            data: {
                currentBalance: newAuthoritativeBalance,
            }
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
            "We promise to make it hurt later. (Maybe...)"
        );
    });
}


////////////////////////////////////////////////////////////////////////////////////////
// SET CHALLENGE STATUS BY ADMIN
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Allows the Game Master (admin) to set a specific status on any challenge.
 * This bypasses normal challenge lifecycle rules.
 * @param challengeId - The ID of the challenge to modify.
 * @param newStatus - The target ChallengeStatus enum value.
 * @returns The updated Challenge record.
 */
export async function setChallengeStatusByAdmin(
    challengeId: number,
    newStatus: ChallengeStatus
): Promise<Challenge> {
    // 1. Basic Validation (ensure the status is valid)
    if (!Object.values(ChallengeStatus).includes(newStatus)) {
        throw new Error(`Invalid status provided: ${newStatus}.`);
    }
    
    // 2. Perform the update
    const updateData: any = { 
        status: newStatus,
        // When setting to REMOVED, ARCHIVED, or FAILED, ensure it's not currently executing
        ...(newStatus !== ChallengeStatus.IN_PROGRESS && { 
            isExecuting: false 
        }),
        // Optionally, record the completion timestamp if setting to a final state
        ...(newStatus === ChallengeStatus.COMPLETED && {
            timestampCompleted: new Date().toISOString()
        })
    };

    try {
        const updatedChallenge = await prisma.challenge.update({
            where: { challengeId: challengeId },
            data: updateData
        });
        
        console.log(`[ChallengeService] GM set Challenge #${challengeId} status to ${newStatus}.`);

        // ⭐ NEW: Event Dispatching based on the new status
        if (newStatus === ChallengeStatus.COMPLETED) {
            // GM force-completed the challenge
            publishChallengeEvent(ChallengeEvents.CHALLENGE_COMPLETED, updatedChallenge);
        } else if (newStatus === ChallengeStatus.REMOVED) {
            // GM set the final status to REMOVED
            publishChallengeEvent(ChallengeEvents.CHALLENGE_REMOVED, updatedChallenge);
        } else if (newStatus === ChallengeStatus.ACTIVE) {
            // GM is manually activating/reviving a challenge
            publishChallengeEvent(ChallengeEvents.CHALLENGE_ACTIVATED_BY_GM, updatedChallenge); 
        }

        return updatedChallenge;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown database error during status update.';
        throw new Error(`Failed to set challenge status for ID ${challengeId}: ${errorMessage}`);
    }
}