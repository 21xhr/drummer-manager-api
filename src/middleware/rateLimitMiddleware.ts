// src/middleware/rateLimitMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import { commandRatelimit } from '../services/upstashService'; // Import the pre-initialized limiter

/**
 * Middleware to enforce rate limiting based on the user's database ID (req.userId).
 * This protects against a single user spamming commands.
 */
export const rateLimitUserCommands = async (req: Request, res: Response, next: NextFunction) => {
    // 1. If Redis/Ratelimit failed to initialize (e.g., missing ENV), skip check to stay online.
    if (!commandRatelimit) {
        return next();
    }
    
    // 2. req.userId is guaranteed to exist by the preceding authenticateUser middleware.
    const userId = req.userId; 

    if (!userId) {
        // This should not happen if authenticateUser runs first, but handles the edge case.
        logger.error("Rate limit failed: Missing req.userId. Check middleware order.");
        return res.status(500).json({ error: "Internal server error." });
    }

    try {
        // Use the database User ID as the unique identifier for rate limiting
        const key = userId.toString(); 
        
        const { success, limit, remaining, reset } = await commandRatelimit.limit(key);

        if (!success) {
            const retryAfter = Math.ceil((reset - Date.now()) / 1000);
            
            logger.warn(`Rate limit exceeded for User ID: ${userId}`, {
                limit,
                remaining,
                retryAfter,
                endpoint: req.originalUrl
            });
            
            return res.status(429).json({
                error: "Too Many Requests",
                message: `You are sending commands too quickly. Try again in ${retryAfter} seconds.`,
                limit,
                remaining,
                reset
            });
        }

        next();

    } catch (error) {
        // Fallback: If Redis is down, allow the request so the app stays functional.
        logger.error("Error during rate limiting check, allowing request to pass:", error);
        next(); 
    }
};