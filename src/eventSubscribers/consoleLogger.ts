// src/eventSubscribers/consoleLogger.ts
// This demonstrates how to create modules that react to the events.

import { ChallengeEvents, subscribeToChallengeEvent } from '../services/eventService';
import { Challenge } from '@prisma/client';

// Define the logic that runs when a SESSION_TICKED event fires
const handleSessionTicked = (challenge: Challenge) => {
    console.log(`[NOTIFIER] 🟢 Session Ticked: Challenge #${challenge.challengeId} is now at session ${challenge.currentSessionCount}/${challenge.totalSessions}. Ready for next launch!`);
};

// Define the logic that runs when a CHALLENGE_COMPLETED event fires
const handleChallengeCompleted = (challenge: Challenge) => {
    console.log(`[NOTIFIER] 🏆 CHALLENGE COMPLETED: Challenge #${challenge.challengeId} (${challenge.challengeText}) has been successfully finished!`);
};

/**
 * Initializes all console logging subscribers.
 */
export function initializeConsoleSubscribers() {
    subscribeToChallengeEvent(ChallengeEvents.SESSION_TICKED, handleSessionTicked);
    subscribeToChallengeEvent(ChallengeEvents.CHALLENGE_COMPLETED, handleChallengeCompleted);
    // You could subscribe to other events here too
    console.log('[Event Subscriptions] Console logger initialized.');
}