"use strict";
// src/services/eventService.ts
// This file houses the core EventEmitter instance and formalize your event names.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeEvents = void 0;
exports.publishChallengeEvent = publishChallengeEvent;
exports.subscribeToChallengeEvent = subscribeToChallengeEvent;
const events_1 = require("events");
// 1. Define Event Names (to avoid typos)
var ChallengeEvents;
(function (ChallengeEvents) {
    ChallengeEvents["SESSION_TICKED"] = "challenge:session_ticked";
    ChallengeEvents["CHALLENGE_COMPLETED"] = "challenge:completed";
    ChallengeEvents["CHALLENGE_EXECUTED"] = "challenge:executed";
    ChallengeEvents["CHALLENGE_SUBMITTED"] = "challenge:submitted";
    ChallengeEvents["CHALLENGE_REMOVED"] = "challenge:removed";
    ChallengeEvents["CHALLENGE_REMOVED_BY_AUTHOR"] = "challenge:removed_by_author";
    ChallengeEvents["CHALLENGE_DIGGED_OUT"] = "challenge:digged_out";
    ChallengeEvents["CHALLENGE_ACTIVATED_BY_GM"] = "challenge:activated_by_gm";
    // CHALLENGE_STOPPED = 'challenge:stopped', // Fired when the GM manually stops a challenge
})(ChallengeEvents || (exports.ChallengeEvents = ChallengeEvents = {}));
// 2. Define the Event Dispatcher
// Use a singleton instance
const eventDispatcher = new events_1.EventEmitter();
/**
 * Publishes an event to all registered listeners.
 * @param eventName The type of event (use ChallengeEvents enum).
 * @param data The payload to send with the event (e.g., the updated Challenge object).
 */
function publishChallengeEvent(eventName, data) {
    // For logging/debugging purposes:
    console.log(`[EventService] Publishing: ${eventName} for Challenge #${data.challengeId || 'N/A'}`);
    eventDispatcher.emit(eventName, data);
}
/**
 * Registers a listener function for a specific event.
 * @param eventName The type of event (use ChallengeEvents enum).
 * @param listener The callback function (e.g., a function to send a Twitch chat message).
 */
function subscribeToChallengeEvent(eventName, listener) {
    eventDispatcher.on(eventName, listener);
    // Optional: Log subscription for clarity
    // console.log(`[EventService] Subscribed to ${eventName}`);
}
