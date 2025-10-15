import dynamic from "next/dynamic";

const DashboardHero = dynamic(() => import("@/components/dashboard-hero").then(mod => mod.DashboardHero), { ssr: false });
const TaskForm = dynamic(() => import("@/components/tasks").then(mod => mod.TaskForm), { ssr: false });
const TaskList = dynamic(() => import("@/components/tasks").then(mod => mod.TaskList), { ssr: false });

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <DashboardHero />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Manage your personal tasks and track progress
          </p>
        </div>
        <TaskForm />
      </div>

      <TaskList />
    </main>
  );
}
