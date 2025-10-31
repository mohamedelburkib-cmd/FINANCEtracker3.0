import { useLocalStorage } from "./useLocalStorage.js";

/** ── Master login (change these anytime) ─────────────────────────── */
const MASTER_USERNAME = "owner";      // <- you can change
const MASTER_PASSWORD = "tracker!";   // <- you can change
/** ────────────────────────────────────────────────────────────────── */

/** Tiny hash (only to avoid storing raw passwords; NOT real security) */
async function digest(text) {
  try {
    if (crypto?.subtle && location.protocol === "https:") {
      const enc = new TextEncoder().encode(text);
      const buf = await crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch {}
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

const LS_USERS = "ft_users";
const LS_SESSION = "ft_session";

export function useAuth() {
  const [users, setUsers] = useLocalStorage(LS_USERS, []);
  const [session, setSession] = useLocalStorage(LS_SESSION, null);

  async function signup({ username, password }) {
    const uname = username.trim().toLowerCase();
    if (!uname) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");
    if (users.find((u) => u.username === uname)) throw new Error("Username taken");

    const passwordHash = await digest(password);
    const user = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      username: uname,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, user]);
    setSession({ userId: user.id, username: user.username });
  }

  async function signin({ username, password }) {
    const uname = username.trim().toLowerCase();

    // Master login bypass
    if (uname === MASTER_USERNAME && password === MASTER_PASSWORD) {
      setSession({ userId: "master", username: MASTER_USERNAME });
      return;
    }

    const u = users.find((u) => u.username === uname);
    if (!u) throw new Error("User not found");
    const hash = await digest(password);
    if (hash !== u.passwordHash) throw new Error("Invalid password");
    setSession({ userId: u.id, username: u.username });
  }

  function signout() {
    setSession(null);
  }

  // Seed a demo user and log into it (robust against async state)
  async function ensureDemo() {
    const uname = "demo";
    let existing = users.find((u) => u.username === uname);
    if (!existing) {
      const passwordHash = await digest("demo");
      const user = {
        id: crypto.randomUUID?.() ?? Date.now().toString(),
        username: uname,
        passwordHash,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => {
        // return new array and also update `existing` in this closure
        const next = [...prev, user];
        existing = user;
        return next;
      });
    }
    // Use the existing/newly-created user
    const u = existing || users.find((x) => x.username === uname);
    setSession({ userId: u?.id ?? "demo", username: uname });
  }

  // Explicit master login from UI (no form)
  function masterLogin() {
    setSession({ userId: "master", username: MASTER_USERNAME });
  }

  return {
    users,
    session,
    signup,
    signin,
    signout,
    ensureDemo,
    masterLogin,
  };
}
