import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await signup({ email, password });
      nav("/");
    } catch (error) {
      setErr(error.message || "Error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 card">
      <h1 className="text-2xl font-bold mb-2">Create account</h1>
      <p className="text-sm text-slate-300 mb-4">
        Local-only auth using your browser storage.
      </p>
      {err && <div className="text-sm text-red-300 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-slate-300">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
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
          />
        </div>
        <button className="btn btn-primary w-full" type="submit">
          Sign up
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        Have an account?{" "}
        <Link className="text-indigo-400 hover:underline" to="/signin">
          Sign in
        </Link>
      </div>
    </div>
  );
}
