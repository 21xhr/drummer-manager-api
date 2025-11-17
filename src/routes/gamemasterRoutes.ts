// src/routes/gamemasterRoutes.ts
import { Router, Request, Response } from 'express';
import * as challengeService from '../services/challengeService'; 
import logger from '../logger'; // Winston Logger
import { getServiceErrorStatus } from '../utils/routeUtils';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

// -----------------------------------------------------------
// EXECUTE CHALLENGE
// -----------------------------------------------------------
router.post('/challenges/execute', authenticateUser, async (req: Request, res: Response) => {
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

