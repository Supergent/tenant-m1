"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../../convex/_generated/api";
import { Id } from "@/../../convex/_generated/dataModel";
import {
  Button,
  Badge,
  Card,
} from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";
import { Check, Clock, Circle, Trash2, Calendar } from "lucide-react";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: number;
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
}

interface TaskItemProps {
  task: Task;
}

/**
 * Task Item Component
 *
 * Displays a single task with actions (status change, delete).
 */
export function TaskItem({ task }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTask = useMutation(api.endpoints.tasks.update);
  const deleteTask = useMutation(api.endpoints.tasks.remove);

  const handleStatusChange = async () => {
    setIsUpdating(true);
    try {
      const nextStatus =
        task.status === "todo"
          ? "in_progress"
          : task.status === "in_progress"
          ? "completed"
          : "todo";

      await updateTask({
        id: task._id,
        status: nextStatus,
      });
    } catch (error: any) {
      alert(error.message || "Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask({ id: task._id });
    } catch (error: any) {
      alert(error.message || "Failed to delete task");
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <Check className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const variants: Record<string, any> = {
      todo: "secondary",
      in_progress: "warning",
      completed: "success",
    };

    const labels: Record<string, string> = {
      todo: "To Do",
      in_progress: "In Progress",
      completed: "Completed",
    };

    return <Badge variant={variants[task.status]}>{labels[task.status]}</Badge>;
  };

  const getPriorityBadge = () => {
    if (!task.priority) return null;

    const variants: Record<string, any> = {
      low: "secondary",
      medium: "warning",
      high: "danger",
    };

    return <Badge variant={variants[task.priority]}>{task.priority}</Badge>;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isDueSoon = () => {
    if (!task.dueDate) return false;
    const now = Date.now();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    return task.dueDate - now < threeDays && task.dueDate > now;
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    return task.dueDate < Date.now() && task.status !== "completed";
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={handleStatusChange}
          disabled={isUpdating}
          className="mt-1 flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
        >
          {getStatusIcon()}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-base font-medium ${
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : ""
              }`}
            >
              {task.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {getStatusBadge()}
            {getPriorityBadge()}

            {task.dueDate && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  isOverdue()
                    ? "text-red-600 font-medium"
                    : isDueSoon()
                    ? "text-yellow-600"
                    : "text-muted-foreground"
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>
                  {isOverdue() ? "Overdue: " : "Due: "}
                  {formatDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
