import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Minimal Todo List Application
 *
 * Architecture: Four-layer Convex pattern
 * - User-scoped: All tables include userId for data isolation
 * - Timestamps: createdAt and updatedAt for audit trails
 * - Indexes: Optimized for common query patterns
 */

export default defineSchema({
  /**
   * Tasks Table
   * Core entity for todo items with status tracking
   */
  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      )
    ),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_user_and_created", ["userId", "createdAt"])
    .index("by_user_and_due_date", ["userId", "dueDate"]),
});
