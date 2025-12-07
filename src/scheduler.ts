// src/scheduler.ts

import * as cron from 'node-cron';
import { processAutomaticSessionTick } from './services/challengeService';
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

                // Log action
                logger.info(`[Scheduler] Processed tick for Challenge #${challenge.challengeId}. Event: ${eventType}.`);

                // Event Triggering Logic
                // This is where you would call your external APIs based on the eventType
                
                if (eventType === 'SESSION_TICKED') {
                    // Example: Trigger a 'Session Ticked' light or chat message
                    // await externalApi.triggerLumiaEvent('session_ticked', result.challenge); 
                    console.log(`[Scheduler Event] Firing event: SESSION_TICKED for Challenge #${result.challenge.challengeId}`);
                }
                
                if (eventType === 'SESSION_COMPLETED') {
                    // Example: Trigger a 'Challenge Completed' fanfare
                    // await externalApi.triggerLumiaEvent('challenge_completed_fanfare', result.challenge);
                    console.log(`[Scheduler Event] Firing event: CHALLENGE_COMPLETED for Challenge #${result.challenge.challengeId}`);
                }
            }
        } catch (error) {
            logger.error('[Scheduler] Error during session tick:', error);
        }
    });
    
    logger.info('Challenge Scheduler armed to check every minute.');
}