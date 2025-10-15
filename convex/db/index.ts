/**
 * Database Layer Barrel Export
 *
 * Re-exports all database operations for easy importing.
 * This is the public API of the database layer.
 *
 * Usage in endpoint layer:
 * import { Tasks, Dashboard } from "../db";
 * await Tasks.createTask(ctx, { userId, title });
 */

export * as Tasks from "./tasks";
export * as Dashboard from "./dashboard";
