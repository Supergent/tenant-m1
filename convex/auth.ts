import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";

/**
 * Better Auth Client for Convex
 *
 * Provides authentication utilities for:
 * - Getting authenticated users in queries/mutations
 * - Validating JWT tokens
 * - Managing user sessions
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Create Better Auth instance
 *
 * Configuration:
 * - Email/password authentication enabled
 * - Email verification disabled (for development)
 * - 30-day JWT sessions via Convex plugin
 * - Convex database adapter for user storage
 *
 * @param ctx - Convex context
 * @param options - Optional configuration
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    baseURL: process.env.SITE_URL!,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Set to true in production
    },
    plugins: [
      convex({
        jwtExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  });
};
