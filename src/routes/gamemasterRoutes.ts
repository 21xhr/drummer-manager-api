// src/routes/gamemasterRoutes.ts
import { Router, Request, Response } from 'express';
import { ChallengeStatus } from '@prisma/client';
import * as challengeService from '../services/challengeService';
import logger from '../logger'; // Winston Logger
import { getServiceErrorStatus } from '../utils/routeUtils';
import { authenticateGameMaster } from '../middleware/authMiddleware';

const router = Router();


// ------------------------------------------------------------------
// ⭐ CORE COMMAND ENTRYPOINT
// The API endpoint that receives commands and data from the external system (e.g., Lumia Stream).
// ------------------------------------------------------------------

/**
 * Handles all game commands sent by the external bot/loyalty system.
 * The request body is expected to contain all necessary context: user, platform, command.
 */
router.post('/command', async (req: Request, res: Response) => {
    // ⚠️ IMPORTANT: We will implement authentication middleware here later!
    // For now, allow all calls to this entrypoint.
    
    const { 
        command, 
        user, 
        platform 
    } = req.body;

    // Use platformId for logging, as 'user' might not be a full User object yet
    const platformId = user?.platformId || 'UNKNOWN';

    if (!command || !user || !platform) {
        logger.error('Invalid command request: missing command, user, or platform context.');
        return res.status(400).json({ error: 'Missing required fields (command, user, platform).' });
    }

    // For now, we only log the incoming command to verify the endpoint works.
    logger.info(`Received command: ${command} from user: ${platformId} on platform: ${platform.name}`);

    // TODO: Implement a dispatcher function to call specific service logic (e.g., processPush, processSubmit).

    // Return a 200 OK for now, assuming the command was received for processing.
    return res.status(200).json({ 
        message: `Command received: ${command}. Processing in progress.`,
        command
    });
});


// ------------------------------------------------------------------
// ⭐ GAME STATE ENTRYPOINT
// Used to trigger events like "stream start/end" or "daily maintenance".
// ------------------------------------------------------------------

/**
 * Endpoint for triggering game state events (e.g., Stream Start/End, Daily Tick).
 */
router.post('/state-event', async (req: Request, res: Response) => {
    // ⚠️ IMPORTANT: We will implement authentication middleware here later!
    const { eventType, data } = req.body;
    
    if (!eventType) {
        return res.status(400).json({ error: 'Missing required field (eventType).' });
    }

    logger.info(`Received state event: ${eventType}`);

    // TODO: Implement logic to handle stream events and daily maintenance.
    
    return res.status(200).json({ 
        message: `State event received: ${eventType}.`,
        eventType 
    });
});


// -----------------------------------------------------------
// ⭐ EXECUTE CHALLENGE
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
// ⭐ SET CHALLENGE STATUS (ADMIN)
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


export default router;