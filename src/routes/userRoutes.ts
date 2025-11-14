// src/routes/userRoutes.ts
import { Router } from 'express'; 
import * as challengeService from '../services/challengeService'; 
import { findOrCreateUser } from '../services/userService'; 
import logger from '../logger'; // Winston Logger
import { RefundOption } from '../services/challengeService';
import { verifyToken } from '../services/jwtService'; 

const router = Router();

// --- Centralized Error Status Helper ---
function getServiceErrorStatus(errorMessage: string): number {
    // 400 Bad Request (Client did something wrong: not found, invalid state, insufficient balance)
    if (
        errorMessage.includes("Challenge ID") || 
        errorMessage.includes("not found") || 
        errorMessage.includes("Status is") ||
        errorMessage.includes("cannot be executed. Status must be 'Active'") ||
        errorMessage.includes("Insufficient balance") || 
        errorMessage.includes("Quote has expired") || 
        errorMessage.includes("Multiple active quotes") ||
        errorMessage.includes("cannot be dug out") ||
        errorMessage.includes("already been digged out") ||
        errorMessage.includes("currently being processed")
    ) {
        return 400;
    }
    
    // 403 Forbidden (Unauthorized action)
    if (
        errorMessage.includes("only be removed by the author") || 
        errorMessage.includes("cannot be removed while in status") ||
        // Catch generic unauthorized/access denied messages (e.g., from execute endpoint)
        errorMessage.includes("Access Denied") || 
        errorMessage.includes("unauthorized")
    ) {
         return 403;
    }
    
    // 500 Internal Server Error (Something unexpected happened)
    return 500;
}
// ---------------------------------------

// Middleware to standardize user input and ensure user registration
export const authenticateUser = async (req: any, res: any, next: any) => {
    const { platformId, platformName } = req.body;

    if (!platformId || !platformName) {
        return res.status(400).json({ error: "Missing platformId or platformName in request body." });
    }

    try {
        const user = await findOrCreateUser({ platformId, platformName });
        req.userId = user.id; 
        req.platformId = user.platformId;
        req.platformName = user.platformName;
        next();
    } catch (error) {
        logger.error('User Authentication Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({ 
            message: 'Failed to find or create user.',
            error: errorMessage,
        });
    }
};

