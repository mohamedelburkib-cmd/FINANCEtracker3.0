import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Nav from "./Nav.jsx";

export default function Layout() {
  const { session, signout } = useAuth();

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="text-2xl font-bold">Financial Tracker</div>
          <span className="text-xs text-slate-400 hidden md:inline">— local, private</span>
        </Link>
        {session && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">{session.email}</span>
            <button className="btn btn-secondary" onClick={signout}>Sign out</button>
          </div>
        )}
      </header>

      <Nav />
      <Outlet />

      <footer className="text-center text-xs text-slate-400 mt-12 pb-8">
        One-file data (browser storage) • Dark theme
      </footer>
    </div>
  );
}
