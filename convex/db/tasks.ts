/**
 * Database Layer: Tasks
 *
 * This is the ONLY file that directly accesses the tasks table using ctx.db.
 * All tasks-related database operations are defined here as pure async functions.
 *
 * Architecture: Four-layer Convex pattern
 * - Only exports async functions (NOT Convex queries/mutations)
 * - Provides CRUD operations for the tasks table
 * - Used by the endpoint layer for business logic composition
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Task Status Type
 */
export type TaskStatus = "todo" | "in_progress" | "completed";

/**
 * Task Priority Type
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * CREATE - Insert a new task
 */
export async function createTask(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: number;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("tasks", {
    userId: args.userId,
    title: args.title,
    description: args.description,
    status: args.status ?? "todo",
    priority: args.priority,
    dueDate: args.dueDate,
    completedAt: undefined,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * READ - Get task by ID
 */
export async function getTaskById(ctx: QueryCtx, id: Id<"tasks">) {
  return await ctx.db.get(id);
}

/**
 * READ - Get all tasks for a user
 * Returns tasks ordered by creation date (newest first)
 */
export async function getTasksByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * READ - Get tasks by user and status
 * Useful for filtering tasks by completion state
 */
export async function getTasksByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: TaskStatus
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

/**
 * READ - Get tasks with upcoming due dates
 * Returns tasks ordered by due date (earliest first)
 */
export async function getTasksByUserAndDueDate(
  ctx: QueryCtx,
  userId: string,
  beforeTimestamp?: number
) {
  const query = ctx.db
    .query("tasks")
    .withIndex("by_user_and_due_date", (q) => q.eq("userId", userId));

  const tasks = await query.collect();

  // Filter tasks with due dates
  let filteredTasks = tasks.filter((task) => task.dueDate !== undefined);

  // Optionally filter by beforeTimestamp
  if (beforeTimestamp !== undefined) {
    filteredTasks = filteredTasks.filter(
      (task) => task.dueDate! <= beforeTimestamp
    );
  }

  // Sort by due date ascending (earliest first)
  return filteredTasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate - b.dueDate;
  });
}

/**
 * READ - Count tasks by status for a user
 * Useful for dashboard statistics
 */
export async function countTasksByStatus(ctx: QueryCtx, userId: string) {
  const tasks = await getTasksByUser(ctx, userId);

  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };
}

/**
 * READ - Get recently created tasks for a user
 * Returns the N most recent tasks
 */
export async function getRecentTasks(
  ctx: QueryCtx,
  userId: string,
  limit: number = 10
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_created", (q) => q.eq("userId", userId))
    .order("desc")
    .take(limit);
}

/**
 * UPDATE - Update task fields
 * Automatically sets completedAt when status changes to "completed"
 */
export async function updateTask(
  ctx: MutationCtx,
  id: Id<"tasks">,
  args: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: number;
  }
) {
  const now = Date.now();
  const updateData: any = {
    ...args,
    updatedAt: now,
  };

  // If status is being updated to completed, set completedAt timestamp
  if (args.status === "completed") {
    updateData.completedAt = now;
  }

  // If status is being changed from completed, clear completedAt
  if (args.status && args.status !== "completed") {
    const existingTask = await ctx.db.get(id);
    if (existingTask?.status === "completed") {
      updateData.completedAt = undefined;
    }
  }

  return await ctx.db.patch(id, updateData);
}

/**
 * DELETE - Remove a task
 */
export async function deleteTask(ctx: MutationCtx, id: Id<"tasks">) {
  return await ctx.db.delete(id);
}

/**
 * DELETE - Bulk delete tasks for a user
 * Useful for cleanup operations
 */
export async function deleteTasksByUser(ctx: MutationCtx, userId: string) {
  const tasks = await getTasksByUser(ctx, userId);
  for (const task of tasks) {
    await ctx.db.delete(task._id);
  }
  return tasks.length;
}
