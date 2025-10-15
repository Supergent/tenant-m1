/**
 * Application Constants
 *
 * Centralized constants used throughout the application.
 * NO database access, NO ctx parameter.
 */

/**
 * Task Status Values
 */
export const TASK_STATUS = {
  TODO: "todo" as const,
  IN_PROGRESS: "in_progress" as const,
  COMPLETED: "completed" as const,
};

/**
 * Task Priority Values
 */
export const TASK_PRIORITY = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
};

/**
 * Task Status Display Labels
 */
export const TASK_STATUS_LABELS: Record<string, string> = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.COMPLETED]: "Completed",
};

/**
 * Task Priority Display Labels
 */
export const TASK_PRIORITY_LABELS: Record<string, string> = {
  [TASK_PRIORITY.LOW]: "Low",
  [TASK_PRIORITY.MEDIUM]: "Medium",
  [TASK_PRIORITY.HIGH]: "High",
};

/**
 * Task Status Colors (for UI)
 */
export const TASK_STATUS_COLORS: Record<string, string> = {
  [TASK_STATUS.TODO]: "secondary", // Blue
  [TASK_STATUS.IN_PROGRESS]: "warning", // Yellow
  [TASK_STATUS.COMPLETED]: "success", // Green
};

/**
 * Task Priority Colors (for UI)
 */
export const TASK_PRIORITY_COLORS: Record<string, string> = {
  [TASK_PRIORITY.LOW]: "secondary",
  [TASK_PRIORITY.MEDIUM]: "warning",
  [TASK_PRIORITY.HIGH]: "danger",
};

/**
 * Validation Limits
 */
export const LIMITS = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000,
  RECENT_TASKS_LIMIT: 10,
};

/**
 * Rate Limiting Configuration Display Names
 */
export const RATE_LIMIT_NAMES: Record<string, string> = {
  createTask: "Create Task",
  updateTask: "Update Task",
  deleteTask: "Delete Task",
  bulkDelete: "Bulk Delete",
};
