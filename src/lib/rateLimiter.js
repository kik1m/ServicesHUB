import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Upstash is configured
const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// In-Memory Fallback Map
const fallbackMap = new Map();

const fallbackLimiter = (limit, windowMs, type) => {
    return {
        limit: async (ip) => {
            const key = `${type}:${ip}`;
            const now = Date.now();
            const record = fallbackMap.get(key) || { count: 0, startTime: now };

            if (now - record.startTime > windowMs) {
                record.count = 0;
                record.startTime = now;
            }

            record.count++;
            fallbackMap.set(key, record);

            return {
                success: record.count <= limit,
                limit: limit,
                remaining: Math.max(0, limit - record.count),
                reset: record.startTime + windowMs
            };
        }
    };
};

// Create a new ratelimiter, that allows 30 requests per 1 minute
export const chatRateLimiter = hasUpstashConfig ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit/chat',
}) : fallbackLimiter(30, 60000, 'chat');

// Stricter rate limiter for generating AI suggestions (10 requests per 1 minute)
export const suggestionsRateLimiter = hasUpstashConfig ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit/suggestions',
}) : fallbackLimiter(10, 60000, 'suggestions');
