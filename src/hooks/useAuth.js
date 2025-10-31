import { useLocalStorage } from "./useLocalStorage.js";

/** Simple hash (not for production security) */
async function digest(text) {
  try {
    if (crypto?.subtle && location.protocol === "https:") {
      const enc = new TextEncoder().encode(text);
      const buf = await crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
    }
  } catch {}
  let h = 0; for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

const LS_USERS = "ft_users_v4";      // username-based
const LS_SESSION = "ft_session_v4";  // { userId, username }

/** MIGRATION from v3 (email-based) if present */
function migrateUsersIfNeeded() {
  try {
    const v4 = localStorage.getItem(LS_USERS);
    if (v4) return; // already v4
    const v3 = localStorage.getItem("ft_users_v3");
    if (!v3) return;
    const usersV3 = JSON.parse(v3) || [];
    const usersV4 = usersV3.map(u => ({
      id: u.id,
      username: (u.email || "").split("@")[0]?.trim().toLowerCase() || "user",
      passwordHash: u.passwordHash,
      createdAt: u.createdAt,
    }));
    localStorage.setItem(LS_USERS, JSON.stringify(usersV4));
  } catch {}
}

export function useAuth() {
  migrateUsersIfNeeded();

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

  function signout() {
    setSession(null);
  }

  return { users, session, signup, signin, signout };
}
