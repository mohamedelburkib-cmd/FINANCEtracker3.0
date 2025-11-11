import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function SignUp() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = fd.get("username").trim();
    const password = fd.get("password").trim();
    const res = signup(username, password);
    if (res.ok) nav("/");
    else setError(res.error || "Signup failed");
  }

  return (
    <div className="h-full grid place-items-center">
      <div className="card max-w-md w-full">
        <h1 className="text-xl font-semibold mb-2">Create account</h1>
        {error && <div className="mb-3 text-rose-600 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="username" className="input" placeholder="Username" required />
          <input name="password" type="password" className="input" placeholder="Password" required />
          <button className="btn btn-primary w-full" type="submit">Create</button>
        </form>
        <div className="text-sm mt-3" style={{ color: "var(--muted)" }}>
          Have an account? <Link to="/signin" className="underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
