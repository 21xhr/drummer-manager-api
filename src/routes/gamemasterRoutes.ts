// src/routes/gamemasterRoutes.ts
import { Router, Request, Response } from 'express';
// import * as Prisma from '@prisma/client';
import { ChallengeStatus } from '@prisma/client';
import * as Prisma from '@prisma/client';
import * as challengeService from '../services/challengeService';
import logger from '../logger'; // Winston Logger
import { getServiceErrorStatus } from '../utils/routeUtils';
import { authenticateUser, authenticateGameMaster } from '../middleware/authMiddleware';

const router = Router();

// -----------------------------------------------------------
// EXECUTE CHALLENGE
// -----------------------------------------------------------
router.post('/challenges/execute', authenticateGameMaster, async (req: Request, res: Response) => {
    // Note: The authorization check is now handled entirely by authenticateGameMaster middleware.
    const { challengeId } = req.body;
    const authorUserId = req.userId; // User ID authenticated by the middleware (guaranteed to be a user defined in ADMIN_USER_ID)

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
// SET CHALLENGE STATUS (ADMIN)
// -----------------------------------------------------------
/**
 * Allows the Game Master to set an arbitrary status for a challenge.
 * PUT /gm/challenge/:challengeId/status
 */
router.put('/challenge/:challengeId/status', authenticateGameMaster, async (req: Request, res: Response) => {
    const challengeId = parseInt(req.params.challengeId, 10);
    const { status } = req.body; 

    if (!status) {
        return res.status(400).json({ message: "Missing 'status' in request body." });
    }
    if (challengeId === undefined || isNaN(challengeId)) {
        return res.status(400).json({ message: "Missing or invalid challengeId parameter." });
    }

    const newStatus = status.toUpperCase() as ChallengeStatus;
    
    try {
        const updatedChallenge = await challengeService.setChallengeStatusByAdmin(
            challengeId,
            newStatus
        );

        return res.status(200).json({ 
            message: `Challenge #${challengeId} status successfully set to ${newStatus} by the Game Master.`,
            action: 'gm_status_update_success',
            challenge: updatedChallenge
        });

    } catch (error) {
        logger.error(`GM Status Update Error for #${challengeId}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        const status = getServiceErrorStatus(errorMessage); 
        
        return res.status(status).json({
            message: errorMessage,
            action: 'gm_status_update_failure',
            error: errorMessage,
        });
    }
});