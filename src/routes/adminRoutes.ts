// src/routes/adminRoutes.ts

// Define the Contract
// Interface: Explicitly define lastRun as string for the JSON contract
export interface PulseResponse {
    status: "OK" | "ERROR";
    systems: { 
        supabase: "UP" | "DOWN"; 
        upstash: "UP" | "DOWN" | "DISABLED"; 
    };
    financials: {
        grossSpent: string; 
        refunded: string; 
        netEconomy: string;
        totalCausedByRemovals: string; 
        communityChest: string; 
        totalToPushers: string;
    };
    maintenance: { 
        realDay: number; 
        streamDay: number; 
        lastRun: string | null; // string for ISO consistency
    };
}

import { Router } from 'express';
import prisma from '../prisma';
import { redis } from '../services/upstashService'; 

const router = Router();

/**
 * Returns System Health (DB/Redis), Economy Stats (BigInt totals), and Maintenance history.
 */
router.get('/pulse', async (req: any, res: any) => {
    const authHeader = req.header('X-Admin-Secret');
    if (!authHeader || authHeader !== process.env.ADMIN_SECRET) {
        console.warn(`Unauthorized Pulse access attempt from: ${req.ip}`);
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // 1. Get Global Stats from the World User (ID 1)
        const globalCounter = await prisma.user.findUnique({
            where: { id: 1 },
            select: { 
                totalNumbersSpentGameWide: true,
                totalNumbersReturnedFromRemovalsGameWide: true,
                totalCausedByRemovals: true,
                totalToCommunityChest: true,
                totalToPushers: true
            }
        });

        if (!globalCounter) {
            return res.status(404).json({ status: "ERROR", message: "Global Counter (User ID 1) not found." });
        }

        // 2. Get Maintenance Info
        const streamStat = await prisma.streamStat.findUnique({ where: { id: 1 } });

        // 3. System Checks
        const dbHealth = await prisma.$queryRaw`SELECT 1`.then(() => "UP").catch(() => "DOWN");
        const redisHealth = redis ? await redis.ping().then(() => "UP").catch(() => "DOWN") : "DISABLED";

        // 4. Calculate Net Economy (Gross - Refunded)
        const gross = globalCounter.totalNumbersSpentGameWide;
        const refunded = globalCounter.totalNumbersReturnedFromRemovalsGameWide;
        const netEconomy = gross - refunded;

        // Use the interface in your response
        const responseData: PulseResponse = {
            status: "OK",
            systems: {
                supabase: dbHealth as "UP" | "DOWN",
                upstash: redisHealth as "UP" | "DOWN" | "DISABLED"
            },
            financials: {
                grossSpent: gross.toString(),
                refunded: refunded.toString(),
                netEconomy: netEconomy.toString(),
                totalCausedByRemovals: globalCounter.totalCausedByRemovals.toString(),
                communityChest: globalCounter.totalToCommunityChest.toString(),
                totalToPushers: globalCounter.totalToPushers.toString()
            },
            maintenance: {
                realDay: streamStat?.daysSinceInception || 0,
                streamDay: streamStat?.streamDaysSinceInception || 0,
                // Ensure we send a clean ISO string for the frontend to parse
                lastRun: streamStat?.lastMaintenanceAt ? streamStat.lastMaintenanceAt.toISOString() : null
            }
        };
        res.json(responseData);
        
    } catch (error: any) {
        res.status(500).json({ status: "ERROR", message: error.message });
    }
});

export default router;