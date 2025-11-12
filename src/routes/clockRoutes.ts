// src/routes/clockRoutes.ts

import { Router, Request, Response } from 'express';
import { runDailyMaintenance } from '../services/clockService'; 
// NOTE: Ensure runDailyMaintenance is exported from clockService.ts

const router = Router();

// -----------------------------------------------------------
// MAINTENANCE/CRON ENDPOINT
// -----------------------------------------------------------

/**
 * POST /api/v1/clock/run-daily-maintenance
 * * This endpoint is designed to be called by a scheduled service (Vercel Cron).
 * It executes all daily, time-sensitive maintenance tasks:
 * 1. Increments Real-World Day Counter.
 * 2. Runs the User Activity Tick.
 * 3. Archives challenges that hit the 21-Day Clock limit.
 * 4. Fails ONE_OFF challenges that broke contiguity.
 * * In a production environment, this should be secured (e.g., using a secret key
 * in the request header or query parameter) to prevent unauthorized execution.
 */
router.post('/run-daily-maintenance', async (req: Request, res: Response) => {
    // --- ⚠️ PRODUCTION SECURITY WARNING ⚠️ ---
    // For a live game, add a security check here:
    // if (req.headers['x-vercel-cron-secret'] !== process.env.CRON_SECRET) {
    //    return res.status(401).end('Unauthorized access to maintenance endpoint.');
    // }
    
    try {
        console.log("-> Starting Maintenance from API call...");
        await runDailyMaintenance();

        return res.status(200).json({
            message: 'Daily maintenance successfully executed.',
            action: 'maintenance_success',
        });
    } catch (error) {
        console.error('Daily Maintenance Execution Error:', error);
        return res.status(500).json({
            message: 'Failed to complete daily maintenance tasks.',
            error: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
});

export default router;