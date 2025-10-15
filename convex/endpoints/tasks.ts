/**
 * Endpoint Layer: Tasks
 *
 * Business logic for task management.
 * Composes database operations from the db layer.
 * Handles authentication, authorization, and rate limiting.
 *
 * NEVER uses ctx.db directly - imports from ../db instead.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import { Tasks } from "../db";

/**
 * Create a new task
 *
 * Rate limited: 20 per minute with burst capacity of 5
 * Requires authentication
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed"))
    ),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "createTask", {
      key: authUser._id,
    });

    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitStatus.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Validation (title is required and validated by Convex)
    if (args.title.trim().length === 0) {
      throw new Error("Task title cannot be empty");
    }

    if (args.title.length > 200) {
      throw new Error("Task title cannot exceed 200 characters");
    }

    // 4. Create task via database layer
    return await Tasks.createTask(ctx, {
      userId: authUser._id,
      title: args.title.trim(),
      description: args.description?.trim(),
      status: args.status,
      priority: args.priority,
      dueDate: args.dueDate,
    });
  },
});

/**
 * List all tasks for the authenticated user
 *
 * No rate limiting on queries (read operations)
 * Requires authentication
 */
export const list = query({
  handler: async (ctx) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get all tasks for user
    return await Tasks.getTasksByUser(ctx, authUser._id);
  },
});

/**
 * List tasks filtered by status
 *
 * Requires authentication
 */
export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get tasks filtered by status
    return await Tasks.getTasksByUserAndStatus(ctx, authUser._id, args.status);
  },
});

/**
 * Get task counts by status for dashboard
 *
 * Requires authentication
 */
export const getStats = query({
  handler: async (ctx) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get task statistics
    return await Tasks.countTasksByStatus(ctx, authUser._id);
  },
});

/**
 * Get tasks with upcoming due dates
 *
 * Requires authentication
 */
export const getUpcoming = query({
  args: {
    beforeTimestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get tasks with upcoming due dates
    return await Tasks.getTasksByUserAndDueDate(
      ctx,
      authUser._id,
      args.beforeTimestamp
    );
  },
});

/**
 * Update an existing task
 *
 * Rate limited: 50 per minute with burst capacity of 10
 * Requires authentication and ownership verification
 */
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed"))
    ),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "updateTask", {
      key: authUser._id,
    });

    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitStatus.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Verify task exists and user owns it
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to update this task");
    }

    // 4. Validation
    if (args.title !== undefined) {
      if (args.title.trim().length === 0) {
        throw new Error("Task title cannot be empty");
      }
      if (args.title.length > 200) {
        throw new Error("Task title cannot exceed 200 characters");
      }
    }

    // 5. Update task via database layer
    const { id, ...updateArgs } = args;

    // Trim string fields
    const cleanedArgs: any = { ...updateArgs };
    if (cleanedArgs.title) cleanedArgs.title = cleanedArgs.title.trim();
    if (cleanedArgs.description)
      cleanedArgs.description = cleanedArgs.description.trim();

    return await Tasks.updateTask(ctx, id, cleanedArgs);
  },
});

/**
 * Delete a task
 *
 * Rate limited: 30 per minute with burst capacity of 5
 * Requires authentication and ownership verification
 */
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimitStatus = await rateLimiter.limit(ctx, "deleteTask", {
      key: authUser._id,
    });

    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitStatus.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Verify task exists and user owns it
    const task = await Tasks.getTaskById(ctx, args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser._id) {
      throw new Error("Not authorized to delete this task");
    }

    // 4. Delete task via database layer
    return await Tasks.deleteTask(ctx, args.id);
  },
});

/**
 * Bulk delete all completed tasks
 *
 * Rate limited: 5 per hour (stricter for bulk operations)
 * Requires authentication
 */
export const deleteCompleted = mutation({
  handler: async (ctx) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting for bulk operations
    const rateLimitStatus = await rateLimiter.limit(ctx, "bulkDelete", {
      key: authUser._id,
    });

    if (!rateLimitStatus.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitStatus.retryAfter / 1000)} seconds.`
      );
    }

    // 3. Get all completed tasks
    const completedTasks = await Tasks.getTasksByUserAndStatus(
      ctx,
      authUser._id,
      "completed"
    );

    // 4. Delete each task
    let deletedCount = 0;
    for (const task of completedTasks) {
      await Tasks.deleteTask(ctx, task._id);
      deletedCount++;
    }

    return { deletedCount };
  },
});
