// src/routes/tokenRoutes.ts

import { Router, Request, Response } from 'express';
import { validateDuration, verifyToken } from '../services/jwtService'; 
import logger from '../logger';
import { getCurrentDailySubmissionContext } from '../services/challengeService';
import { findOrCreateUser } from '../services/userService';
import { PlatformName } from '@prisma/client';
import { processExplorerAccessFee } from '../services/lumiaService';

const router = Router();


/**
 * POST /api/v1/token/verify-challengesubmitform
 * * Verifies a token passed from the web form and returns the verified user identity.
 * This is called by the frontend (index.html) immediately upon receiving a URL with a token.
 */
router.post('/verify-challengesubmitform', async (req: Request, res: Response) => {
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

        //  Resolve the external platformId to the internal User identity
        const user = await findOrCreateUser({
            platformId: payload.platformId,
            platformName: payload.platformName as PlatformName,
            username: payload.username
        });

        // Get the daily context (this handles the daily reset logic automatically)
        // AND pass the INTERNAL user.id (e.g., 21) to the context function
        const context = await getCurrentDailySubmissionContext(user.id);

        // Return the verified, secure identity information
        return res.status(200).json({
            message: 'Token verified successfully.',
            platformId: payload.platformId,
            platformName: payload.platformName,
            username: payload.username,
            dailySubmissionCount: context.dailySubmissionCount,
            serverCalculatedBaseCost: context.baseCostPerSession,
            expiresIn: payload.exp ? validateDuration(`${(payload.exp * 1000 - Date.now()) / 60000}m`) : 'N/A'
        });

    } catch (error) {
        logger.error('Token Verification Failed:', error);
        
        if (error instanceof Error) {
            let message = 'Authentication failed. Please get a new token.';
            let isAuthError = false;

            if (error.name === 'TokenExpiredError') {
                // Token Expired Error
                message = 'Authentication failed. Your secure link has expired. Please run the chat command again to generate a new link.';
                isAuthError = true;
            } else if (error.name === 'JsonWebTokenError') {
                // Invalid Signature or Malformed Token Error
                message = 'Authentication failed. Your secure link is invalid or malformed. Please run the chat command again to generate a new link.';
                isAuthError = true;
            }

            if (isAuthError) {
                 return res.status(401).json({ 
                     message: message, // Use the specific message
                     action: 'jwt_auth_failure',
                     error: error.message
                 });
            }
        }
        
        // Handle all other errors (e.g., server issues)
        return res.status(500).json({
            message: 'Failed to verify secure submission token due to a server error.',
            action: 'token_verification_failure',
            error: error instanceof Error ? error.message : 'Unknown server error.',
        });
    }
});



/**
 * POST /api/v1/token/verify-explorer
 * Specific for Explorer access: Verifies identity AND processes the access fee.
 */
router.post('/verify-explorer', async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is missing.', error: 'MISSING_TOKEN' });

    try {
        const payload = verifyToken(token);
        const user = await findOrCreateUser({
            platformId: payload.platformId,
            platformName: payload.platformName as PlatformName,
            username: payload.username
        });

        const newAuthoritativeBalance = await processExplorerAccessFee(payload.platformId);
        logger.info(`EXPLORER Access Success: User ${payload.platformId} verified.`);

        return res.status(200).json({
            message: 'Explorer access granted.',
            platformId: payload.platformId,
            platformName: payload.platformName,
            username: payload.username,
            remainingBalance: newAuthoritativeBalance,
            expiresIn: payload.exp ? validateDuration(`${(payload.exp * 1000 - Date.now()) / 60000}m`) : 'N/A'
        });

    } catch (error) {
        logger.error('Explorer Verification Failed:', error);
        // Utilisation de la logique détaillée pour l'expiration
        if (error instanceof Error && (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')) {
            const message = error.name === 'TokenExpiredError' 
                ? 'Authentication failed. Your secure link has expired.' 
                : 'Authentication failed. Your secure link is invalid.';
            return res.status(401).json({ message, action: 'jwt_auth_failure', error: error.message });
        }
        return res.status(500).json({ message: 'Server error during explorer verification.', error: error instanceof Error ? error.message : 'Unknown' });
    }
});

export default router;