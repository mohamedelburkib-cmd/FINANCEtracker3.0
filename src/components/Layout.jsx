import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Nav from "./Nav.jsx";

export default function Layout() {
  const { session, signout } = useAuth();

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="text-2xl font-bold">Financial Tracker</div>
          <span className="text-xs text-slate-400 hidden md:inline">
            — local, private
          </span>
        </Link>

        {session && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">
              @{session.username}
            </span>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={signout}
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* Navigation */}
      <Nav />

      {/* Routed page content */}
      <Outlet />

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-12 pb-8">
        Data stored in your browser • Dark theme
      </footer>
    </div>
  );
}
