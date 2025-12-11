"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateGameMaster = exports.authenticateUser = void 0;
const userService_1 = require("../services/userService");
const logger_1 = __importDefault(require("../logger"));
// The ID reserved for the Game Master (Drummer, 21)
const ADMIN_USER_ID = 21;
// Middleware to standardize user input and ensure user registration
const authenticateUser = async (req, res, next) => {
    // These values are guaranteed to be the external identity the user used.
    // Destructure the required fields directly from the expected structure.
    const platformId = req.body.user?.userId;
    const platformName = req.body.platform?.name; // Assuming platform context is now nested
    const username = req.body.user?.username || platformId; // Use username for display, fall back to ID
    if (!platformId || !platformName) {
        return res.status(400).json({ error: "Missing platformId or platformName in request body." });
    }
    try {
        // 1. Find or Create the central User and the corresponding Account record.
        // The refactored findOrCreateUser handles the new schema correctly.
        const user = await (0, userService_1.findOrCreateUser)({
            platformId,
            platformName: platformName,
            username: username // Pass a fallback value to satisfy the upsert logic
        });
        // 2. Attach identity to the request object.
        req.userId = user.id;
        // 3. CRITICAL FIX: Use the original platform identity from the request body,
        // as the 'user' object no longer contains these fields.
        req.platformId = platformId;
        req.platformName = platformName;
        next();
    }
    catch (error) {
        logger_1.default.error('User Authentication Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            message: 'Failed to find or create user.',
            error: errorMessage,
        });
    }
};
exports.authenticateUser = authenticateUser;
/**
 * Middleware to authenticate the user and enforce that the authenticated user is the Game Master.
 * Requires the standard authentication to run first.
 */
const authenticateGameMaster = (req, res, next) => {
    // 1. Run standard user authentication first to populate req.userId
    // We pass a function that is called *only* if authenticateUser succeeds.
    (0, exports.authenticateUser)(req, res, () => {
        // 2. Enforce Game Master ID check
        if (req.userId === ADMIN_USER_ID) {
            // User is authenticated and is the Game Master.
            next();
        }
        else {
            // User is authenticated but is NOT the Game Master.
            return res.status(403).json({
                message: "Access Denied. This endpoint is restricted to the administrator (User ID 21).",
                action: 'authorization_failure'
            });
        }
    });
};
exports.authenticateGameMaster = authenticateGameMaster;
