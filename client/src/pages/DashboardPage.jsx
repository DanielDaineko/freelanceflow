import { useEffect } from "react";
import useAuthStore from "../features/auth/authStore";

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  const stats = [
    { title: "Active Clients", value: "0" },
    { title: "Active Projects", value: "0" },
    { title: "Open Tasks", value: "0" },
    { title: "Monthly Revenue", value: "$0" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your freelance workspace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
          <p className="text-slate-400 mb-4">
            Your workspace is ready. Next, we will connect real data for
            clients, projects, tasks, and revenue.
          </p>
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-300">Current plan: {user?.plan}</p>
            <p className="text-slate-300">Email: {user?.email}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Notes</h2>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li>• Add your first client</li>
            <li>• Create a project</li>
            <li>• Add tasks and deadlines</li>
            <li>• Track payments in finance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
