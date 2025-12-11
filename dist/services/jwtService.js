"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.validateDuration = validateDuration;
// src/services/jwtService.ts
// Centralizes all logic for generating, signing, and verifying the authentication tokens.
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../logger"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_for_dev_ONLY';
/**
 * Generates a signed JWT for secure user identity transfer.
 * @param payload The user identity payload.
 * @param duration The token expiry time (e.g., '21m', '1h'). Defaults to '21m'.
 */
function generateToken(payload, duration = '21m') {
    const options = {
        // ⭐ We keep the 'as any' cast because the local TypeScript environment 
        // strictly defines 'expiresIn' and rejects a plain 'string', forcing us to override 
        // the type check for dynamic duration strings (e.g., '21m').
        expiresIn: duration,
        algorithm: 'HS256',
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
}
/**
 * Verifies the JWT and returns the payload if valid. Throws error if invalid or expired.
 */
function verifyToken(token) {
    // The verify function will throw an error if the token is invalid or expired
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
// Validation logic for dynamic duration, used by tokenRoutes.ts
const MAX_TOKEN_DURATION_MINUTES = 210;
const DEFAULT_TOKEN_DURATION = '21m';
/**
 * Validates and converts the requested duration to a safe string format (e.g., '30m').
 */
function validateDuration(duration) {
    if (!duration)
        return DEFAULT_TOKEN_DURATION;
    // Matches e.g., '15m', '30M', '1h', '2H'
    const match = duration.match(/^(\d+)([mh])$/i);
    if (!match)
        return DEFAULT_TOKEN_DURATION;
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    // Convert everything to minutes for comparison
    let minutes = 0;
    if (unit === 'h') {
        minutes = value * 60;
    }
    else { // unit === 'm'
        minutes = value;
    }
    if (minutes > MAX_TOKEN_DURATION_MINUTES) {
        // Log a warning and cap at the maximum
        logger_1.default.warn(`Requested token duration (${duration}) exceeds max of ${MAX_TOKEN_DURATION_MINUTES}m. Capping.`);
        return `${MAX_TOKEN_DURATION_MINUTES}m`;
    }
    // Return the validated, safe duration string
    // We return the duration string in minutes for consistent API usage ('30m')
    return `${minutes}m`;
}
