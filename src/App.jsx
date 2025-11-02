import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { useAuth } from "./hooks/useAuth.js";

// Pages (all must be default exports)
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Savings from "./pages/Savings.jsx";
import EmergencyCalc from "./pages/EmergencyCalc.jsx";
import Projections from "./pages/Projections.jsx";
import Settings from "./pages/Settings.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

function RequireAuth({ children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/signin" replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const { session } = useAuth();
  if (session) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* PUBLIC AUTH ROUTES */}
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

        {/* PRIVATE ROUTES WITH LAYOUT */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="savings" element={<Savings />} />
          <Route path="emergency-calc" element={<EmergencyCalc />} />
          <Route path="projections>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-center text-slate-400 text-sm mb-4">Or try with</p>
            <div className="space-y-3">
              <button
                onClick={handleDemo}
                disabled={loading}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                🚀 Demo Account
              </button>
              <button
                onClick={handleMaster}
                disabled={loading}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                🔑 Master Login
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <span className="text-2xl mb-2 block">📊</span>
            <p className="text-slate-300 text-sm">Track Expenses</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <span className="text-2xl mb-2 block">💡</span>
            <p className="text-slate-300 text-sm">Smart Insights</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <span className="text-2xl mb-2 block">🎯</span>
            <p className="text-slate-300 text-sm">Set Goals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
