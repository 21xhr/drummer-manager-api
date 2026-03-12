// src/middleware/authMiddleware.ts
/**
 * Authentication and identity-resolution middleware for API routes.
 * Resolves the external platform identity (platformId + platformName)
 * into the internal central userId and attaches it to req.userId.
 *
 * This is not redundant with dispatchCommand:
 * middleware handles identity resolution and request context,
 * while the dispatcher only routes already-authenticated commands.
 */
import { Request, Response, NextFunction } from 'express';
import { findOrCreateUser } from '../services/userService'; 
import logger from '../logger';
import { PlatformName } from '@prisma/client';

// The ID reserved for the Game Master (Drummer, 21)
const ADMIN_USER_ID = 21; 

// Middleware to standardize user input and ensure user registration
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    // These values are guaranteed to be the external identity the user used.
    const { user, platform } = req.body;
    const platformId = user?.platformId;
    const username = user?.username || platformId;
    const platformName = platform?.name;

    if (!platformId || !platformName) {
        return res.status(400).json({ error: "Missing platformId or platformName in request body." });
    }

    try {
        // 1. Find or Create the central User and the corresponding Account record.
        const centralUser = await findOrCreateUser({ 
            platformId, 
            platformName: platformName as PlatformName,
            username: username  // guaranteed non-null (fallback to platformId if username missing)
        });
        
        // 2. Attach identity to the request object.
        req.userId = centralUser.id; // centralUserId (internal DMG identity)
        // 3. Use the original platform identity from the request body
        req.platformId = platformId; 
        req.platformName = platformName as PlatformName; 
        
        next();
    } catch (error) {
        logger.error('User Authentication Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({ 
            message: 'Failed to find or create user.',
            error: errorMessage,
        });
    }
};


/**
 * Middleware to authenticate the user and enforce that the authenticated user is the Game Master.
 * Requires the standard authentication to run first.
 */
export const authenticateGameMaster = (req: Request, res: Response, next: NextFunction) => {
    // 1. Run standard user authentication first to populate req.userId
    // We pass a function that is called *only* if authenticateUser succeeds.
    authenticateUser(req, res, () => {
        // 2. Enforce Game Master ID check
        if (req.userId === ADMIN_USER_ID) {
            next();
        } else {
            return res.status(403).json({ 
                message: "Access Denied. This endpoint is restricted to the administrator (User ID 21).",
                action: 'authorization_failure'
            });
        }
    });
};