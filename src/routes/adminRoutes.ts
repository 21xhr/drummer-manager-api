// src/routes/adminRoutes.ts
import { Router } from 'express';
import prisma from '../prisma';
import { redis } from '../services/upstashService'; 

const router = Router();

router.get('/pulse', async (req: any, res: any) => {
    // Security check
    if (req.header('X-Admin-Secret') !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // 1. Get Global Stats (Financials)
        const stats = await prisma.user.aggregate({
            _sum: {
                totalNumbersSpentGameWide: true,
                totalToCommunityChest: true
            }
        });

        // 2. Get Maintenance Info
        const streamStat = await prisma.streamStat.findUnique({ where: { id: 1 } });

        // 3. System Checks
        const dbHealth = await prisma.$queryRaw`SELECT 1`.then(() => "UP").catch(() => "DOWN");
        const redisHealth = redis ? await redis.ping().then(() => "UP").catch(() => "DOWN") : "DISABLED";

        res.json({
            status: "OK",
            systems: {
                supabase: dbHealth,
                upstash: redisHealth
            },
            financials: {
                totalSpent: stats._sum.totalNumbersSpentGameWide?.toString() || "0",
                communityChest: stats._sum.totalToCommunityChest?.toString() || "0"
            },
            maintenance: {
                realDay: streamStat?.daysSinceInception || 0,
                streamDay: streamStat?.streamDaysSinceInception || 0,
                lastRun: streamStat?.lastMaintenanceAt
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: "ERROR", message: error.message });
    }
});

export default router;