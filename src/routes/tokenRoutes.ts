// src/routes/tokenRoutes.ts

import { Router, Request, Response } from 'express';
import { PlatformName } from '@prisma/client';
import { authenticateUser } from '../middleware/authMiddleware';
import { generateToken, validateDuration, verifyToken } from '../services/jwtService'; 
import { findOrCreateUser } from '../services/userService';
import { getCurrentDailySubmissionContext } from '../services/challengeService';
import logger from '../logger';

const router = Router();

/**
 * * Generates a secure, single-use URL/token for the web form challenge submission.
 * This is the entry point from the chat command (!challengesubmit).
 */
router.post('/submit-challenge', authenticateUser, async (req: Request, res: Response) => {
    // userId is the numeric DB ID, often typed as a string from middleware/JWT.
    const userId = req.userId;
    const { platformId, platformName, duration } = req.body;

    try {
        const tokenDuration = validateDuration(duration);
        
        // 🔑 CRITICAL: Initialize user record if it doesn't exist. 
        // This ensures the dailySubmissionCount and dailyChallengeResetAt fields are present
        // before we attempt to read them in getCurrentDailySubmissionContext.
        await findOrCreateUser({ 
            platformId, 
            platformName: platformName as PlatformName // Cast platformName to the Prisma Enum
        });

        // 1. Now safe to fetch the user's current daily submission context
        // 🛑 FIX: Pass the string 'userId' directly. Safe because the service function now accepts string|number.
        const context = await getCurrentDailySubmissionContext(userId);
        const { dailySubmissionCount, baseCostPerSession } = context;

        // Generate token
        const token = generateToken({ userId, platformId, platformName }, tokenDuration);
        
         // ⭐ Dynamic URL Construction
        const isLocalHost = req.hostname === 'localhost' || req.hostname === '127.0.0.1' || req.hostname === '0.0.0.0';
        
        const WEBFORM_BASE_URL = 
            isLocalHost
            ? `http://192.168.1.37:5500` 
            : process.env.WEBFORM_BASE_URL || "https://drummer-manager-website.vercel.app";

        const secureUrl = `${WEBFORM_BASE_URL}/challengesubmitform/index.html?token=${token}`;
        
        // 2. Update the response message and add context to details
        const formattedCost = baseCostPerSession.toLocaleString();
        
        // Construct the new message string for the chat command answer
        const chatResponse = 
            `Please use the following secure link to submit your challenge (valid for ${tokenDuration}). ` +
            `Your daily submission count is **${dailySubmissionCount}** (Base Cost: **${formattedCost}** NUMBERS). ` +
            `Link: ${secureUrl}`;

        // Return the secure URL and enriched context to the chat bot/client
        return res.status(200).json({
            message: chatResponse, 
            action: 'token_generation_success',
            details: {
                token: token,
                secureUrl: secureUrl,
                duration: tokenDuration,
                dailySubmissionCount: dailySubmissionCount,
                baseCostPerSession: baseCostPerSession 
            }
        });

    } catch (error) {
        logger.error('Token Generation Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        
        return res.status(500).json({
            message: 'Failed to generate secure submission token.',
            action: 'token_generation_failure',
            error: errorMessage,
        });
    }
});


/**
 * POST /api/v1/token/verify
 * * Verifies a token passed from the web form and returns the verified user identity.
 * This is called by the frontend (index.html) immediately upon receiving a URL with a token.
 */
router.post('/verify', async (req: Request, res: Response) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ message: 'Token is missing.', error: 'MISSING_TOKEN' });
    }

    try {
        const payload = verifyToken(token); // This throws if invalid or expired
        
        logger.info(`TOKEN Verification Success: User ${payload.platformId} verified.`, {
            platformId: payload.platformId,
            platformName: payload.platformName,
            action: 'token_verification_success'
        });

        // Return the verified, secure identity information
        return res.status(200).json({
            message: 'Token verified successfully.',
            platformId: payload.platformId,
            platformName: payload.platformName,
            // ⭐ Use optional chaining (?.) and check if payload.exp exists.
            expiresIn: payload.exp ? validateDuration(`${(payload.exp * 1000 - Date.now()) / 60000}m`) : 'N/A'
        });

    } catch (error) {
        logger.error('Token Verification Failed:', error);
        
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

export default router;