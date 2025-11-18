// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { findOrCreateUser } from '../services/userService'; 
import logger from '../logger';
import { PlatformName } from '@prisma/client'; // Keep this import!

// Middleware to standardize user input and ensure user registration
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { platformId, platformName } = req.body; 

    if (!platformId || !platformName) {
        return res.status(400).json({ error: "Missing platformId or platformName in request body." });
    }

    try {
        const user = await findOrCreateUser({ 
            platformId, 
            // The input type should be PlatformName for findOrCreateUser, 
            // casting the request body string to satisfy it.
            platformName: platformName as PlatformName 
        });
        
        req.userId = user.id; 
        req.platformId = user.platformId;
        
        // ⭐ FIX: Explicitly cast the user.platformName (which comes from the DB as the enum type)
        // to PlatformName to satisfy the requirement on req.platformName defined in express.d.ts.
        req.platformName = user.platformName as PlatformName; 
        
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