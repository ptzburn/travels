import { rateLimiter } from "hono-rate-limiter";

import type { AppBindings } from "~/api/lib/types.ts";

import { TOO_MANY_REQUESTS } from "~/shared/http-status.ts";

export function createRateLimiter({
  windowMs = 15 * 60 * 1000, // 15 minutes
  limit = 100, // Limit each user to 100 requests per window
} = {}) {
  return rateLimiter<AppBindings>({
    windowMs,
    limit,
    standardHeaders: "draft-7", // draft-7: combined `RateLimit` header
    keyGenerator: (c) => {
      return c.var.user.id;
    },
    // Add custom error handler
    handler: (c) => {
      return c.json({
        success: false,
        message: TOO_MANY_REQUESTS.MESSAGE,
        retryAfter: c.res.headers.get("Retry-After"),
      }, TOO_MANY_REQUESTS.CODE);
    },
  });
}

// Rate limits
export const rateLimits = {
  default: {
    windowMs: 15 * 60 * 1000,
    limit: 5000,
  },
  strict: {
    windowMs: 15 * 60 * 1000,
    limit: 1000,
  },
  lenient: {
    windowMs: 15 * 60 * 1000,
    limit: 10000,
  },
};

// Preset rate limiters for common use cases
export const defaultRateLimiter = createRateLimiter(rateLimits.default);
export const strictRateLimiter = createRateLimiter(rateLimits.strict);
export const lenientRateLimiter = createRateLimiter(rateLimits.lenient);
