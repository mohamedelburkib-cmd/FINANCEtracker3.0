import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const { signin, ensureDemo, masterLogin } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await signin({ username, password });
      nav("/");
    } catch (error) {
      setErr(error.message || "Error");
    }
  }

  async function useDemo() {
    setErr("");
    await ensureDemo();
    nav("/");
  }

  async function useMaster() {
    setErr("");
    masterLogin();
    nav("/");
  }

  return (
    <div className="max-w-md mx-auto mt-24 card">
      <h1 className="text-2xl font-bold mb-2">Sign in</h1>
      <p className="text-sm text-slate-300 mb-4">
        Local-only auth (username + password). You can also use the demo or master login.
      </p>
      {err && <div className="text-sm text-red-300 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-slate-300">Username</label>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="your username"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-300">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        <button className="btn btn-primary w-full" type="submit">
          Sign in
        </button>
      </form>

      <div className="mt-3 flex gap-2 flex-wrap items-center">
        <button className="btn btn-secondary" onClick={useDemo} type="button">
          Use demo user
        </button>
        <button className="btn btn-ghost" onClick={useMaster} type="button">
          Master login
        </button>
        <div className="ml-auto text-sm">
          No account?{" "}
          <Link className="text-indigo-400 hover:underline" to="/signup">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
