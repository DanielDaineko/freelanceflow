import { useNavigate } from "react-router-dom";
import useAuthStore from "../../features/auth/authStore";

function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-20 border-b border-slate-800 bg-slate-950 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-white text-xl font-semibold">Welcome back</h2>
        <p className="text-slate-400 text-sm">
          Manage your freelance business in one place
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-white font-medium">{user?.name || "User"}</p>
          <p className="text-slate-400 text-sm">{user?.email || "No email"}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
