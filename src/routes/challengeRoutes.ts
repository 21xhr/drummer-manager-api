// src/routes/challengeRoutes.ts

import { Request, Response, Router } from 'express';
import prisma from '../prisma';
import logger from '../logger';

export const router = Router();

// GET /api/v1/challenge
router.get('/', async (req, res) => {
    const all = await prisma.challenge.findMany({
        include: { 
            proposer: {
                include: { accounts: true }
            } 
        },
        orderBy: { timestampSubmitted: 'desc' }
    });
    res.json(all);
});

/**
 * GET /api/v1/challenge/delta
 */
router.get('/delta', async (req: Request, res: Response) => {
    const { since } = req.query;
    if (!since) return res.status(400).json({ message: "Missing 'since' parameter." });

    try {
        const lastCheck = new Date(since as string);
        const updates = await prisma.challenge.findMany({
            where: {
                OR: [
                    { timestampLastActivation: { gt: lastCheck } },
                    { timestampLastStreamDayTicked: { gt: lastCheck } },
                    { timestampCompleted: { gt: lastCheck } }
                ]
            },
            include: {
                proposer: {
                    select: {
                        accounts: {
                            select: { username: true, platformName: true }
                        }
                    }
                }
            },
            orderBy: { timestampLastActivation: 'desc' }
        });
        return res.status(200).json(updates);
    } catch (error) {
        logger.error('Delta Fetch Failed:', error);
        return res.status(500).json({ message: "Internal Server Error during delta sync." });
    }
});

export default router;