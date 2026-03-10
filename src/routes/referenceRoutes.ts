// src/routes/referenceRoutes.ts

import { Router, Request, Response } from 'express';
import { getReferenceTitle } from '../utils/referenceMetadata';

const router = Router();

/**
 * GET /api/v1/references/title?url=...
 * Returns the resolved title for a public reference URL.
 */
router.get('/title', async (req: Request, res: Response) => {
    const rawUrl = req.query.url;

    if (typeof rawUrl !== 'string' || rawUrl.trim().length === 0) {
        return res.status(400).json({
            message: 'Missing required query parameter: url'
        });
    }

    try {
        const result = await getReferenceTitle(rawUrl.trim());

        return res.status(200).json({
            title: result.title,
            source: result.source
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to resolve reference title.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;