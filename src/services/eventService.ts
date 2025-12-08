// src/services/eventService.ts
// This file houses the core EventEmitter instance and formalize your event names.

import { EventEmitter } from 'events';
import { Challenge } from '@prisma/client';
import logger from '../logger';

// 1. Define Event Names (to avoid typos)
export enum ChallengeEvents {
    SESSION_TICKED = 'challenge:session_ticked', // Fired when a session ticks (count increases, but not completed)
    CHALLENGE_COMPLETED = 'challenge:completed', // Fired when the final session completes    
    CHALLENGE_EXECUTED = 'challenge:executed', // Fired when the GM manually starts a challenge
    CHALLENGE_SUBMITTED = 'challenge:submitted',
    CHALLENGE_REMOVED = 'challenge:removed', // For GM permanent delete
    CHALLENGE_REMOVED_BY_AUTHOR = 'challenge:removed_by_author', // For !remove command
    CHALLENGE_DIGGED_OUT = 'challenge:digged_out', // For player !digout command
    CHALLENGE_ACTIVATED_BY_GM = 'challenge:activated_by_gm', // For GM status override

    // CHALLENGE_STOPPED = 'challenge:stopped', // Fired when the GM manually stops a challenge
}

// 2. Define the Event Dispatcher
// Use a singleton instance
const eventDispatcher = new EventEmitter();

/**
 * Publishes an event to all registered listeners.
 * @param eventName The type of event (use ChallengeEvents enum).
 * @param data The payload to send with the event (e.g., the updated Challenge object).
 */
export function publishChallengeEvent(eventName: ChallengeEvents, data: Challenge | any) {
    // For logging/debugging purposes:
    console.log(`[EventService] Publishing: ${eventName} for Challenge #${data.challengeId || 'N/A'}`);
    eventDispatcher.emit(eventName, data);
}

/**
 * Registers a listener function for a specific event.
 * @param eventName The type of event (use ChallengeEvents enum).
 * @param listener The callback function (e.g., a function to send a Twitch chat message).
 */
export function subscribeToChallengeEvent(eventName: ChallengeEvents, listener: (data: Challenge | any) => void) {
    eventDispatcher.on(eventName, listener);
    // Optional: Log subscription for clarity
    // console.log(`[EventService] Subscribed to ${eventName}`);
}