// -----------------------------------------------------------
// 1. CHALLENGE SUBMISSION (LEGACY/CHAT) - CONSISTENCY UPDATE
// -----------------------------------------------------------
router.post('/submit', authenticateUser, async (req: any, res) => {
    // NOTE: This legacy route remains for chat-only submission requests but should be deprecated 
    // in favor of the /submit/web flow (which uses a separate token generation endpoint).
    const { challengeText, totalSessions, durationType, cadence } = req.body;
    const userId = req.userId;

   if (!challengeText || !totalSessions || !durationType) {
        return res.status(400).json({ 
            error: "Missing required fields: challengeText, totalSessions, or durationType." 
        });
    }

    // Cadence validation for recurring challenges
    if (durationType === 'RECURRING' && !cadence) {
        return res.status(400).json({ 
            error: "Cadence is required for Recurring challenges." 
        });
    }

    const sessions = parseInt(totalSessions);
    if (isNaN(sessions) || sessions < 1) {
        return res.status(400).json({ error: "totalSessions must be a positive number." });
    }

    try {
        const { newChallenge, cost } = await challengeService.processChallengeSubmission(
            userId, 
            challengeText,
            totalSessions,
            durationType,
            cadence
        );
        
        // AUDIT LOG (Success)
        logger.info(`SUBMIT Success: #${newChallenge.challengeId} by User ${userId}`, {
            challengeId: newChallenge.challengeId,
            cost: cost,
            proposerUserId: userId,
            platformId: req.platformId,
            platformName: req.platformName,
            action: 'submission_success'
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: `Challenge #${newChallenge.challengeId} submitted successfully for a cost of ${cost} NUMBERS.`,
            action: 'submission_success',
            details: {
                challengeId: newChallenge.challengeId,
                cost: cost,
                challengeText: newChallenge.challengeText,
                status: newChallenge.status
            }
        });
        
    } catch (error) {
        logger.error('Challenge Submission Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = getServiceErrorStatus(errorMessage); 
        
        return res.status(status).json({
            message: status === 500 ? 'Challenge submission failed due to a server error.' : errorMessage,
            action: 'submission_failure',
            error: errorMessage,
        });
    }
});


// -----------------------------------------------------------
// 1.5. WEB FORM CHALLENGE SUBMISSION (NEW)
// -----------------------------------------------------------
/**
 * POST /api/v1/user/submit/web
 * * Handles the final challenge submission from the web form, validating the JWT.
 */
router.post('/submit/web', async (req: any, res) => {
    // Expected inputs from the web form: token, form fields
    // ⭐ UPDATE: Destructure token and cadence
    const { token, challengeText, totalSessions, durationType, cadence } = req.body; 
    let userId: number;
    let platformId: string;
    let platformName: string;

    // 1. JWT Authentication and Identity Extraction
    try {
        if (!token) {
            return res.status(401).json({ error: "Missing authentication token." });
        }
        
        const payload = verifyToken(token); // Throws if invalid/expired
        userId = payload.userId;
        platformId = payload.platformId;
        platformName = payload.platformName;

    } catch (error) {
        logger.error('JWT Validation Error:', error);
        return res.status(401).json({ 
            message: 'Authentication failed. Token is invalid or expired.',
            action: 'jwt_auth_failure',
            error: error instanceof Error ? error.message : 'Unknown authentication error.',
        });
    }

    // 2. Input Validation (Post-Auth)
    if (!challengeText || totalSessions === undefined || !durationType) {
        return res.status(400).json({ 
            error: "Missing required challenge fields (text, sessions, or duration)." 
        });
    }

    // ⭐ NEW: Cadence validation for recurring challenges
    if (durationType === 'RECURRING' && !cadence) {
        return res.status(400).json({ 
            error: "Cadence is required for Recurring challenges." 
        });
    }
    
    // Convert to integer and validate
    const sessions = parseInt(totalSessions);
    if (isNaN(sessions) || sessions < 1) {
        return res.status(400).json({ error: "totalSessions must be a positive number." });
    }

    // 3. Process Submission Transaction
    try {
        // ⭐ REUSE THE EXISTING, ATOMIC SERVICE FUNCTION with new cadence parameter ⭐
        const { newChallenge, cost } = await challengeService.processChallengeSubmission(
            userId, // Authenticated via JWT
            challengeText,
            sessions,
            durationType,
            cadence // ⭐ NEW: Pass cadence to the service
        );
        
        // ... (rest of success/error handling is the same) ...
        
    } catch (error) {
        // ... (rest of error handling is the same) ...
    }
});


// -----------------------------------------------------------
// 2. PUSH QUOTE
// -----------------------------------------------------------
router.post('/push/quote', authenticateUser, async (req: any, res) => {
    const { challengeId, quantity } = req.body;
    const userId = req.userId;

    if (challengeId === undefined || quantity === undefined || isNaN(parseInt(challengeId)) || isNaN(parseInt(quantity))) {
        return res.status(400).json({ error: "Missing or invalid challengeId or quantity." });
    }

    try {
        const { quoteId, quotedCost, challenge } = await challengeService.processPushQuote(
            userId,
            parseInt(challengeId),
            parseInt(quantity)
        );
        
        // AUDIT LOG (Success)
        logger.info(`QUOTE Success: #${challenge.challengeId} for ${quantity} by User ${userId}`, {
            quoteId: quoteId,
            challengeId: challenge.challengeId,
            quotedCost: quotedCost,
            quantity: quantity,
            platformId: req.platformId,
            action: 'quote_success'
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: `Quote generated for Challenge #${challenge.challengeId}. Cost: ${quotedCost} NUMBERS. Confirm with !push confirm ${quoteId.slice(0, 8)}`,
            action: 'quote_success',
            details: {
                quoteId: quoteId,
                challengeId: challenge.challengeId,
                quotedCost: quotedCost,
                quantity: quantity
            }
        });
    } catch (error) {
        logger.error('Push Quote Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = getServiceErrorStatus(errorMessage); 
        
        return res.status(status).json({
            message: status === 500 ? 'Push quote failed due to a server error.' : errorMessage,
            action: 'quote_failure',
            error: errorMessage,
        });
    }
});


// -----------------------------------------------------------
// 3. PUSH CONFIRM
// -----------------------------------------------------------
router.post('/push/confirm', authenticateUser, async (req: any, res) => {
    const { quoteId } = req.body; 
    const userId = req.userId;

    try {
        const { updatedChallenge, transactionCost, quantity } = await challengeService.processPushConfirm(
            userId,
            quoteId
        );
        
        // AUDIT LOG (Success)
        logger.info(`PUSH CONFIRM Success: ${quantity} pushes on #${updatedChallenge.challengeId} for User ${userId}`, {
            challengeId: updatedChallenge.challengeId,
            cost: transactionCost,
            quantity: quantity,
            platformId: req.platformId,
            action: 'push_confirm_success'
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: `Push confirmed! ${quantity} pushes applied to Challenge #${updatedChallenge.challengeId}.`,
            action: 'push_confirm_success',
            details: {
                challengeId: updatedChallenge.challengeId,
                totalPush: updatedChallenge.totalPush,
                cost: transactionCost,
                quantity: quantity
            }
        });
    } catch (error) {
        logger.error('Push Confirmation Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = getServiceErrorStatus(errorMessage); 
        
        return res.status(status).json({
            message: status === 500 ? 'Push confirmation failed due to a server error.' : errorMessage,
            action: 'push_confirm_failure',
            error: errorMessage,
        });
    }
});


// -----------------------------------------------------------
// 4. DIGOUT
// -----------------------------------------------------------
router.post('/digout', authenticateUser, async (req: any, res) => {
    const { challengeId } = req.body; 
    const userId = req.userId;

    if (challengeId === undefined || isNaN(parseInt(challengeId))) {
        return res.status(400).json({ error: "Missing or invalid challengeId." });
    }

    try {
        const { updatedChallenge, updatedUser, cost } = await challengeService.processDigout(
            userId,
            parseInt(challengeId)
        );
        
        // AUDIT LOG (Success)
        logger.info(`DIGOUT Success: #${updatedChallenge.challengeId} cost ${cost} by User ${userId}`, {
            challengeId: updatedChallenge.challengeId,
            cost: cost,
            newBalance: updatedUser.lastKnownBalance,
            platformId: req.platformId,
            action: 'digout_success'
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: `Challenge #${updatedChallenge.challengeId} has been dug out for a cost of ${cost} NUMBERS!`,
            action: 'digout_success',
            details: {
                challengeId: updatedChallenge.challengeId,
                cost: cost,
                status: updatedChallenge.status,
                newBalance: updatedUser.lastKnownBalance
            }
        });
    } catch (error) {
        logger.error('Digout Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = getServiceErrorStatus(errorMessage); 
        
        return res.status(status).json({
            message: status === 500 ? 'Digout failed due to a server error.' : errorMessage,
            action: 'digout_failure',
            error: errorMessage,
        });
    }
});

// -----------------------------------------------------------
// 5. DISRUPT (Placeholder for future chaos)
// -----------------------------------------------------------
router.post('/disrupt', authenticateUser, async (req: any, res) => {
    const userId = req.userId; // AuthenticateUser middleware handles finding/creating the user

    try {
        // Calls the placeholder function created earlier
        const message = await challengeService.processDisrupt(userId);
        
        // AUDIT LOG (Success)
        logger.info(`DISRUPT Success: Cost 2100 by User ${userId}`, {
            cost: 2100,
            platformId: req.platformId,
            action: 'disrupt_success'
        });

        // RETURN RESPONSE (Uses the unique message from processDisrupt)
        return res.status(200).json({
            message: message,
            action: 'disrupt_success',
            details: {
                cost: 2100,
            }
        });
    } catch (error) {
        logger.error('Disrupt Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = getServiceErrorStatus(errorMessage); 
        
        return res.status(status).json({
            message: status === 500 ? 'Disrupt failed due to a server error.' : errorMessage,
            action: 'disrupt_failure',
            error: errorMessage,
        });
    }
});

// -----------------------------------------------------------
// GET ACTIVE CHALLENGES (No auth required)
// -----------------------------------------------------------
router.get('/challenges/active', async (req, res) => {
    try {
        const challenges = await challengeService.getActiveChallenges();
        
        // AUDIT LOG (Success) - Logging read operations is less critical, but good for tracking API usage.
        logger.info(`READ Success: Retrieved ${challenges.length} active challenges.`, {
            count: challenges.length,
            action: 'challenges_retrieved'
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: `${challenges.length} active challenges retrieved.`,
            action: 'challenges_retrieved',
            data: challenges
        });
    } catch (error) {
        logger.error('Get Active Challenges Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        
        return res.status(500).json({
            message: 'Failed to retrieve active challenges due to a server error.',
            error: errorMessage,
        });
    }
});


// -----------------------------------------------------------
// EXECUTE CHALLENGE
// -----------------------------------------------------------
router.post('/challenges/execute', authenticateUser, async (req: any, res) => {
    // Note: Execution only requires the Challenge ID; the caller's ID is used for auth/logging.
    const { challengeId } = req.body;
    const authorUserId = req.userId; // User ID authenticated by the middleware

    // ⭐ AUTHORIZATION CHECK: ONLY ALLOW USER ID 21 (ADMIN)
    const ADMIN_USER_ID = 21;
    if (authorUserId !== ADMIN_USER_ID) {
        // Return 403 Forbidden for unauthorized access
        return res.status(403).json({ 
            message: "Access Denied. This endpoint is restricted to the administrator (User ID 21).",
            action: 'authorization_failure'
        });
    }
    // ⭐ END AUTHORIZATION CHECK

    if (challengeId === undefined || isNaN(parseInt(challengeId))) {
        return res.status(400).json({ message: 'Missing or invalid challengeId parameter.' });
    }

    try {
        const executingChallenge = await challengeService.processExecuteChallenge(parseInt(challengeId));
        
        // AUDIT LOG (Success)
        logger.info(`EXECUTE Success: Challenge #${executingChallenge.challengeId} launched by Admin User ${authorUserId}.`, {
            challengeId: executingChallenge.challengeId,
            proposerUserId: executingChallenge.proposerUserId,
            platformId: req.platformId,
            action: 'challenge_executed'
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: `Challenge #${executingChallenge.challengeId} is now **EXECUTING**! The previous challenge has been finalized.`,
            action: 'challenge_executed',
            data: {
                challengeId: executingChallenge.challengeId,
                status: executingChallenge.status,
                isExecuting: executingChallenge.isExecuting
            }
        });
    } catch (error) {
        logger.error('Execute Challenge Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = getServiceErrorStatus(errorMessage); 
        
        return res.status(status).json({
            message: status === 500 ? 'Challenge execution failed due to a server error.' : errorMessage,
            action: 'challenge_execute_failure',
            error: errorMessage,
        });
    }
});


// -----------------------------------------------------------
// REMOVE CHALLENGE
// -----------------------------------------------------------
router.post('/challenges/remove', authenticateUser, async (req: any, res) => {
    const { challengeId, option } = req.body;
    const authorUserId = req.userId; 

    // Map user input (A/B/C) to the internal RefundOption string
    const OPTION_MAP: { [key: string]: RefundOption } = {
        'A': 'community_forfeit',
        'B': 'author_and_chest',
        'C': 'author_and_pushers',
    };
    const userOption = option ? option.toUpperCase() : null; // Normalize input
    const internalOption = userOption ? OPTION_MAP[userOption] : undefined;

    if (challengeId === undefined || isNaN(parseInt(challengeId))) {
        return res.status(400).json({ message: 'Missing or invalid challengeId parameter.' });
    }

    // Input validation against the keys (A, B, C, D)
    if (userOption && !OPTION_MAP[userOption]) {
         return res.status(400).json({ message: `Invalid refund option provided. Must be 'A' (Chest Forfeit), 'B' (Author + Chest), or 'C' (Author + Pushers).` });
    }
    
    try {
        const result = await challengeService.processRemove(authorUserId, parseInt(challengeId), internalOption);
        
        // Response Message Customization
        let sinkMessage = '';
        
        if (result.option === 'community_forfeit') { // Option A
            sinkMessage = `All ${result.totalRefundsAmount} NUMBERS were forfeited to the Community Chest.`;
        } else if (result.option === 'author_and_chest') { // Option B
            sinkMessage = `Your ${result.toAuthor} NUMBERS were refunded externally. The remaining ${result.toCommunityChest} NUMBERS were forfeited to the Community Chest.`;
        } else if (result.option === 'author_and_pushers') { // Option C
            sinkMessage = `The total refund of ${result.totalRefundsAmount} NUMBERS was directed back to you and the contributing Pushers (${result.refundsProcessed} successful).`;
        }

        // AUDIT LOG (Success)
        logger.info(`REMOVE Success: #${challengeId} removed by User ${authorUserId}. Funds sink: ${result.fundsSink}`, {
            challengeId: challengeId,
            authorUserId: authorUserId,
            totalRefundsAmount: result.totalRefundsAmount,
            refundsProcessed: result.refundsProcessed,
            fundsSink: result.fundsSink, 
            platformId: req.platformId,
            action: 'challenge_removed'
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: `Challenge #${challengeId} removed successfully. ${sinkMessage}`,
            action: 'challenge_removed',
            data: result.updatedChallenge,
            refundDetails: {
                totalRefunds: result.totalRefundsAmount,
                count: result.refundsProcessed,
                sink: result.fundsSink 
            }
        });
    } catch (error) {
        logger.error('Remove Challenge Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = getServiceErrorStatus(errorMessage); 
        
        return res.status(status).json({
            message: status === 500 ? 'Challenge removal failed due to a server error.' : errorMessage,
            action: 'challenge_removal_failure',
            error: errorMessage,
        });
    }
});

export default router;