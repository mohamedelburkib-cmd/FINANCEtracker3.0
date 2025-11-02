/* src/App.jsx
 * Professional rewrite – finance-grade structure
 * Adds /investments + central nav config + explicit auth wrappers
 */

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

/* ---------- AUTH PAGES ---------- */
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

/* ---------- PRIVATE PAGES ---------- */
import Dashboard      from './pages/Dashboard';
import Transactions   from './pages/Transactions';
import Subscriptions  from './pages/Subscriptions';
import Savings        from './pages/Savings';
import EmergencyCalc  from './pages/EmergencyCalc';
import Projections    from './pages/Projections';
import Settings       from './pages/Settings';
import Investments    from './pages/Investments';   // NEW

/* ---------- AUTH HOOK ---------- */
import { useAuth } from './hooks/useAuth';

/* ============================================================
 * NAV CONFIG – single source of truth for Layout + breadcrumbs
 * ============================================================ */
export const NAV_ITEMS = [
  { name: 'Dashboard',      href: '/dashboard',     icon: '📊' },
  { name: 'Transactions',   href: '/transactions',  icon: '💳'  },
  { name: 'Investments',    href: '/investments',   icon: '📈'  },
  { name: 'Subscriptions',  href: '/subscriptions', icon: '🔄'  },
  { name: 'Savings',        href: '/savings',       icon: '💰'  },
  { name: 'Emergency Fund', href: '/emergency-calc',icon: '🚨'  },
  { name: 'Projections',    href: '/projections',   icon: '📉'  },
  { name: 'Settings',       href: '/settings',      icon: '⚙️'  },
];

/* ============================================================
 * AUTH GUARDS
 * ============================================================ */
function RequireAuth({ children }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/signin" replace />;
}

function RedirectIfAuth({ children }) {
  const { session } = useAuth();
  return session ? <Navigate to="/dashboard" replace /> : children;
}

/* ============================================================
 * ROUTER
 * ============================================================ */
export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* ---------------- PUBLIC AUTH ---------------- */}
        <Route
          path="/signin"
          element={
            <RedirectIfAuth>
              <SignIn />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuth>
              <SignUp />
            </RedirectIfAuth>
          }
        />

        {/* ---------------- PRIVATE SHELL -------------- */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"     element={<Dashboard />} />
          <Route path="transactions"  element={<Transactions />} />
          <Route path="investments"   element={<Investments />} />   {/* NEW */}
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="savings"       element={<Savings />} />
          <Route path="emergency-calc"element={<EmergencyCalc />} />
          <Route path="projections"   element={<Projections />} />
          <Route path="settings"      element={<Settings />} />
        </Route>

        {/* ---------------- 404 FALLBACK -------------- */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
