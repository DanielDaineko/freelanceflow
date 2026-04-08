import { useEffect } from "react";
import useAuthStore from "../features/auth/authStore";
import useDashboardStore from "../store/dashboardStore";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  const summary = useDashboardStore((state) => state.summary);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);
  const fetchSummary = useDashboardStore((state) => state.fetchSummary);

  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const stats = [
    { title: "Clients", value: summary?.clientsCount ?? 0 },
    { title: "Projects", value: summary?.projectsCount ?? 0 },
    { title: "Tasks", value: summary?.tasksCount ?? 0 },
    { title: "Overdue Tasks", value: summary?.overdueTasksCount ?? 0 },
    { title: "Active Projects", value: summary?.activeProjectsCount ?? 0 },
    { title: "Total Budget", value: `$${summary?.totalBudget ?? 0}` },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your freelance workspace</p>
      </div>

      {isLoading ? (
        <Card>
          <p className="text-slate-400">Loading dashboard...</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-red-400">{error}</p>
        </Card>
      ) : !summary ? (
        <EmptyState
          title="No dashboard data"
          description="Start adding clients, projects, tasks, and payments to see analytics."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {stats.map((item) => (
              <Card key={item.title}>
                <p className="text-slate-400 text-sm mb-2">{item.title}</p>
                <h3 className="text-3xl font-bold text-white">{item.value}</h3>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                Welcome, {user?.name || "User"}
              </h2>

              <p className="text-slate-400 mb-4">
                Your workspace is connected to live database data and ready for
                real usage.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-2">Account</p>
                  <p className="text-white font-medium">
                    {user?.name || "Unknown user"}
                  </p>
                  <p className="text-slate-300 text-sm">{user?.email}</p>
                  <p className="text-slate-300 text-sm mt-1">
                    Plan: {user?.plan || "FREE"}
                  </p>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-2">
                    Workspace Summary
                  </p>
                  <p className="text-slate-300 text-sm">
                    Clients: {summary.clientsCount ?? 0}
                  </p>
                  <p className="text-slate-300 text-sm">
                    Projects: {summary.projectsCount ?? 0}
                  </p>
                  <p className="text-slate-300 text-sm">
                    Tasks: {summary.tasksCount ?? 0}
                  </p>
                  <p className="text-slate-300 text-sm">
                    Budget: ${summary.totalBudget ?? 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Quick Notes</h2>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li>• Keep client records updated</li>
                <li>• Review active projects weekly</li>
                <li>• Track overdue tasks daily</li>
                <li>• Record payments as they arrive</li>
              </ul>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">
                Productivity Snapshot
              </h2>
              <div className="space-y-3">
                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Open workload</p>
                  <p className="text-white font-medium text-lg">
                    {summary.tasksCount ?? 0} total tasks
                  </p>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Urgent attention</p>
                  <p className="text-white font-medium text-lg">
                    {summary.overdueTasksCount ?? 0} overdue tasks
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Business Snapshot</h2>
              <div className="space-y-3">
                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Client base</p>
                  <p className="text-white font-medium text-lg">
                    {summary.clientsCount ?? 0} clients in workspace
                  </p>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Active delivery</p>
                  <p className="text-white font-medium text-lg">
                    {summary.activeProjectsCount ?? 0} active projects
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
