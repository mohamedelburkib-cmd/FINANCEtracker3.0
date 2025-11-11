import { useEffect, useState } from "react";

const LS_USERS = "ft_users";
const LS_SESSION = "ft_session";
const MASTER = { username: "demo", password: "demo" }; // fallback login

function getUsers() {
  try {
    const v = localStorage.getItem(LS_USERS);
    return v ? JSON.parse(v) : [MASTER];
  } catch {
    return [MASTER];
  }
}

export function useAuth() {
  const [session, setSession] = useState(() => {
    try {
      const v = localStorage.getItem(LS_SESSION);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) localStorage.setItem(LS_SESSION, JSON.stringify(session));
    else localStorage.removeItem(LS_SESSION);
  }, [session]);

  function signin(username, password) {
    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setSession({ username: found.username });
      return { ok: true };
    }
    return { ok: false, error: "Invalid credentials" };
  }

  function signup(username, password) {
    const users = getUsers();
    if (users.some(u => u.username === username)) {
      return { ok: false, error: "Username already exists" };
    }
    users.push({ username, password });
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    setSession({ username });
    return { ok: true };
  }

  function signout() {
    setSession(null);
  }

  // convenience for tests
  function demo() {
    setSession({ username: MASTER.username });
  }

  return { session, signin, signup, signout, demo };
}
