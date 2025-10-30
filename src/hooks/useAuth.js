import { useLocalStorage } from "./useLocalStorage.js";

// lightweight digest: crypto.subtle in https, fallback for dev
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

const LS_USERS = "ft_users_v3";
const LS_SESSION = "ft_session_v3";

export function useAuth() {
  const [users, setUsers] = useLocalStorage(LS_USERS, []);
  const [session, setSession] = useLocalStorage(LS_SESSION, null);

  async function signup({ email, password }) {
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
      throw new Error("Email already registered");
    const passwordHash = await digest(password);
    const user = { id: crypto.randomUUID?.() ?? Date.now() + "", email, passwordHash, createdAt: new Date().toISOString() };
    setUsers([...users, user]);
    setSession({ userId: user.id, email: user.email });
  }

  async function signin({ email, password }) {
    const u = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!u) throw new Error("User not found");
    const hash = await digest(password);
    if (hash !== u.passwordHash) throw new Error("Invalid password");
    setSession({ userId: u.id, email: u.email });
  }

  function signout() {
    setSession(null);
  }

  return { users, session, signup, signin, signout };
}
