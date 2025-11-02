import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/transactions", label: "Transactions", icon: "💳" },
  { to: "/subscriptions", label: "Subscriptions", icon: "🔄" },
  { to: "/savings", label: "Savings", icon: "💰" },
  { to: "/emergency-calc", label: "Emergency Fund", icon: "🚨" },
  { to: "/projections", label: "Projections", icon: "📈" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Layout() {
  const { session, signout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signout();
  };

  if (!session) return <Outlet />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              FinanceTracker
            </h1>
            <p className="text-sm text-slate-400 mt-1">Welcome back, {session.username}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      location.pathname === item.to
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {session.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{session.username}</p>
                  <p className="text-slate-400 text-sm">Active</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl px-4 py-2 font-medium transition-all duration-200"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
