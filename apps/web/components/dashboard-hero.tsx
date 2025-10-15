"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../../convex/_generated/api";
import { Button, Card, CardContent, CardHeader, CardTitle, StyledTabsList, StyledTabsTrigger, StyledTabsContent, Tabs } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";
import { Alert, AlertDescription, AlertTitle } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";
import { Badge } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";
import { Skeleton } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";
import { useToast } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/components";

export function DashboardHero() {
  const { toast } = useToast();
  const summary = useQuery(api.endpoints.dashboard.summary);
  const recent = useQuery(api.endpoints.dashboard.recent);
  const taskStats = useQuery(api.endpoints.tasks.getStats);

  const loading = !summary || !recent || !taskStats;
  const rows = useMemo(() => recent ?? [], [recent]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Badge variant="subtle">Todo App Dashboard</Badge>
            <CardTitle className="mt-2">Welcome back 👋</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <StyledTabsList>
              <StyledTabsTrigger value="overview">Overview</StyledTabsTrigger>
              <StyledTabsTrigger value="recent">Recent Tasks</StyledTabsTrigger>
            </StyledTabsList>
            <StyledTabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card
                  className="bg-primary text-primary-foreground"
                  style={{ background: "#6366f1" }}
                >
                  <CardHeader>
                    <CardTitle>Total Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-9 w-24" />
                    ) : (
                      <>
                        <p className="text-3xl font-semibold">{taskStats?.total ?? 0}</p>
                        <p className="text-sm opacity-80">All your tasks</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>To Do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-9 w-20" />
                    ) : (
                      <>
                        <p className="text-3xl font-semibold">{taskStats?.todo ?? 0}</p>
                        <p className="mt-2 text-sm text-neutral-foreground-secondary">
                          Pending tasks
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-9 w-20" />
                    ) : (
                      <>
                        <p className="text-3xl font-semibold">{taskStats?.inProgress ?? 0}</p>
                        <p className="mt-2 text-sm text-neutral-foreground-secondary">
                          Active tasks
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-9 w-20" />
                    ) : (
                      <>
                        <p className="text-3xl font-semibold text-green-600">{taskStats?.completed ?? 0}</p>
                        <p className="mt-2 text-sm text-neutral-foreground-secondary">
                          Done!
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </StyledTabsContent>
            <StyledTabsContent value="recent">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Skeleton className="h-7 w-full" />
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-neutral-foreground-secondary">
                        No tasks yet. Create your first task to see it here!
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.status === "completed"
                                ? "success"
                                : row.status === "in_progress"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {row.status === "in_progress" ? "In Progress" : row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "--"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </StyledTabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
