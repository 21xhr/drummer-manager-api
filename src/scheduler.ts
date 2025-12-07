// src/scheduler.ts

import * as cron from 'node-cron';
import { processAutomaticSessionTick } from './services/challengeService';
import logger from './logger';

// Schedule the task to run every minute
// Cron pattern: * * * * *
// Syntax: (minute, hour, day of month, month, day of week)
const SESSION_TICK_CRON = '* * * * *'; 

export function startChallengeScheduler() {
    logger.info('Starting Challenge Scheduler...');

    cron.schedule(SESSION_TICK_CRON, async () => {
        try {
            const result = await processAutomaticSessionTick();
            if (result) {
                // Log action only if a tick occurred
                logger.info(`[Scheduler] Processed tick for Challenge #${result.challengeId}. New count: ${result.currentSessionCount}.`);
            }
        } catch (error) {
            logger.error('[Scheduler] Error during session tick:', error);
        }
    });
    
    logger.info('Challenge Scheduler armed to check every minute.');
}