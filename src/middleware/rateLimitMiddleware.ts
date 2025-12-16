// src/middleware/rateLimitMiddleware.ts

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

// --- Configuration ---
// NOTE: Ensure these are set in your .env or server environment
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REDIS_URL || !REDIS_TOKEN) {
    logger.warn("Upstash Redis credentials missing. Rate Limiting will be disabled.");
}

// 1. Initialize Redis
const redis = (REDIS_URL && REDIS_TOKEN) ? new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
}) : null;

// 2. Initialize Ratelimit
// Goal: Prevent a single user from spamming commands too rapidly (e.g., 2 requests per 5 seconds per User ID)
const commandRatelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(
      2,  // 2 attempts
      "5s" // per 5 seconds
  ), 
  prefix: "@ratelimit/user-cmd", // Unique key prefix
}) : null;

/**
 * Middleware to enforce rate limiting based on the user's database ID (req.userId).
 * This protects against a single user spamming commands, regardless of the client IP.
 */
export const rateLimitUserCommands = async (req: Request, res: Response, next: NextFunction) => {
    // If Redis/Ratelimit failed to initialize (e.g., missing ENV), skip rate limiting.
    if (!commandRatelimit) {
        return next();
    }
    
    // req.userId is guaranteed to exist by the preceding authenticateUser middleware.
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
            
            // Send 429 Too Many Requests response
            return res.status(429).json({
                error: "Too Many Requests",
                message: `You are sending commands too quickly. Try again in ${retryAfter} seconds.`,
                limit,
                remaining,
                reset
            });
        }

        // Rate limit passed - continue to the next middleware or route handler
        next();

    } catch (error) {
        // Log the error but allow the request to pass to prevent rate limiting from causing a service outage
        logger.error("Error during rate limiting check, allowing request to pass:", error);
        next(); 
    }
};