"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gamemasterRoutes.ts
/**
 * routes the core command through dispatchCommand and handles the admin endpoints
 * (/challenges/execute, /challenge/:challengeId/status) using your authenticateGameMaster middleware.
 * This is the correct entry point for all chat commands.
 */
const express_1 = require("express");
const client_1 = require("@prisma/client");
const challengeService = __importStar(require("../services/challengeService"));
const logger_1 = __importDefault(require("../logger")); // Winston Logger
const routeUtils_1 = require("../utils/routeUtils");
const authMiddleware_1 = require("../middleware/authMiddleware");
const commandDispatcher_1 = require("../utils/commandDispatcher");
const router = (0, express_1.Router)();
// ------------------------------------------------------------------
// ⭐ CORE COMMAND ENTRYPOINT
// The API endpoint that receives commands and data from the external system (e.g., Lumia Stream).
// ------------------------------------------------------------------
/**
 * Handles all game commands sent by the external bot/loyalty system.
 * The request body is expected to contain all necessary context: user, platform, command.
 */
router.post('/command', async (req, res) => {
    // ⚠️ IMPORTANT: We will implement authentication middleware here later!
    const { command, user, platform, args } = req.body;
    if (!command || !user || !platform) {
        logger_1.default.error(`Invalid command request: missing context.`, req.body);
        return res.status(400).json({ error: 'Missing required fields (command, user, platform).' });
    }
    // CORE CHANGE: Call the central dispatcher function
    // The dispatcher handles validation, user lookup, and routing the logic.
    const result = await (0, commandDispatcher_1.dispatchCommand)({
        command,
        user,
        platform,
        args: args || null, // Pass args, ensuring it's null if undefined
    }, req.hostname);
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
router.post('/state-event', async (req, res) => {
    // ⚠️ IMPORTANT: We will implement authentication middleware here later!
    const { eventType, data } = req.body;
    if (!eventType) {
        return res.status(400).json({ error: 'Missing required field (eventType).' });
    }
    logger_1.default.info(`Received state event: ${eventType}`);
    // TODO: Implement logic to handle stream events and daily maintenance.
    return res.status(200).json({
        message: `State event received: ${eventType}.`,
        eventType
    });
});
// -----------------------------------------------------------
// ⭐ EXECUTE CHALLENGE
// -----------------------------------------------------------
router.post('/challenges/execute', authMiddleware_1.authenticateGameMaster, async (req, res) => {
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
        let responseMessage;
        let responseAction;
        const messageSuffix = wasPreviousChallengeStopped
            ? ' The previous challenge session was finalized.'
            : ' No previous challenge was active.';
        if (executingChallenge.isExecuting) {
            // Case 1: Successful execution/rollover.
            responseMessage = `✅ EXECUTION SUCCESS. Challenge #${executingChallenge.challengeId} is now **EXECUTING** (Session ${executingChallenge.currentSessionCount}/${executingChallenge.totalSessions}).${messageSuffix}`;
            responseAction = 'challenge_executed';
            // The missing closing brace was here.
        }
        else if (executingChallenge.status === client_1.ChallengeStatus.COMPLETED) {
            // Case 2: The challenge we requested to execute was returned as COMPLETED.
            responseMessage = `⚠️ EXECUTION WARNING: Challenge #${executingChallenge.challengeId} immediately returned **COMPLETED** upon execution request (Session ${executingChallenge.currentSessionCount}/${executingChallenge.totalSessions}). Check challenge setup.`;
            responseAction = 'challenge_execution_warning';
        }
        else {
            // Case 3: The challenge couldn't be executed for other reasons.
            responseMessage = `❌ EXECUTION FAILED: Challenge #${executingChallenge.challengeId} could not be set to execute. Status: ${executingChallenge.status}.`;
            responseAction = 'challenge_execute_failure';
        }
        // Determine the core action for the log
        let logActionPhrase;
        if (wasPreviousChallengeStopped) {
            // A previous challenge was finalized (finished) before the new one started.
            logActionPhrase = 'Finished previous challenge and launched/re-launched';
        }
        else {
            // No previous challenge was running, this is purely a launch/re-launch.
            logActionPhrase = 'Launched/re-launched';
        }
        // AUDIT LOG (Success) - Use the determined phrase
        logger_1.default.info(`EXECUTE Success: ${logActionPhrase} Challenge #${executingChallenge.challengeId} by Admin User ${authorUserId}. Status: ${executingChallenge.status}`, {
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
    }
    catch (error) {
        logger_1.default.error('Execute Challenge Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
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
router.put('/challenge/:challengeId/status', authMiddleware_1.authenticateGameMaster, async (req, res) => {
    const challengeId = parseInt(req.params.challengeId, 10);
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: "Missing 'status' in request body." });
    }
    if (challengeId === undefined || isNaN(challengeId)) {
        return res.status(400).json({ message: "Missing or invalid challengeId parameter." });
    }
    const newStatus = status.toUpperCase();
    try {
        const updatedChallenge = await challengeService.setChallengeStatusByAdmin(challengeId, newStatus);
        return res.status(200).json({
            message: `Challenge #${challengeId} status successfully set to ${newStatus} by the Game Master.`,
            action: 'gm_status_update_success',
            challenge: updatedChallenge
        });
    }
    catch (error) {
        logger_1.default.error(`GM Status Update Error for #${challengeId}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
        return res.status(status).json({
            message: errorMessage,
            action: 'gm_status_update_failure',
            error: errorMessage,
        });
    }
});
exports.default = router;
