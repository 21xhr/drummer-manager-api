import { Router, Request, Response } from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { generateToken, validateDuration, verifyToken } from '../services/jwtService'; // 👈 Ensure verifyToken is imported
import logger from '../logger';

const router = Router();

/**
c * * Generates a secure, single-use URL/token for the web form challenge submission.
 * Accepts optional 'duration' (e.g., '21m') to extend validity up to 210 minutes.
 * This is the entry point from the chat command (!challengesubmit).
 */
router.post('/submit-challenge', authenticateUser, async (req: Request, res: Response) => {
    const userId = req.userId;
    const { platformId, platformName, duration } = req.body; // duration is optional

    try {
        const tokenDuration = validateDuration(duration);
        const token = generateToken({ userId, platformId, platformName }, tokenDuration);
        
        // ⭐ NEW LOGIC: Dynamic URL Construction
        const isLocalHost = req.hostname === 'localhost' || req.hostname === '127.0.0.1' || req.hostname === '0.0.0.0';
        
        // Use a fixed port 5500 for the frontend, and 192.168.1.37 for the host if not localhost
        const WEBFORM_BASE_URL = 
            isLocalHost
            ? `http://192.168.1.37:5500` // Use your fixed local IP for the link
            : process.env.WEBFORM_BASE_URL || "https://drummer-manager-website.vercel.app";

        // Fix the typo in the path: "challengessubmitform" -> "challengesubmitform"
        const secureUrl = `${WEBFORM_BASE_URL}/challengesubmitform/index.html?token=${token}`;
        
        // Log, etc.

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


/**
 * POST /api/v1/token/verify 👈 NEW CRITICAL ENDPOINT
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
            // ⭐ FIX IMPLEMENTATION: Use optional chaining (?.) and check if payload.exp exists.
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