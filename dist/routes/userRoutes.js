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
// src/routes/userRoutes.ts
const express_1 = require("express");
const challengeService = __importStar(require("../services/challengeService"));
const logger_1 = __importDefault(require("../logger")); // Winston Logger
const jwtService_1 = require("../services/jwtService");
const routeUtils_1 = require("../utils/routeUtils");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// -----------------------------------------------------------
// 1. CHALLENGE SUBMISSION (LEGACY/CHAT) - CONSISTENCY UPDATE
// -----------------------------------------------------------
router.post('/submit', authMiddleware_1.authenticateUser, async (req, res) => {
    // NOTE: This legacy route remains for chat-only submission requests but should be deprecated 
    // in favor of the /submit/web flow (which uses a separate token generation endpoint).
    // ⭐ UPDATE: Extract new cadence fields
    const { challengeText, totalSessions, durationType, sessionCadenceText, cadenceUnit } = req.body;
    const userId = req.userId;
    if (!challengeText || !totalSessions || !durationType) {
        return res.status(400).json({
            error: "Missing required fields: challengeText, totalSessions, or durationType."
        });
    }
    // ⭐ UPDATE: Cadence validation for recurring challenges
    if (durationType === 'RECURRING' && (!sessionCadenceText || !cadenceUnit)) {
        return res.status(400).json({
            error: "Both Session Cadence Text and Cadence Unit are required for Recurring challenges."
        });
    }
    const sessions = parseInt(totalSessions);
    if (isNaN(sessions) || sessions < 1) {
        return res.status(400).json({ error: "totalSessions must be a positive number." });
    }
    try {
        const { newChallenge, cost } = await challengeService.processChallengeSubmission(userId, challengeText, totalSessions, durationType, sessionCadenceText, cadenceUnit);
        // AUDIT LOG (Success) - ENHANCED DETAIL
        logger_1.default.info(`SUBMIT Success: #${newChallenge.challengeId} by User ${userId}`, {
            challengeId: newChallenge.challengeId,
            cost: cost,
            pushBaseCost: newChallenge.pushBaseCost,
            totalSessions: newChallenge.totalSessions,
            category: newChallenge.category,
            durationType: newChallenge.durationType,
            sessionCadenceText: newChallenge.sessionCadenceText,
            proposerUserId: userId,
            platformId: req.platformId,
            platformName: req.platformName,
            action: 'submission_success',
            cadence: `${newChallenge.cadenceRequiredCount} per ${newChallenge.cadenceUnit}`
        });
        // RETURN RESPONSE - ENHANCED DETAIL
        return res.status(200).json({
            message: `Challenge #${newChallenge.challengeId} submitted successfully for a cost of ${cost} NUMBERS.`,
            action: 'submission_success',
            details: {
                challengeId: newChallenge.challengeId,
                cost: cost,
                pushBaseCost: newChallenge.pushBaseCost,
                challengeText: newChallenge.challengeText,
                totalSessions: newChallenge.totalSessions,
                category: newChallenge.category,
                durationType: newChallenge.durationType,
                sessionCadenceText: newChallenge.sessionCadenceText,
                status: newChallenge.status
            }
        });
    }
    catch (error) {
        logger_1.default.error('Challenge Submission Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
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
router.post('/submit/web', async (req, res) => {
    // Expected inputs from the web form: token, form fields
    const { token, challengeText, totalSessions, durationType, sessionCadenceText, cadenceUnit, cost: clientCostEstimate } = req.body;
    let userId;
    let platformId;
    let platformName; // Declare platformName using the PlatformName enum type
    // 1. JWT Authentication and Identity Extraction
    try {
        if (!token) {
            return res.status(401).json({ error: "Missing authentication token." });
        }
        const payload = (0, jwtService_1.verifyToken)(token); // Throws if invalid/expired
        userId = payload.userId;
        platformId = payload.platformId;
        // ⭐ CRITICAL: Cast the verified string from the JWT payload
        // to the new Prisma Enum type before passing it to the service.
        // We ensure it is a valid PlatformName string from the enum.
        platformName = payload.platformName;
        // Note: Here, user record is guaranteed to exist
        // because the processSubmissionLinkGeneration (which runs after findOrCreateUser
        // via the dispatcher or middleware) created the JWT token.
        // We rely solely on the existing record linked to userId.
    }
    catch (error) {
        logger_1.default.error('JWT Validation Error:', error);
        // Add type guard to check 'error.name'
        if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
            return res.status(401).json({
                message: 'Authentication failed. Token is invalid or expired. Please get a new token.',
                action: 'jwt_auth_failure',
                error: error.message
            });
        }
        // Handle all other errors in the auth block
        return res.status(401).json({
            message: 'Authentication failed due to a server error.',
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
    // Cadence validation for recurring challenges
    if (durationType === 'RECURRING' && (!sessionCadenceText || !cadenceUnit)) {
        return res.status(400).json({ error: "Both Session Cadence Text and Cadence Unit are required for Recurring challenges." });
    }
    // Convert to integer and validate
    const sessions = parseInt(totalSessions);
    if (isNaN(sessions) || sessions < 1) {
        return res.status(400).json({ error: "totalSessions must be a positive number." });
    }
    // 3. Process Submission Transaction
    try {
        // CRITICAL: The service must now return the updated Account used for deduction.
        // We expect the return object to include 'updatedAccount'
        const { newChallenge, cost, updatedUser, updatedAccount } = await challengeService.processChallengeSubmission(userId, // Authenticated via JWT
        platformId, platformName, challengeText, sessions, durationType, sessionCadenceText, cadenceUnit);
        // AUDIT LOG (Success) - ENHANCED DETAIL
        logger_1.default.info(`SUBMIT Success: #${newChallenge.challengeId} by User ${userId}`, {
            challengeId: newChallenge.challengeId,
            cost: cost,
            pushBaseCost: newChallenge.pushBaseCost,
            totalSessions: newChallenge.totalSessions,
            category: newChallenge.category,
            durationType: newChallenge.durationType,
            sessionCadenceText: newChallenge.sessionCadenceText,
            proposerUserId: userId,
            platformId: platformId,
            platformName: platformName,
            action: 'submission_success',
            cadence: `${newChallenge.cadenceRequiredCount} per ${newChallenge.cadenceUnit}`
        });
        // RETURN RESPONSE - ENHANCED DETAIL
        return res.status(200).json({
            message: `Challenge #${newChallenge.challengeId} submitted successfully for a cost of ${cost} NUMBERS.`,
            action: 'submission_success',
            details: {
                cost: cost,
                newChallenge: {
                    challengeId: newChallenge.challengeId,
                    pushBaseCost: newChallenge.pushBaseCost,
                    challengeText: newChallenge.challengeText,
                    totalSessions: newChallenge.totalSessions,
                    category: newChallenge.category,
                    durationType: newChallenge.durationType,
                    sessionCadenceText: newChallenge.sessionCadenceText,
                    status: newChallenge.status,
                },
                userStats: {
                    currentBalance: updatedAccount.currentBalance,
                    dailySubmissionCount: updatedUser.dailySubmissionCount,
                    totalChallengesSubmitted: updatedUser.totalChallengesSubmitted,
                    totalNumbersSpent: updatedUser.totalNumbersSpent,
                }
            }
        });
    }
    catch (error) {
        logger_1.default.error('Challenge Submission Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
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
router.post('/push/quote', authMiddleware_1.authenticateUser, async (req, res) => {
    const { challengeId, quantity } = req.body;
    const userId = req.userId;
    if (challengeId === undefined || quantity === undefined || isNaN(parseInt(challengeId)) || isNaN(parseInt(quantity))) {
        return res.status(400).json({ error: "Missing or invalid challengeId or quantity." });
    }
    try {
        const { quoteId, quotedCost, challenge } = await challengeService.processPushQuote(userId, req.platformId, req.platformName, parseInt(challengeId), parseInt(quantity));
        // AUDIT LOG (Success)
        logger_1.default.info(`QUOTE Success: #${challenge.challengeId} for ${quantity} by User ${userId}`, {
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
    }
    catch (error) {
        logger_1.default.error('Push Quote Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
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
router.post('/push/confirm', authMiddleware_1.authenticateUser, async (req, res) => {
    const { quoteId } = req.body;
    const userId = req.userId;
    try {
        const { updatedChallenge, transactionCost, quantity } = await challengeService.processPushConfirm(userId, req.platformId, req.platformName, quoteId);
        // AUDIT LOG (Success)
        logger_1.default.info(`PUSH CONFIRM Success: ${quantity} pushes on #${updatedChallenge.challengeId} for User ${userId}`, {
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
    }
    catch (error) {
        logger_1.default.error('Push Confirmation Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
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
router.post('/digout', authMiddleware_1.authenticateUser, async (req, res) => {
    const { challengeId } = req.body;
    const userId = req.userId;
    if (challengeId === undefined || isNaN(parseInt(challengeId))) {
        return res.status(400).json({ error: "Missing or invalid challengeId." });
    }
    try {
        // ⭐ CRITICAL: The service must now return the updated Account used for deduction.
        // We expect the return object to include 'updatedAccount'
        const { updatedChallenge, updatedUser, updatedAccount, cost } = await challengeService.processDigout(userId, req.platformId, // Pass platform ID
        req.platformName, // Pass platform Name
        parseInt(challengeId));
        // AUDIT LOG (Success)
        logger_1.default.info(`DIGOUT Success: #${updatedChallenge.challengeId} cost ${cost} by User ${userId}`, {
            challengeId: updatedChallenge.challengeId,
            cost: cost,
            newBalance: updatedAccount.currentBalance, // <-- CRITICAL FIX: Read from updatedAccount
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
                newBalance: updatedAccount.currentBalance // <-- CRITICAL FIX: Read from updatedAccount
            }
        });
    }
    catch (error) {
        logger_1.default.error('Digout Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
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
router.post('/disrupt', authMiddleware_1.authenticateUser, async (req, res) => {
    const userId = req.userId; // AuthenticateUser middleware handles finding/creating the user
    try {
        // Calls the placeholder function created earlier
        const message = await challengeService.processDisrupt(userId, req.platformId, req.platformName);
        // AUDIT LOG (Success)
        logger_1.default.info(`DISRUPT Success: Cost 2100 by User ${userId}`, {
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
    }
    catch (error) {
        logger_1.default.error('Disrupt Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
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
        logger_1.default.info(`READ Success: Retrieved ${challenges.length} active challenges.`, {
            count: challenges.length,
            action: 'challenges_retrieved'
        });
        // RETURN RESPONSE
        return res.status(200).json({
            message: `${challenges.length} active challenges retrieved.`,
            action: 'challenges_retrieved',
            data: challenges
        });
    }
    catch (error) {
        logger_1.default.error('Get Active Challenges Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            message: 'Failed to retrieve active challenges due to a server error.',
            error: errorMessage,
        });
    }
});
// -----------------------------------------------------------
// REMOVE CHALLENGE
// -----------------------------------------------------------
router.post('/challenges/remove', authMiddleware_1.authenticateUser, async (req, res) => {
    const { challengeId, option } = req.body;
    const authorUserId = req.userId;
    // Map user input (A/B/C) to the internal RefundOption string
    const OPTION_MAP = {
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
        }
        else if (result.option === 'author_and_chest') { // Option B
            sinkMessage = `Your ${result.toAuthor} NUMBERS were refunded externally. The remaining ${result.toCommunityChest} NUMBERS were forfeited to the Community Chest.`;
        }
        else if (result.option === 'author_and_pushers') { // Option C
            sinkMessage = `The total refund of ${result.totalRefundsAmount} NUMBERS was directed back to you and the contributing Pushers (${result.refundsProcessed} successful).`;
        }
        // AUDIT LOG (Success)
        logger_1.default.info(`REMOVE Success: #${challengeId} removed by User ${authorUserId}. Funds sink: ${result.fundsSink}`, {
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
    }
    catch (error) {
        logger_1.default.error('Remove Challenge Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const status = (0, routeUtils_1.getServiceErrorStatus)(errorMessage);
        return res.status(status).json({
            message: status === 500 ? 'Challenge removal failed due to a server error.' : errorMessage,
            action: 'challenge_removal_failure',
            error: errorMessage,
        });
    }
});
exports.default = router;
