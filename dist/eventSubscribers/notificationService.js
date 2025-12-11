"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeNotificationService = initializeNotificationService;
const eventService_1 = require("../services/eventService");
const logger_1 = __importDefault(require("../logger"));
// NOTE: In a real-world scenario, you would import a WebSocket Manager here.
// Example: import { WebSocketManager } from '../webSocketManager';
// --- Subscriber Handlers ---
/**
 * Handles the event when a new challenge is proposed and paid for.
 */
const handleChallengeSubmitted = (challenge) => {
    logger_1.default.info(`[NOTIFY] New Challenge Submitted: #${challenge.challengeId}`);
    // ACTION 1: Update UI/Client State (Crucial for real-time leaderboards)
    // TODO: WebSocketManager.broadcast({ event: 'CHALLENGE_SUBMITTED', payload: challenge });
    // ACTION 2: Send Chat Notification
    // TODO: Send a Twitch/Lumia chat message: "A new Challenge has been submitted and is ACTIVE!"
};
/**
 * Handles the event when a player pays the cost to dig out an ARCHIVED challenge.
 */
const handleChallengeDiggedOut = (challenge) => {
    logger_1.default.info(`[NOTIFY] Challenge Digged Out: #${challenge.challengeId}`);
    // ACTION 1: Update UI/Client State (The challenge moves from Archived to Active list)
    // TODO: WebSocketManager.broadcast({ event: 'CHALLENGE_ACTIVATED', payload: challenge });
    // ACTION 2: Send Chat Notification
    // TODO: Send a prominent chat message: "Challenge #XX has been REVIVED by [User]!"
};
/**
 * Handles the event when a challenge is manually launched by the Game Master.
 */
const handleChallengeExecuted = (challenge) => {
    logger_1.default.info(`[NOTIFY] Challenge Executing: #${challenge.challengeId}`);
    // ACTION 1: Update UI/Client State (Move challenge to 'Executing' display)
    // TODO: WebSocketManager.broadcast({ event: 'CHALLENGE_EXECUTING', payload: challenge });
    // ACTION 2: Send Chat Notification
    // TODO: Send a prominent chat message: "The Streamer has just started: Challenge #${challenge.challengeId}!"
};
/**
 * Handles the event when an executing challenge ticks to the next session count.
 */
const handleSessionTicked = (challenge) => {
    logger_1.default.info(`[NOTIFY] Session Ticked: #${challenge.challengeId} (Session ${challenge.currentSessionCount + 1})`);
    // ACTION 1: Update UI/Client State (Update session progress bar)
    // TODO: WebSocketManager.broadcast({ event: 'SESSION_PROGRESS', payload: { id: challenge.challengeId, count: challenge.currentSessionCount + 1 } });
    // ACTION 2: Send a less frequent, internal log or mini-notification
};
/**
 * Handles the event when a challenge is naturally completed.
 */
const handleChallengeCompleted = (challenge) => {
    logger_1.default.warn(`[NOTIFY] Challenge Completed: #${challenge.challengeId}`);
    // ACTION 1: Update UI/Client State (Remove from Active list, show completion celebration)
    // TODO: WebSocketManager.broadcast({ event: 'CHALLENGE_COMPLETED', payload: challenge });
    // ACTION 2: Send major Chat Notification
    // TODO: Send a HUGE chat message: "🎉 CONGRATULATIONS! Challenge #${challenge.challengeId} is FINISHED!"
};
/**
 * Handles the event when the author removes their challenge (with potential refunds).
 */
const handleChallengeRemovedByAuthor = (challenge) => {
    logger_1.default.warn(`[NOTIFY] Author Removed Challenge: #${challenge.challengeId}`);
    // ACTION 1: Update UI/Client State (Remove from all active lists)
    // TODO: WebSocketManager.broadcast({ event: 'CHALLENGE_REMOVED', payload: challenge });
    // ACTION 2: Send a public announcement about the removal/refund distribution
    // TODO: Chat message: "Challenge #XX removed by its author. Refunds are being processed."
};
/**
 * Handles the event when the GM uses the administrative override to set a final status.
 */
const handleGMStatusChange = (challenge) => {
    logger_1.default.warn(`[NOTIFY] GM OVERRIDE: Challenge #${challenge.challengeId} status is now ${challenge.status}.`);
    // ACTION 1: Update UI/Client State
    // The client needs to handle this status change (e.g., removing from list, if REMOVED).
    // TODO: WebSocketManager.broadcast({ event: 'CHALLENGE_STATUS_UPDATE', payload: challenge });
    // ACTION 2: Internal Audit Log
};
// --- Initialization ---
/**
 * Initializes all Notification Service subscribers. This should be called once
 * during application startup.
 */
function initializeNotificationService() {
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.CHALLENGE_SUBMITTED, handleChallengeSubmitted);
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.CHALLENGE_DIGGED_OUT, handleChallengeDiggedOut);
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.CHALLENGE_EXECUTED, handleChallengeExecuted);
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.SESSION_TICKED, handleSessionTicked);
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.CHALLENGE_COMPLETED, handleChallengeCompleted);
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.CHALLENGE_REMOVED_BY_AUTHOR, handleChallengeRemovedByAuthor);
    // Subscribe the same handler to multiple GM override events
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.CHALLENGE_REMOVED, handleGMStatusChange);
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.CHALLENGE_ACTIVATED_BY_GM, handleGMStatusChange);
    logger_1.default.info('[Event Subscriptions] Notification Service initialized and listening to challenge events.');
}
