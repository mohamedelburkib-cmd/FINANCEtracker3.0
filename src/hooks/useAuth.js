import { useLocalStorage } from "./useLocalStorage.js";

/** ── Master login (change these anytime) ─────────────────────────── */
const MASTER_USERNAME = "owner";      // you can edit this
const MASTER_PASSWORD = "tracker!";   // you can edit this
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

// helper: wait one tick (lets React commit state before we continue)
const nextTick = () => new Promise((r) => setTimeout(r, 0));

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
      createdAt: ne
