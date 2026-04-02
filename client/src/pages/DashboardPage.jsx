import { useEffect } from "react";
import useAuthStore from "../features/auth/authStore";

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome, {user?.name || "User"}
          </h2>
          <p className="text-slate-300 mb-2">Email: {user?.email}</p>
          <p className="text-slate-300">Plan: {user?.plan}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
