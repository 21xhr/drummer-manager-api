// src/routes/clockRoutes.ts

import { Router, Request, Response } from 'express';
import { runDailyMaintenance } from '../services/clockService'; 
// NOTE: Ensure runDailyMaintenance is exported from clockService.ts

const router = Router();

// -----------------------------------------------------------
// MAINTENANCE/CRON ENDPOINT
// -----------------------------------------------------------

router.post('/run-daily-maintenance', async (req: Request, res: Response) => {
    // 1. Get the expected secret from the environment (CRON_SECRET confirmed by user)
    const EXPECTED_SECRET = process.env.CRON_SECRET;
    
    // 2. Get the incoming secret from the header (Vercel standard for cron)
    const incomingSecret = req.header('x-vercel-cron-secret'); 
    
    // Check 1: If the secret isn't configured in the environment, block the request (fail-safe).
    // Check 2: If the incoming secret is missing OR it doesn't match the expected secret, block.
    if (!EXPECTED_SECRET || !incomingSecret || incomingSecret !== EXPECTED_SECRET) {
        console.warn('Unauthorized access attempt to maintenance endpoint.');
        return res.status(401).end('Unauthorized access to maintenance endpoint.');
    }
    
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