"use strict";
// src/routes/clockRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clockService_1 = require("../services/clockService");
// NOTE: Ensure runDailyMaintenance is exported from clockService.ts
const router = (0, express_1.Router)();
// -----------------------------------------------------------
// MAINTENANCE/CRON ENDPOINT
// -----------------------------------------------------------
router.post('/run-daily-maintenance', async (req, res) => {
    // 1. Check for the CRON Secret Key
    const cronSecret = req.headers['x-vercel-cron-secret'];
    // We expect the Vercel Cron job to send a secret that matches our environment variable.
    if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
        console.warn('Unauthorized access attempt to maintenance endpoint.');
        // Return 401 Unauthorized without processing the request.
        return res.status(401).end('Unauthorized access to maintenance endpoint.');
    }
    try {
        console.log("-> Starting Maintenance from API call...");
        await (0, clockService_1.runDailyMaintenance)();
        return res.status(200).json({
            message: 'Daily maintenance successfully executed.',
            action: 'maintenance_success',
        });
    }
    catch (error) {
        console.error('Daily Maintenance Execution Error:', error);
        return res.status(500).json({
            message: 'Failed to complete daily maintenance tasks.',
            error: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
});
exports.default = router;
