// src/services/upstashService.ts

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// 1. Initialize Redis Client
export const redis = (REDIS_URL && REDIS_TOKEN) ? new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
}) : null;

// 2. Initialize the Rate Limiter (2 requests per 5 seconds)
export const commandRatelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(2, "5 s"),
  analytics: true,
  prefix: "@upstash/ratelimit/dmg-commands",
}) : null;