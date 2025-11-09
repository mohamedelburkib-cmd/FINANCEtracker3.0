import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Nav from "./Nav.jsx";
import { Menu, X } from "lucide-react";

const LS_UI_SIDEBAR = "ft_ui_sidebar_open";

export default function Layout() {
  const { session, signout } = useAuth();
  const [open, setOpen] = useState(true);           // desktop sidebar
  const [mobile, setMobile] = useState(false);      // mobile slide-over

  useEffect(() => {
    const v = localStorage.getItem(LS_UI_SIDEBAR);
    if (v !== null) setOpen(v === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_UI_SIDEBAR, open ? "1" : "0");
  }, [open]);

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className={`sidebar hidden md:block ${open ? "w-[260px]" : "w-[88px]"} transition-all`}>
        <div className="h-full p-3 flex flex-col">
          <div className={`flex items-center ${open ? "justify-between" : "justify-center"} mb-4`}>
            <Link to="/" className="flex items-center gap-2">
              <div className="text-lg font-bold">FinTrack</div>
            </Link>
            <button className="btn btn-ghost px-2 py-1" onClick={() => setOpen((v) => !v)} title="Toggle sidebar">
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
          <Nav collapsed={!open} />
          <div className="mt-auto pt-3 border-t border-slate-800/60 flex items-center justify-between">
            {!open ? (
              <button className="btn btn-secondary w-full" onClick={signout}>↩</button>
            ) : (
              <>
                <div className="text-xs text-slate-400">@{session?.username}</div>
                <button className="btn btn-secondary" onClick={signout}>Sign out</button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-slate-950/70 border-b border-slate-800/60 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between">
          <button className="btn btn-ghost px-2" onClick={() => setMobile(true)}><Menu size={18} /></button>
          <Link to="/" className="font-bold">FinTrack</Link>
          <div className="text-xs text-slate-400">@{session?.username}</div>
        </div>
      </div>

      {/* Mobile slide-over */}
      {mobile && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobile(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] sidebar p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold">Menu</div>
              <button className="btn btn-ghost px-2" onClick={() => setMobile(false)}><X size={18} /></button>
            </div>
            <Nav collapsed={false} />
            <div className="pt-3 border-t border-slate-800/60">
              <div className="text-xs text-slate-400 mb-2">@{session?.username}</div>
              <button className="btn btn-secondary w-full" onClick={signout}>Sign out</button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="p-4 md:p-8">
        <Outlet />
        <footer className="text-center text-xs text-slate-400 mt-12">
          Data stored locally • Designed for speed
        </footer>
      </main>
    </div>
  );
}
