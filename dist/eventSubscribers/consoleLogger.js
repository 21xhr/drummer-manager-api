"use strict";
// src/eventSubscribers/consoleLogger.ts
// This demonstrates how to create modules that react to the events.
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeConsoleSubscribers = initializeConsoleSubscribers;
const eventService_1 = require("../services/eventService");
// Define the logic that runs when a SESSION_TICKED event fires
const handleSessionTicked = (challenge) => {
    console.log(`[NOTIFIER] 🟢 Session Ticked: Challenge #${challenge.challengeId} is now at session ${challenge.currentSessionCount}/${challenge.totalSessions}. Ready for next launch!`);
};
// Define the logic that runs when a CHALLENGE_COMPLETED event fires
const handleChallengeCompleted = (challenge) => {
    console.log(`[NOTIFIER] 🏆 CHALLENGE COMPLETED: Challenge #${challenge.challengeId} (${challenge.challengeText}) has been successfully finished!`);
};
/**
 * Initializes all console logging subscribers.
 */
function initializeConsoleSubscribers() {
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.SESSION_TICKED, handleSessionTicked);
    (0, eventService_1.subscribeToChallengeEvent)(eventService_1.ChallengeEvents.CHALLENGE_COMPLETED, handleChallengeCompleted);
    // You could subscribe to other events here too
    console.log('[Event Subscriptions] Console logger initialized.');
}
