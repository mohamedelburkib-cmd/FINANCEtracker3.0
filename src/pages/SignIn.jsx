import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function SignIn() {
  const { signin, ensureDemo, masterLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signin({ username, password });
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    setLoading(true);
    try {
      await ensureDemo();
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMaster() {
    setLoading(true);
    try {
      await masterLogin();
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">FinanceTracker</h1>
          <p className="text-slate-300">Take control of your finances</p>
        </div>

        {/* Main Card */}
        <div className="card bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {err && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {err}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                autoComplete="username"
                disabled={loading}
                className="input bg-slate-900 border-slate-600 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                className="input bg-slate-900 border-slate-600 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={handleDemo}
            disabled={loading}
            className="card bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 hover:border-green-500/50 p-4 text-center transition-all"
          >
            <span className="text-2xl mb-2 block">🚀</span>
            <span className="text-green-400 font-medium">Demo Account</span>
          </button>
          <button
            onClick={handleMaster}
            disabled={loading}
            className="card bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-500/30 hover:border-orange-500/50 p-4 text-center transition-all"
          >
            <span className="text-2xl mb-2 block">👑</span>
            <span className="text-orange-400 font-medium">Master Login</span>
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Local-only authentication • No data leaves your device
        </p>
      </div>
    </div>
  );
}
