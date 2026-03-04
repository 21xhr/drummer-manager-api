// src/services/jwtService.ts
// Centralizes all logic for generating, signing, and verifying the authentication tokens.
import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken'; 
import logger from '../logger'; 
import { MAX_TOKEN_DURATION_MINUTES } from '../config/gameConfig';
import prisma from '../prisma';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_fallback_secret_for_dev_ONLY';
// Note: Security risk of the fallback = None (only happens during broken local dev, never in Prod as Vercel has the JWT_SECRET).

interface TokenPayload extends JwtPayload {
    userId: number;
    platformId: string;
    platformName: string;
    username: string;
}

/**
 * Generates a signed JWT for secure user identity transfer.
 * @param payload The user identity payload.
 * @param duration The token expiry time (e.g., '21m', '1h'). Defaults to '21m'.
 */
export function generateToken(payload: TokenPayload, duration: string = '21m'): string {
    const options: SignOptions = {
        // We keep the 'as any' cast because the local TypeScript environment 
        // strictly defines 'expiresIn' and rejects a plain 'string', forcing us to override 
        // the type check for dynamic duration strings (e.g., '21m').
        expiresIn: duration as any, 
        algorithm: 'HS256', 
    };
    
    return jwt.sign(payload, JWT_SECRET, options);
}







/**
 * Verifies a JWT and returns the decoded payload.
 * First checks the static token whitelist, then falls back to normal JWT verification.
 * @param token The token string to verify.
 * @returns The decoded token payload if valid.
 * @throws An error if the token is invalid or expired.
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
    try {
        const dbToken = await prisma.perennialToken.findUnique({
            where: { token, isActive: true },
            include: { 
                account: {
                    select: { username: true } 
                }
            }
        });

        if (dbToken && dbToken.account) {
            logger.info(`Auth: Perennial token [${token}] used by UserID: ${dbToken.userId}`);
            return {
                userId: dbToken.userId,
                platformId: dbToken.platformId,
                platformName: dbToken.platformName as any,
                username: dbToken.account.username || "Demo User", 
            };
        }
    } catch (dbError) {
        logger.error("Database error during token verification:", dbError);
    }

    // Standard JWT check
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}







// Validation logic for dynamic duration, used by tokenRoutes.ts
const DEFAULT_TOKEN_DURATION = '21m'; // Keep this one local as it's a default, not a rule. 

/**
 * Validates and converts the requested duration to a safe string format (e.g., '30m').
 */
export function validateDuration(duration: string | undefined): string {
    if (!duration) return DEFAULT_TOKEN_DURATION;

    // Matches e.g., '15m', '30M', '1h', '2H'
    const match = duration.match(/^(\d+)([mh])$/i); 
    if (!match) return DEFAULT_TOKEN_DURATION;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    // Convert everything to minutes for comparison
    let minutes = 0;
    if (unit === 'h') {
        minutes = value * 60;
    } else { // unit === 'm'
        minutes = value;
    }

    if (minutes > MAX_TOKEN_DURATION_MINUTES) {
        // Log a warning and cap at the maximum
        logger.warn(`Requested token duration (${duration}) exceeds max of ${MAX_TOKEN_DURATION_MINUTES}m. Capping.`);
        return `${MAX_TOKEN_DURATION_MINUTES}m`;
    }
    
    // Return the validated, safe duration string
    // We return the duration string in minutes for consistent API usage ('30m')
    return `${minutes}m`;
}