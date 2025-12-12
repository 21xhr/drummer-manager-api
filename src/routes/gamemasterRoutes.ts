// src/routes/gamemasterRoutes.ts
/** 
 * routes the core command through dispatchCommand and handles the admin endpoints 
 * (/challenges/execute, /challenge/:challengeId/status) using your authenticateGameMaster middleware. 
 * This is the correct entry point for all chat commands. 
 */
import { Router, Request, Response } from 'express';
import { ChallengeStatus } from '@prisma/client';
import * as challengeService from '../services/challengeService';
import logger from '../logger'; // Winston Logger
import { getServiceErrorStatus } from '../utils/routeUtils';
import { authenticateUser, authenticateGameMaster } from '../middleware/authMiddleware';
import { dispatchCommand } from '../utils/commandDispatcher';

// Force TypeScript to load your custom Request types.
// We import a non-existent value, but the import statement forces the module's types to be recognized.
import {} from '../types/express.d'; // Note: Omit the .ts or .d.ts extension

const router = Router();


// ------------------------------------------------------------------
// ⭐ CORE COMMAND ENTRYPOINT
// The API endpoint that receives commands and data from the external system (e.g., Lumia Stream).
// ------------------------------------------------------------------

/**
 * Handles all game commands sent by the external bot/loyalty system.
 * The request body is expected to contain all necessary context: user, platform, command.
 * NOTE: authenticateUser middleware handles user validation and persistence.
 */
router.post('/command', authenticateUser, async (req: Request, res: Response) => {
    // Auth is handled by authenticateUser middleware.
    
    const { 
        command, 
        user, // Fields guaranteed to exist by authenticateUser
        platform, // Fields guaranteed to exist by authenticateUser
        args
    } = req.body;

    if (!command) {
        logger.error(`Invalid command request: missing command.`, req.body);
        return res.status(400).json({ error: 'Missing required field (command).' });
    }

    // Call the central dispatcher function
    // The dispatcher handles validation, user lookup, and routing the logic.
    const result = await dispatchCommand(
        req.userId,
        {
            command,
            user,
            platform,
            args: args || null, // Pass args, ensuring it's null if undefined
        }, 
        req.hostname
    );

    // Send the structured result back to the client
    return res.status(200).json(result); 
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
        const result = await challengeService.processExecuteChallenge(parseInt(challengeId));
        const executingChallenge = result.executingChallenge;
        const wasPreviousChallengeStopped = result.wasPreviousChallengeStopped;
        
        // Declare these variables outside the if/else blocks
        let responseMessage: string;
        let responseAction: string;
        
        const messageSuffix = wasPreviousChallengeStopped 
            ? ' The previous challenge session was finalized.'
            : ' No previous challenge was active.'; 

        if (executingChallenge.isExecuting) {
            // Case 1: Successful execution/rollover.
            responseMessage = `✅ EXECUTION SUCCESS. Challenge #${executingChallenge.challengeId} is now **EXECUTING** (Session ${executingChallenge.currentSessionCount}/${executingChallenge.totalSessions}).${messageSuffix}`;
            responseAction = 'challenge_executed';    
        
        // The missing closing brace was here.
        } else if (executingChallenge.status === ChallengeStatus.COMPLETED) {
            // Case 2: The challenge we requested to execute was returned as COMPLETED.
            responseMessage = `⚠️ EXECUTION WARNING: Challenge #${executingChallenge.challengeId} immediately returned **COMPLETED** upon execution request (Session ${executingChallenge.currentSessionCount}/${executingChallenge.totalSessions}). Check challenge setup.`;
            responseAction = 'challenge_execution_warning';
            
        } else {
             // Case 3: The challenge couldn't be executed for other reasons.
             responseMessage = `❌ EXECUTION FAILED: Challenge #${executingChallenge.challengeId} could not be set to execute. Status: ${executingChallenge.status}.`;
             responseAction = 'challenge_execute_failure';
        }
        
        // Determine the core action for the log
        let logActionPhrase: string;
        
        if (wasPreviousChallengeStopped) {
            // A previous challenge was finalized (finished) before the new one started.
            logActionPhrase = 'Finished previous challenge and launched/re-launched';
        } else {
            // No previous challenge was running, this is purely a launch/re-launch.
            logActionPhrase = 'Launched/re-launched';
        }
        
        // AUDIT LOG (Success) - Use the determined phrase
        logger.info(`EXECUTE Success: ${logActionPhrase} Challenge #${executingChallenge.challengeId} by Admin User ${authorUserId}. Status: ${executingChallenge.status}`, {
            challengeId: executingChallenge.challengeId,
            proposerUserId: executingChallenge.proposerUserId,
            platformId: req.platformId,
            action: responseAction 
        });

        // RETURN RESPONSE
        return res.status(200).json({
            message: responseMessage,
            action: responseAction,
            data: {
                challengeId: executingChallenge.challengeId,
                status: executingChallenge.status,
                isExecuting: executingChallenge.isExecuting,
                currentSessionCount: executingChallenge.currentSessionCount,
                totalSessions: executingChallenge.totalSessions,
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