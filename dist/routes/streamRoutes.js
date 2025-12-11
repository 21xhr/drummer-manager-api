"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/streamRoutes.ts
const express_1 = require("express");
const streamService_1 = require("../services/streamService");
const streamService_2 = require("../services/streamService");
const prisma_1 = __importDefault(require("../prisma"));
const router = (0, express_1.Router)();
// -----------------------------------------------------------
// STREAM WEBHOOK ENDPOINTS
// NOTE: These endpoints should be secured in a production environment 
// with a signature check (e.g., HMAC) from the streaming platform.
// -----------------------------------------------------------
/**
 * POST /api/v1/stream/live
 * Webhook endpoint called when the streamer goes LIVE.
 * Request Body: { timestamp: string (ISO 8601, optional) }
 */
router.post('/live', async (req, res) => {
    // Use current time as fallback if webhook doesn't provide a precise timestamp
    const streamStartTime = req.body.timestamp ? new Date(req.body.timestamp) : new Date();
    if (isNaN(streamStartTime.getTime())) {
        return res.status(400).json({ error: "Invalid timestamp provided." });
    }
    try {
        // This executes the core "21-day counter advancement" logic
        await (0, streamService_1.processStreamLiveEvent)(streamStartTime);
        return res.status(200).json({
            message: 'Stream live event processed successfully.',
            action: 'stream_live_event_success',
        });
    }
    catch (error) {
        console.error('Stream Live Event Error:', error);
        return res.status(500).json({
            message: 'Failed to process stream live event.',
            error: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
});
/**
 * POST /api/v1/stream/offline
 * Webhook endpoint called when the streamer goes OFFLINE.
 * Request Body: { timestamp: string (ISO 8601, optional) }
 */
router.post('/offline', async (req, res) => {
    const streamEndTime = req.body.timestamp ? new Date(req.body.timestamp) : new Date();
    if (isNaN(streamEndTime.getTime())) {
        return res.status(400).json({ error: "Invalid timestamp provided." });
    }
    try {
        // This executes the stream session duration calculation/update
        await (0, streamService_1.processStreamOfflineEvent)(streamEndTime);
        return res.status(200).json({
            message: 'Stream offline event processed successfully.',
            action: 'stream_offline_event_success',
        });
    }
    catch (error) {
        console.error('Stream Offline Event Error:', error);
        return res.status(500).json({
            message: 'Failed to process stream offline event.',
            error: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
});
/**
 * GET /api/v1/stream/stats
 * Provides current stream status and global game stats.
 */
router.get('/stats', async (req, res) => {
    try {
        // 1. Get Global Stream Stat
        const globalStats = await prisma_1.default.streamStat.findFirst();
        // 2. Get Current Stream Status
        const isLive = (0, streamService_2.isStreamLive)(); // Uses the in-memory status
        return res.status(200).json({
            message: 'Global stream statistics retrieved.',
            isStreamLive: isLive,
            streamDaysSinceInception: globalStats ? globalStats.streamDaysSinceInception : 0,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get Stream Stats Error:', error);
        return res.status(500).json({
            message: 'Failed to retrieve stream statistics.',
            error: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
});
exports.default = router;
