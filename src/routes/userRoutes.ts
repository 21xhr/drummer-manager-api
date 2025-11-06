// src/routes/userRoutes.ts
import { Router } from 'express'; 
import * as challengeService from '../services/challengeService'; 
import { findOrCreateUser } from '../services/userService'; 
import logger from '../logger'; // Winston Logger

const router = Router();

// --- Centralized Error Status Helper ---
function getServiceErrorStatus(errorMessage: string): number {
    // 400 Bad Request (Client did something wrong: not found, invalid state, insufficient balance)
    if (
        errorMessage.includes("Challenge ID") || 
        errorMessage.includes("not found") || 
        errorMessage.includes("Status is") ||
        errorMessage.includes("Insufficient balance") || 
        errorMessage.includes("Quote has expired") || 
        errorMessage.includes("Multiple active quotes") ||
        errorMessage.includes("cannot be dug out") ||
        errorMessage.includes("already been digged out") || // Corrected spelling for robustness
        errorMessage.includes("currently being processed")
    ) {
        return 400;
    }
    
    // 403 Forbidden (Unauthorized action)
    if (
        errorMessage.includes("only be removed by the author") || 
        errorMessage.includes("cannot be removed while in status")
    ) {
         return 403;
    }
    
    // 500 Internal Server Error (Something unexpected happened)
    return 500;
}
// ---------------------------------------

// Middleware to standardize user input and ensure user registration
const authenticateUser = async (req: any, res: any, next: any) => {
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
// 1. CHALLENGE SUBMISSION
// -----------------------------------------------------------
router.post('/submit', authenticateUser, async (req: any, res) => {
    const { challengeText } = req.body;
    const userId = req.userId;

    if (!challengeText) {
        return res.status(400).json({ error: "Missing challengeText." });
    }

    try {
        const { newChallenge, cost } = await challengeService.processChallengeSubmission(
            userId, 
            challengeText
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
// 5. GET ACTIVE CHALLENGES (No auth required)
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
// 6. REMOVE CHALLENGE
// -----------------------------------------------------------
router.post('/challenges/remove', authenticateUser, async (req: any, res) => {
    const { challengeId } = req.body;
    const authorUserId = req.userId; 

    if (challengeId === undefined || isNaN(parseInt(challengeId))) {
        return res.status(400).json({ message: 'Missing or invalid challengeId parameter.' });
    }

    try {
        const result = await challengeService.processRemove(authorUserId, parseInt(challengeId));
        
        // AUDIT LOG (Success)
        logger.info(`REMOVE Success: #${challengeId} removed by User ${authorUserId}. Refunds: ${result.totalRefundsAmount}`, {
            challengeId: challengeId,
            authorUserId: authorUserId,
            totalRefundsAmount: result.totalRefundsAmount,
            refundsProcessed: result.refundsProcessed,
            platformId: req.platformId,
            action: 'challenge_removed'
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: `Challenge #${challengeId} removed successfully. ${result.refundsProcessed} pushers refunded a total of ${result.totalRefundsAmount} NUMBERS.`,
            action: 'challenge_removed',
            data: result.updatedChallenge,
            refundDetails: {
                totalRefunds: result.totalRefundsAmount,
                count: result.refundsProcessed
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