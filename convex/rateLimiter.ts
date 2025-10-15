/**
 * Rate Limiter Configuration
 *
 * Configures rate limits for API endpoints to prevent abuse.
 * Uses token bucket algorithm for smooth burst handling.
 *
 * Token Bucket Algorithm:
 * - Allows bursts up to capacity
 * - Refills at specified rate
 * - Good for user-facing operations
 */

import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Task creation - allow bursts of 5, refill 20 per minute
  createTask: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 5,
  },

  // Task updates - more generous limit for frequent edits
  updateTask: {
    kind: "token bucket",
    rate: 50,
    period: MINUTE,
    capacity: 10,
  },

  // Task deletion - moderate limit
  deleteTask: {
    kind: "token bucket",
    rate: 30,
    period: MINUTE,
    capacity: 5,
  },

  // Bulk operations - stricter limit
  bulkDelete: {
    kind: "fixed window",
    rate: 5,
    period: HOUR,
  },
});
