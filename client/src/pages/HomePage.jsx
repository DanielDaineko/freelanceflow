import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">FreelanceFlow</h1>
        <p className="text-slate-300 text-lg mb-8">
          SaaS platform for freelancers and small teams to manage clients,
          projects, tasks, and revenue.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-lg font-medium"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-slate-700 hover:bg-slate-800 px-6 py-3 rounded-lg font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
