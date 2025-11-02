import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const nav = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Transactions', href: '/transactions', icon: '💳' },
  { name: 'Investments', href: '/investments', icon: '📈' },
  { name: 'Subscriptions', href: '/subscriptions', icon: '🔄' },
  { name: 'Savings', href: '/savings', icon: '💰' },
  { name: 'Emergency Fund', href: '/emergency-calc', icon: '🚨' },
  { name: 'Projections', href: '/projections', icon: '📉' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Layout() {
  const { session, signout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (!session) return <Outlet />;

  return (
    <div className="flex h-screen bg-bg text-text-primary">
      {/* Mobile overlay */}
      {open && (
        <button
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-40 w-64 h-full bg-surface border-r border-border transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <span className="font-bold text-xl">FinanceTracker</span>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              to={n.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                pathname === n.href
                  ? 'bg-accent-primary text-white'
                  : 'hover:bg-border'
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={signout}
            className="w-full btn btn-danger text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden bg-surface border-b border-border p-4 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-semibold">{nav.find((n) => n.href === pathname)?.name}</span>
          <div /> {/* spacer */}
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
