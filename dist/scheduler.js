"use strict";
// src/scheduler.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startChallengeScheduler = startChallengeScheduler;
const cron = __importStar(require("node-cron"));
const challengeService_1 = require("./services/challengeService");
const eventService_1 = require("./services/eventService");
const logger_1 = __importDefault(require("./logger"));
// Schedule the task to run every minute
// Cron pattern: * * * * *
// Syntax: (minute, hour, day of month, month, day of week)
const SESSION_TICK_CRON = '*/10 * * * * *'; // Runs every 10 seconds
function startChallengeScheduler() {
    logger_1.default.info('Starting Challenge Scheduler...');
    cron.schedule(SESSION_TICK_CRON, async () => {
        try {
            const result = await (0, challengeService_1.processAutomaticSessionTick)();
            if (result) {
                const { challenge, eventType } = result; // Use destructuring for cleaner code
                const eventName = result.eventType === 'SESSION_COMPLETED'
                    ? eventService_1.ChallengeEvents.CHALLENGE_COMPLETED
                    : eventService_1.ChallengeEvents.SESSION_TICKED;
                (0, eventService_1.publishChallengeEvent)(eventName, result.challenge);
            }
        }
        catch (error) {
            logger_1.default.error('[Scheduler] Error during session tick:', error);
        }
    });
    logger_1.default.info('Challenge Scheduler armed to check every minute.');
}
