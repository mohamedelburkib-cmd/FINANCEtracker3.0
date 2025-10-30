import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { useAuth } from "./hooks/useAuth.js";

// Pages
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

export default function App() {
  return (
    <ErrorBoundary>
      {/* Debug tag to confirm React rendered */}
      <div style={{position:'fixed',top:8,left:8,fontSize:10,opacity:.5}}>app mounted</div>

      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private shell */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          {/* If logged in, show dashboard by default */}
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="savings" element={<Savings />} />
          <Route path="calculator" element={<EmergencyCalc />} />
          <Route path="projections" element={<Projections />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallbacks */}
        {/* If logged out and visiting '#/' send to signin */}
        <Route path="" element={<Navigate to="/signin" replace />} />
        {/* Anything else → root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
