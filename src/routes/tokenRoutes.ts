// src/routes/tokenRoutes.ts
import { Router } from 'express';
import { authenticateUser } from './userRoutes'; // Note: We need to assume the middleware is exported from userRoutes
import { generateToken, validateDuration } from '../services/jwtService'; 
import logger from '../logger';

const router = Router();

/**
 * POST /api/v1/token/submit-challenge
 * * Generates a secure, single-use URL/token for the web form challenge submission.
 * Accepts optional 'duration' (e.g., '21m') to extend validity up to 210 minutes.
 * This is the entry point from the chat command (!challengesubmit).
 */
router.post('/submit-challenge', authenticateUser, async (req: any, res) => {
    const userId = req.userId;
    const { platformId, platformName, duration } = req.body; // duration is optional

    try {
        const tokenDuration = validateDuration(duration); // Validates and caps duration
        const token = generateToken({ userId, platformId, platformName }, tokenDuration);
        
        // Use an environment variable for the frontend URL
        const WEBFORM_BASE_URL = process.env.WEBFORM_BASE_URL || "https://drummer-manager-website.vercel.app";
        const secureUrl = `${WEBFORM_BASE_URL}/challenge/submit?token=${token}`;

        logger.info(`TOKEN Success: Token generated for User ${userId}. Expiry: ${tokenDuration}`, {
            userId: userId,
            platformId: platformId,
            action: 'token_generation_success',
            duration: tokenDuration
        });

        // Return the secure URL to the chat bot/client
        return res.status(200).json({
            message: `Please use the following secure link to submit your challenge (valid for ${tokenDuration}): ${secureUrl}`,
            action: 'token_generation_success',
            details: {
                token: token,
                secureUrl: secureUrl,
                duration: tokenDuration
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

export default router;