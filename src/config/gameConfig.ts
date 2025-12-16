// src/config/gameConfig.ts

// --- SYSTEM CONFIGURATION ---
export const ADMIN_USER_ID = 21; // The user ID for the primary game master/admin
export const INITIAL_BALANCE = 500; // Starting balance for new users

// --- JWT/TOKEN CONFIGURATION ---
// Note: MAX_TOKEN_DURATION_MINUTES is used by both challengeService and jwtService logic.
export const MAX_TOKEN_DURATION_MINUTES = 210; 

// --- GAME COST & RULES CONFIGURATION ---
export const SUBMISSION_BASE_COST = 210; 
export const PUSH_BASE_COST = 21;
export const DISRUPT_COST = 2100;

// --- DURATION & TIMING ---
export const SESSION_DURATION_MS = 21 * 60 * 1000; // 21 minutes in milliseconds

// --- MULTIPLIERS & PERCENTAGES (Standard Numbers for display/simplicity) ---
export const DIGOUT_COST_PERCENTAGE = 0.21; // 21%
export const LIVE_DISCOUNT_MULTIPLIER = 0.79; // 1 - 0.21

// --- BIGINT MATH CONFIGURATION (For high-precision calculations) ---
export const DISCOUNT_DIVISOR = 100n; // Used to divide multipliers (e.g., 79/100)
export const LIVE_DISCOUNT_MULTIPLIER_NUMERATOR = 79n; // Represents 0.79
export const DIGOUT_PERCENTAGE_NUMERATOR = 21n; // Represents 0.21