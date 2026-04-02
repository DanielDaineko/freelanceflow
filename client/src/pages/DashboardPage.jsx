import { useEffect } from "react";
import useAuthStore from "../features/auth/authStore";
import useDashboardStore from "../store/dashboardStore";

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
        <p className="text-slate-400">Loading dashboard...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {stats.map((item) => (
              <div
                key={item.title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >
                <p className="text-slate-400 text-sm mb-2">{item.title}</p>
                <h3 className="text-3xl font-bold text-white">{item.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Welcome, {user?.name || "User"}
              </h2>

              <p className="text-slate-400 mb-4">
                Your workspace is getting real data from the database now.
              </p>

              <div className="bg-slate-800 rounded-xl p-4 space-y-2">
                <p className="text-slate-300">Email: {user?.email}</p>
                <p className="text-slate-300">Plan: {user?.plan}</p>
                <p className="text-slate-300">
                  Total Clients: {summary?.clientsCount ?? 0}
                </p>
                <p className="text-slate-300">
                  Total Projects: {summary?.projectsCount ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Notes</h2>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li>• Keep client records updated</li>
                <li>• Create projects with realistic budgets</li>
                <li>• Add deadlines to tasks</li>
                <li>• Track overdue work weekly</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
