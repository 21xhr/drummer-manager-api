"use strict";
// src/routes/tokenRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtService_1 = require("../services/jwtService");
const logger_1 = __importDefault(require("../logger"));
const router = (0, express_1.Router)();
/**
 * POST /api/v1/token/verify
 * * Verifies a token passed from the web form and returns the verified user identity.
 * This is called by the frontend (index.html) immediately upon receiving a URL with a token.
 */
router.post('/verify', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is missing.', error: 'MISSING_TOKEN' });
    }
    try {
        const payload = (0, jwtService_1.verifyToken)(token); // This throws if invalid or expired
        logger_1.default.info(`TOKEN Verification Success: User ${payload.platformId} verified.`, {
            platformId: payload.platformId,
            platformName: payload.platformName,
            action: 'token_verification_success'
        });
        // Return the verified, secure identity information
        return res.status(200).json({
            message: 'Token verified successfully.',
            platformId: payload.platformId,
            platformName: payload.platformName,
            username: payload.username,
            // ⭐ Use optional chaining (?.) and check if payload.exp exists.
            expiresIn: payload.exp ? (0, jwtService_1.validateDuration)(`${(payload.exp * 1000 - Date.now()) / 60000}m`) : 'N/A'
        });
    }
    catch (error) {
        logger_1.default.error('Token Verification Failed:', error);
        // Check for common JWT errors to return a specific 401 response
        if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
            return res.status(401).json({
                message: 'Authentication failed. Token is invalid or expired. Please get a new token.',
                action: 'jwt_auth_failure',
                error: error.message
            });
        }
        return res.status(500).json({
            message: 'Failed to verify secure submission token due to a server error.',
            action: 'token_verification_failure',
            error: error instanceof Error ? error.message : 'Unknown server error.',
        });
    }
});
exports.default = router;
