// src/middleware/authMiddleware.ts
/** * This is the authentication layer for API endpoints (e.g., /api/v1/user/submit). 
 * It establishes req.userId for the Express route handler. 
 * It's a completely separate flow from the chat dispatcher which justifies why findOrCreateUser use does not constitute redundancy.
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
    // Destructure the required fields directly from the expected structure.
    const platformId = req.body.user?.userId;
    const username = req.body.user?.username || platformId; // Use username for display, fall back to ID
    const platformName = req.body.platform?.name; 

    if (!platformId || !platformName) {
        return res.status(400).json({ error: "Missing platformId or platformName in request body." });
    }

    try {
        // 1. Find or Create the central User and the corresponding Account record.
        // The refactored findOrCreateUser handles the new schema correctly.
        const user = await findOrCreateUser({ 
            platformId, 
            platformName: platformName as PlatformName,
            username: username // Pass a fallback value to satisfy the upsert logic
        });
        
        // 2. Attach identity to the request object.
        req.userId = user.id; 
        // 3. CRITICAL: Use the original platform identity from the request body,
        // as the 'user' object no longer contains these fields.
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
            // User is authenticated and is the Game Master.
            next();
        } else {
            // User is authenticated but is NOT the Game Master.
            return res.status(403).json({ 
                message: "Access Denied. This endpoint is restricted to the administrator (User ID 21).",
                action: 'authorization_failure'
            });
        }
    });
};