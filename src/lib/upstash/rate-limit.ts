import { env } from "@/env";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";

const cache = new Map();

class RedisRateLimiter {
  static instance: Ratelimit;

  static getInstance() {
    if (!this.instance) {
      const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env;

      const redisClient = new Redis({
        token: UPSTASH_REDIS_REST_TOKEN,
        url: UPSTASH_REDIS_REST_URL,
      });

      const rateLimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: true,
        ephemeralCache: cache,
      });

      this.instance = rateLimit;
      return this.instance;
    } else {
      return this.instance;
    }
  }
}

export { RedisRateLimiter };
