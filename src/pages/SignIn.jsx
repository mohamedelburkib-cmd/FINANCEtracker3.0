import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function SignIn() {
  const { signin, demo } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = fd.get("username").trim();
    const password = fd.get("password").trim();
    const res = signin(username, password);
    if (res.ok) nav("/");
    else setError(res.error || "Login failed");
  }

  return (
    <div className="h-full grid place-items-center">
      <div className="card max-w-md w-full">
        <h1 className="text-xl font-semibold mb-2">Sign in</h1>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Local-only auth (username + password).
        </p>
        {error && <div className="mb-3 text-rose-600 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="username" className="input" placeholder="Username" required />
          <input name="password" type="password" className="input" placeholder="Password" required />
          <button className="btn btn-primary w-full" type="submit">Sign in</button>
        </form>
        <div className="flex items-center justify-between mt-3">
          <button className="btn btn-secondary" onClick={() => { demo(); nav("/"); }}>
            Use demo user
          </button>
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            No account? <Link to="/signup" className="underline">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
