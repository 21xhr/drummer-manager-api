// src/routes/userRoutes.ts
import { Router } from 'express'; 
import * as challengeService from '../services/challengeService'; 
import { findOrCreateUser } from '../services/userService'; // <-- NEW IMPORT

const router = Router();

// Middleware to standardize user input and ensure user registration
// This extracts the platform data and ensures we get a valid internal user ID (userId)
const authenticateUser = async (req: any, res: any, next: any) => {
    const { platformId, platformName } = req.body;

    if (!platformId || !platformName) {
        return res.status(400).json({ error: "Missing platformId or platformName in request body." });
    }

    try {
        const user = await findOrCreateUser({ platformId, platformName });
        // Attach the internal user ID and the external platform name/ID to the request object for later use
        req.userId = user.id; 
        req.platformId = user.platformId; // Optional, for logging/debugging
        req.platformName = user.platformName; // Optional, for logging/debugging
        next();
    } catch (error) {
        console.error('User Authentication Error:', error);
        // FIX: Type narrowing applied here too
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({ 
            message: 'Failed to find or create user.',
            error: errorMessage,
        });
    }
};

// -----------------------------------------------------------
// 1. CHALLENGE SUBMISSION
// POST /api/v1/user/submit - Command: !challengesubmit
// -----------------------------------------------------------
router.post('/submit', authenticateUser, async (req: any, res) => {
    const { challengeText } = req.body;
    const userId = req.userId; // Retrieved from authenticateUser middleware

    if (!challengeText) {
        return res.status(400).json({ error: "Missing challengeText." });
    }

    try {
        const { newChallenge, cost } = await challengeService.processNewChallengeSubmission(
            userId, 
            challengeText
        );

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
        console.error('Challenge Submission Error:', error);
        // FIX: Type narrowing applied
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            message: 'Challenge submission failed.',
            action: 'submission_failure',
            error: errorMessage,
        });
    }
});


// -----------------------------------------------------------
// 2. PUSH QUOTE
// POST /api/v1/user/push/quote - Command: !push [ID] [N]
// -----------------------------------------------------------
router.post('/push/quote', authenticateUser, async (req: any, res) => {
    const { challengeId, quantity } = req.body;
    const userId = req.userId; // Retrieved from authenticateUser middleware

    if (challengeId === undefined || quantity === undefined || isNaN(parseInt(challengeId)) || isNaN(parseInt(quantity))) {
        return res.status(400).json({ error: "Missing or invalid challengeId or quantity." });
    }

    try {
        const { quoteId, quotedCost, challenge } = await challengeService.processPushQuote(
            userId,
            parseInt(challengeId),
            parseInt(quantity)
        );

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
        console.error('Push Quote Error:', error);
        // FIX: Type narrowing applied
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            message: 'Push quote failed.',
            action: 'quote_failure',
            error: errorMessage,
        });
    }
});


// -----------------------------------------------------------
// 3. PUSH CONFIRM
// POST /api/v1/user/push/confirm - Command: !push confirm [UUID]
// -----------------------------------------------------------
router.post('/push/confirm', authenticateUser, async (req: any, res) => {
    const { quoteId } = req.body; 
    const userId = req.userId; // Retrieved from authenticateUser middleware

    try {
        const { updatedChallenge, transactionCost, quantity } = await challengeService.processPushConfirm(
            userId,
            quoteId // quoteId can be undefined if user uses !push confirm without UUID
        );

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
        console.error('Push Confirmation Error:', error);
        // FIX: Type narrowing applied
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            message: 'Push confirmation failed.',
            action: 'push_confirm_failure',
            error: errorMessage,
        });
    }
});


// -----------------------------------------------------------
// 4. DIGOUT
// POST /api/v1/user/digout - Command: !digout [ID]
// -----------------------------------------------------------
router.post('/digout', authenticateUser, async (req: any, res) => {
    const { challengeId } = req.body; 
    const userId = req.userId; // Retrieved from authenticateUser middleware

    if (challengeId === undefined || isNaN(parseInt(challengeId))) {
        return res.status(400).json({ error: "Missing or invalid challengeId." });
    }

    try {
        const { updatedChallenge, updatedUser, cost } = await challengeService.processDigout(
            userId,
            parseInt(challengeId)
        );

        return res.status(200).json({
            message: `Challenge #${updatedChallenge.challengeId} has been dug out for a cost of ${cost} NUMBERS!`,
            action: 'digout_success',
            details: {
                challengeId: updatedChallenge.challengeId,
                cost: cost,
                status: updatedChallenge.status,
                newBalance: updatedUser.lastKnownBalance // Assuming lastKnownBalance is updated or returned correctly
            }
        });
    } catch (error) {
        console.error('Digout Error:', error);
        // FIX: Type narrowing applied
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            message: 'Digout failed.',
            action: 'digout_failure',
            error: errorMessage,
        });
    }
});

// -----------------------------------------------------------
// 5. GET ACTIVE CHALLENGES
// GET /api/v1/user/challenges/active
// -----------------------------------------------------------
router.get('/challenges/active', async (req, res) => {
    try {
        const challenges = await challengeService.getActiveChallenges();
        
        return res.status(200).json({
            message: `${challenges.length} active challenges retrieved.`,
            action: 'challenges_retrieved',
            data: challenges
        });
    } catch (error) {
        console.error('Get Active Challenges Error:', error);
        // FIX: Type narrowing applied
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            message: 'Failed to retrieve active challenges.',
            error: errorMessage,
        });
    }
});

// -----------------------------------------------------------
// 6. REMOVE CHALLENGE
// POST /api/v1/user/challenges/remove
// Triggered by: !remove [ID]
// -----------------------------------------------------------
router.post('/challenges/remove', authenticateUser, async (req: any, res) => {
    const { challengeId } = req.body;
    // FIX: Retrieve the userId correctly from the req object (where the middleware placed it)
    const authorUserId = req.userId; 

    if (challengeId === undefined || isNaN(parseInt(challengeId))) {
        return res.status(400).json({ message: 'Missing or invalid challengeId parameter.' });
    }

    try {
        const result = await challengeService.processRemove(authorUserId, parseInt(challengeId));
        
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
        console.error('Remove Challenge Error:', error);
        
        // FIX: Type narrowing applied
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        
        // Using 403 for authorization error, 400 for general failure/validation
        const status = (errorMessage.includes("author") || errorMessage.includes("status")) ? 403 : 400;

        return res.status(status).json({
            message: errorMessage,
            error: errorMessage,
        });
    }
});

export default router;