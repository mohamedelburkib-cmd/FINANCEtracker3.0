import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { AnimatePresence, motion } from "framer-motion";

import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Savings from "./pages/Savings.jsx";
import EmergencyCalc from "./pages/EmergencyCalc.jsx";
import Projections from "./pages/Projections.jsx";
import Settings from "./pages/Settings.jsx";
import Investments from "./pages/Investments.jsx";
import Goals from "./pages/Goals.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

function RequireAuth({ children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/signin" replace />;
  return children;
}
function Page({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="space-y-4">
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/signin" element={<Page><SignIn /></Page>} />
          <Route path="/signup" element={<Page><SignUp /></Page>} />

          {/* Private */}
          <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<Page><Dashboard /></Page>} />
            <Route path="transactions" element={<Page><Transactions /></Page>} />
            <Route path="subscriptions" element={<Page><Subscriptions /></Page>} />
            <Route path="savings" element={<Page><Savings /></Page>} />
            <Route path="calculator" element={<Page><EmergencyCalc /></Page>} />
            <Route path="projections" element={<Page><Projections /></Page>} />
            <Route path="investments" element={<Page><Investments /></Page>} />
            <Route path="goals" element={<Page><Goals /></Page>} />
            <Route path="settings" element={<Page><Settings /></Page>} />
          </Route>

          <Route path="" element={<Navigate to="/signin" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
