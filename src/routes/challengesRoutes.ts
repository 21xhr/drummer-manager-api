// src/routes/challengeRoutes.ts

import { Request, Response, Router } from 'express';
import prisma from '../prisma';
import logger from '../logger';

export const router = Router();

/**
 * GET /api/v1/challenges
 */
router.get('/', async (req, res) => {
    const all = await prisma.challenge.findMany({
        orderBy: { timestampSubmitted: 'desc' }
    });
    res.json(all);
});







// GET /api/v1/challenges/:id
router.get('/:id', async (req: Request, res: Response) => {
    const challengeId = Number(req.params.id);

    if (!Number.isInteger(challengeId) || challengeId < 1) {
        return res.status(400).json({ message: 'Invalid challenge id.' });
    }

    try {
        const challenge = await prisma.challenge.findUnique({
            where: { challengeId }
        });

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found.' });
        }

        return res.status(200).json(challenge);
    } catch (error) {
        logger.error('Challenge Fetch By Id Failed:', error);
        return res.status(500).json({ message: 'Internal Server Error while fetching challenge.' });
    }
});







/**
 * GET /api/v1/challenges/delta
 */
router.get('/delta', async (req: Request, res: Response) => {
    const { since } = req.query;
    if (!since) return res.status(400).json({ message: "Missing 'since' parameter." });

    try {
        const lastCheck = new Date(since as string);
        const updates = await prisma.challenge.findMany({
            where: {
                timestampLastActivityAt: { gt: lastCheck }
            },
            orderBy: { timestampLastActivityAt: 'desc' }
        });
        return res.status(200).json(updates);
    } catch (error) {
        logger.error('Delta Fetch Failed:', error);
        return res.status(500).json({ message: "Internal Server Error during delta sync." });
    }
});

export default router;