"use strict";
// src/services/lumiaService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNumbersViaLumia = addNumbersViaLumia;
exports.deductNumbersViaLumia = deductNumbersViaLumia;
const logger_1 = __importDefault(require("../logger"));
/**
 * MOCK: Simulates an authoritative call to the Lumia API for balance ADDITION (refund/credit).
 * @param platformId - The user's ID on their streaming platform.
 * @param amount - The NUMBERS cost to add.
 * @returns An object containing the new authoritative balance after addition.
 */
async function addNumbersViaLumia(platformId, amount) {
    logger_1.default.info(`Lumia Mock Success: Added ${amount} for User ${platformId} (Refund).`);
    // MOCK: In a real system, you would check the response for success/new balance.
    return {
        newBalance: 99999999 + amount // Mock authoritative new balance
    };
}
/**
 * MOCK: Simulates an authoritative call to the Lumia API for balance deduction.
 * * In a live system, this would make an HTTP request. For now, it's a critical
 * placeholder that is expected to throw an error on failure (e.g., 400 Insufficient Funds).
 * * @param platformId The user's ID on their streaming platform (Twitch ID, etc.)
 * @param amount The NUMBERS cost to deduct.
 * @returns An object containing the new authoritative balance after deduction.
 */
async function deductNumbersViaLumia(platformId, amount) {
    // 1. (MOCK) Global Token/Key Check is assumed to pass here.
    // MOCK FAILURE CONDITION: Simulate an authoritative failure (e.g., Insufficient Funds)
    if (amount > 1000000) { // Arbitrary large number to force a mock failure
        logger_1.default.warn(`Lumia Mock Failure: User ${platformId} attempted deduction of ${amount}.`);
        throw new Error("Lumia API: Insufficient funds for transaction.");
    }
    // MOCK SUCCESS: Log the deduction and return a mock new balance.
    // NOTE: We don't use the local balance. We return a placeholder new authoritative balance.
    logger_1.default.info(`Lumia Mock Success: Deducted ${amount} for User ${platformId}.`);
    // Return a successful result with a mock new authoritative balance.
    // In reality, the Lumia API would return the actual new balance.
    return {
        newBalance: 99999999 - amount // Mock authoritative new balance
    };
}
