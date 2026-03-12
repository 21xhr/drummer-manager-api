// src/services/upstashService.ts

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import logger from "../logger";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// 1. Initialize Redis Client
export const redis =
  REDIS_URL && REDIS_TOKEN
    ? new Redis({
        url: REDIS_URL,
        token: REDIS_TOKEN,
      })
    : null;

if (!redis) {
  logger.warn("Upstash Redis not configured — rate limiting disabled.");
} else {
  logger.info("Upstash Redis initialized — rate limiter active.");
}

// 2. Initialize the Rate Limiter
export const commandRatelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(2, "5 s"),
      analytics: true,
      prefix: "@upstash/ratelimit/dmg-commands",
    })
  : null;