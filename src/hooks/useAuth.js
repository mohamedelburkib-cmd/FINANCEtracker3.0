import { useLocalStorage } from "./useLocalStorage.js";

// tiny hash (not for production)
async function digest(text) {
  try {
    if (crypto?.subtle && location.protocol === "https:") {
      const enc = new TextEncoder().encode(text);
      const buf = await crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
    }
  } catch {}
  let h = 0; for (let i=0;i<text.length;i++) h = (h*31 + text.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

// keep keys simple and stable
const LS_USERS   = "ft_users";
const LS_SESSION = "ft_session";

export function useAuth() {
  const [users, setUsers] = useLocalStorage(LS_USERS, []);
  const [session, setSession] = useLocalStorage(LS_SESSION, null);

  async function signup({ username, password }) {
    const uname = username.trim().toLowerCase();
    if (!uname) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");
    if (users.find(u => u.username === uname)) throw new Error("Username taken");

    const passwordHash = await digest(password);
    const user = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      username: uname,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, user]);
    setSession({ userId: user.id, username: user.username });
  }

  async function signin({ username, password }) {
    const uname = username.trim().toLowerCase();
    const u = users.find(u => u.username === uname);
    if (!u) throw new Error("User not found");
    const hash = await digest(password);
    if (hash !== u.passwordHash) throw new Error("Invalid password");
    setSession({ userId: u.id, username: u.username });
  }

  function signout() { setSession(null); }

  // dev helper: seed demo user
  async function ensureDemo() {
    const uname = "demo";
    if (!users.find(u => u.username === uname)) {
      const passwordHash = await digest("demo");
      const user = { id: crypto.randomUUID?.() ?? Date.now().toString(), username: uname, passwordHash, createdAt: new Date().toISOString() };
      setUsers([...users, user]);
    }
    const u = users.find(u => u.username === uname) || { id: "pending", username: "demo" };
    setSession({ userId: u.id, username: u.username });
  }

  return { users, session, signup, signin, signout, ensureDemo };
}
