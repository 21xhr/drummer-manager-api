// src/scheduler.ts

import * as cron from 'node-cron';
import { processAutomaticSessionTick } from './services/challengeService';
import { publishChallengeEvent, ChallengeEvents } from './services/eventService';
import logger from './logger';

// Schedule the task to run every minute
// Cron pattern: * * * * *
// Syntax: (minute, hour, day of month, month, day of week)
const SESSION_TICK_CRON = '*/10 * * * * *'; // Runs every 10 seconds

export function startChallengeScheduler() {
    logger.info('Starting Challenge Scheduler...');

    cron.schedule(SESSION_TICK_CRON, async () => {
        try {
            const result = await processAutomaticSessionTick();
            
            if (result) {
                const { challenge, eventType } = result; // Use destructuring for cleaner code

                const eventName = result.eventType === 'SESSION_COMPLETED' 
                    ? ChallengeEvents.CHALLENGE_COMPLETED 
                    : ChallengeEvents.SESSION_TICKED;
                    
                publishChallengeEvent(eventName, result.challenge); 
            }
        } catch (error) {
            logger.error('[Scheduler] Error during session tick:', error);
        }
    });
    
    logger.info('Challenge Scheduler armed to check every minute.');
}