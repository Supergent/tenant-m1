/**
 * Endpoint Layer: Dashboard
 *
 * Provides aggregated data for the dashboard view.
 * Combines multiple data sources for overview metrics.
 *
 * NEVER uses ctx.db directly - imports from ../db instead.
 */

import { v } from "convex/values";
import { query } from "../_generated/server";
import { authComponent } from "../auth";
import { Dashboard } from "../db";

/**
 * Get dashboard summary statistics
 *
 * Returns aggregated metrics for the dashboard widgets
 */
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // IMPORTANT: Use authUser._id (Convex document ID), not authUser.id
    return Dashboard.loadSummary(ctx, authUser._id);
  },
});

/**
 * Get recent tasks for dashboard table
 *
 * Returns the most recently updated tasks
 */
export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // IMPORTANT: Use authUser._id (Convex document ID), not authUser.id
    return Dashboard.loadRecent(ctx, authUser._id, args.limit ?? 5);
  },
});
