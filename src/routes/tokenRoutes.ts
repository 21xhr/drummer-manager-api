// src/routes/tokenRoutes.ts

import { Router, Request, Response } from 'express';
import { validateDuration, verifyToken } from '../services/jwtService'; 
import logger from '../logger';
import { getCurrentDailySubmissionContext } from '../services/challengeService';
import { findOrCreateUser } from '../services/userService';
import { PlatformName } from '@prisma/client';
import { processExplorerAccessFee } from '../services/lumiaService';
import prisma from '../prisma';


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
 * Specific for Explorer access: Verifies identity, checks merit status, and processes fees.
 */
router.post('/verify-explorer', async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is missing.' });

    try {
        const payload = verifyToken(token);
        
        // 1. Fetch user to check merit and last deduction
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, totalNumbersSpent: true, lastExplorerDeduction: true }
        });

        if (!user) throw new Error("User not found.");

        // 2. Determine Fee
        const hasMerit = user.totalNumbersSpent >= 2100;
        const fee = hasMerit ? 2.1 : 21;

        // 3. Check if 21 minutes have passed
        const twentyOneMinutesAgo = new Date(Date.now() - 21 * 60 * 1000);
        const needsPayment = !user.lastExplorerDeduction || user.lastExplorerDeduction < twentyOneMinutesAgo;

        if (needsPayment) {
            // This calls your Lumia service to actually take the money
            await processExplorerAccessFee(payload.platformId, fee); 
            
            // Update the timestamp so they aren't charged again for 21 mins
            await prisma.user.update({
                where: { id: user.id },
                data: { lastExplorerDeduction: new Date() }
            });
        }

        return res.status(200).json({
            message: 'Explorer access granted.',
            username: payload.username,
            platformName: payload.platformName,
            hasMerit: hasMerit
        });

    } catch (error) {
        logger.error('Explorer Verification Failed:', error);

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