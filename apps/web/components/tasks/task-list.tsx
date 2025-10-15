"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../../convex/_generated/api";
import { TaskItem } from "./task-item";
import { Tabs, TabsList, TabsTrigger, TabsContent, Skeleton } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";

/**
 * Task List Component
 *
 * Displays all tasks with filtering by status.
 * Uses Convex queries for real-time updates.
 */
export function TaskList() {
  const [activeTab, setActiveTab] = useState<"all" | "todo" | "in_progress" | "completed">("all");

  // Fetch all tasks
  const allTasks = useQuery(api.endpoints.tasks.list);

  // Fetch filtered tasks based on active tab
  const todoTasks = useQuery(
    api.endpoints.tasks.listByStatus,
    activeTab === "todo" ? { status: "todo" } : "skip"
  );
  const inProgressTasks = useQuery(
    api.endpoints.tasks.listByStatus,
    activeTab === "in_progress" ? { status: "in_progress" } : "skip"
  );
  const completedTasks = useQuery(
    api.endpoints.tasks.listByStatus,
    activeTab === "completed" ? { status: "completed" } : "skip"
  );

  // Get the correct tasks based on active tab
  const tasks =
    activeTab === "all"
      ? allTasks
      : activeTab === "todo"
      ? todoTasks
      : activeTab === "in_progress"
      ? inProgressTasks
      : completedTasks;

  // Loading state
  if (tasks === undefined) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All {allTasks ? `(${allTasks.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No tasks found</p>
              <p className="text-sm">
                {activeTab === "all"
                  ? "Create your first task to get started!"
                  : `No ${activeTab.replace("_", " ")} tasks yet.`}
              </p>
            </div>
          ) : (
            tasks.map((task) => <TaskItem key={task._id} task={task} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
