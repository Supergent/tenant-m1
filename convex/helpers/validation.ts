/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 *
 * Used by the endpoint layer for validating user input.
 */

/**
 * Validate task title
 *
 * Rules:
 * - Cannot be empty or only whitespace
 * - Maximum 200 characters
 */
export function isValidTitle(title: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Task title cannot be empty" };
  }

  if (title.length > 200) {
    return {
      valid: false,
      error: "Task title cannot exceed 200 characters",
    };
  }

  return { valid: true };
}

/**
 * Validate task description
 *
 * Rules:
 * - Optional field
 * - Maximum 2000 characters if provided
 */
export function isValidDescription(description?: string): {
  valid: boolean;
  error?: string;
} {
  if (!description) {
    return { valid: true };
  }

  if (description.length > 2000) {
    return {
      valid: false,
      error: "Task description cannot exceed 2000 characters",
    };
  }

  return { valid: true };
}

/**
 * Validate due date
 *
 * Rules:
 * - Must be a valid timestamp
 * - Should be in the future (warning only, not enforced)
 */
export function isValidDueDate(dueDate?: number): {
  valid: boolean;
  error?: string;
  warning?: string;
} {
  if (!dueDate) {
    return { valid: true };
  }

  if (typeof dueDate !== "number" || isNaN(dueDate)) {
    return { valid: false, error: "Invalid due date timestamp" };
  }

  // Check if date is in the past (warning, not error)
  const now = Date.now();
  if (dueDate < now) {
    return {
      valid: true,
      warning: "Due date is in the past",
    };
  }

  return { valid: true };
}

/**
 * Validate task status transition
 *
 * Checks if transitioning from one status to another is allowed.
 * All transitions are currently allowed, but this function can be
 * extended to enforce workflow rules.
 */
export function isValidStatusTransition(
  from: "todo" | "in_progress" | "completed",
  to: "todo" | "in_progress" | "completed"
): {
  valid: boolean;
  error?: string;
} {
  // Currently, all transitions are allowed
  // This can be extended to enforce specific workflows, e.g.:
  // - Cannot go from completed back to todo
  // - Must go through in_progress before completed

  return { valid: true };
}

/**
 * Format task title (trim and normalize whitespace)
 */
export function formatTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ");
}

/**
 * Format task description (trim and normalize line breaks)
 */
export function formatDescription(description?: string): string | undefined {
  if (!description) return undefined;
  return description.trim();
}
