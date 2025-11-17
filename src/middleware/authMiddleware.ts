// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { findOrCreateUser } from '../services/userService'; 
import logger from '../logger';

// Middleware to standardize user input and ensure user registration
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { platformId, platformName } = req.body; // <-- This is the core logic

    if (!platformId || !platformName) {
        return res.status(400).json({ error: "Missing platformId or platformName in request body." });
    }

    try {
        const user = await findOrCreateUser({ platformId, platformName });
        req.userId = user.id; // <-- This is the core logic
        req.platformId = user.platformId;
        req.platformName = user.platformName;
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