// src/components/Layout.jsx
import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Nav from "./Nav.jsx";
import { Menu, X, Sun, Moon, SlidersHorizontal } from "lucide-react";
import { useTheme } from "../hooks/useTheme.js";

const LS_UI_SIDEBAR = "ft_ui_sidebar_open";

export default function Layout() {
  const { session, signout } = useAuth();
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const { theme, toggle, custom, updateCustom, resetCustom } = useTheme();

  useEffect(() => {
    const v = localStorage.getItem(LS_UI_SIDEBAR);
    if (v !== null) setOpen(v === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_UI_SIDEBAR, open ? "1" : "0");
  }, [open]);

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-0">
      {/* Sidebar (desktop) */}
      <aside className={`hidden md:block sidebar ${open ? "w-[260px]" : "w-[88px]"} transition-all`}>
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
          <div className="mt-auto pt-3 flex items-center justify-between">
            {!open ? (
              <button className="btn btn-secondary w-full" onClick={signout}>↩</button>
            ) : (
              <>
                <div className="text-xs" style={{color:"var(--muted)"}}>@{session?.username}</div>
                <button className="btn btn-secondary" onClick={signout}>Sign out</button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 glass border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <button className="btn btn-ghost px-2" onClick={() => setMobile(true)}><Menu size={18} /></button>
          <Link to="/" className="font-bold">FinTrack</Link>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost px-2" onClick={toggle} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}
            </button>
            <button className="btn btn-ghost px-2" onClick={() => setShowTheme(true)} title="Theme settings">
              <SlidersHorizontal size={18}/>
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="p-4 md:p-8">
        {/* Top actions (desktop) */}
        <div className="hidden md:flex justify-end mb-4 gap-2">
          <button className="btn btn-ghost" onClick={toggle}>
            {theme === "light" ? <><Moon size={16}/> Dark</> : <><Sun size={16}/> Light</>}
          </button>
          <button className="btn btn-secondary" onClick={() => setShowTheme(true)}>
            <SlidersHorizontal size={16}/> Customize
          </button>
        </div>

        <Outlet />
        <footer className="text-center text-xs mt-12" style={{color:"var(--muted)"}}>
          Data stored locally • Designed for speed
        </footer>
      </main>

      {/* Mobile slide-over */}
      {mobile && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobile(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] glass p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold">Menu</div>
              <button className="btn btn-ghost px-2" onClick={() => setMobile(false)}><X size={18} /></button>
            </div>
            <Nav collapsed={false} />
            <div className="pt-3">
              <div className="text-xs mb-2" style={{color:"var(--muted)"}}>@{session?.username}</div>
              <button className="btn btn-secondary w-full" onClick={signout}>Sign out</button>
            </div>
          </div>
        </div>
      )}

      {/* Theme customization modal */}
      {showTheme && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTheme(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="card max-w-lg w-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Customize Theme</h3>
                <button className="btn btn-ghost" onClick={() => setShowTheme(false)}><X size={18}/></button>
              </div>
              <div className="space-y-3">
                <label className="block">
                  <div className="text-sm" style={{color:"var(--muted)"}}>Brand hue ({custom.brandHue})</div>
                  <input type="range" min="0" max="360" value={custom.brandHue}
                    onChange={(e)=>updateCustom({brandHue:Number(e.target.value)})} className="w-full"/>
                </label>
                <label className="block">
                  <div className="text-sm" style={{color:"var(--muted)"}}>Glass blur ({custom.blur}px)</div>
                  <input type="range" min="4" max="20" value={custom.blur}
                    onChange={(e)=>updateCustom({blur:Number(e.target.value)})} className="w-full"/>
                </label>
                <label className="block">
                  <div className="text-sm" style={{color:"var(--muted)"}}>Glass transparency ({custom.glassAlpha})</div>
                  <input type="range" step="0.01" min="0.04" max="0.3" value={custom.glassAlpha}
                    onChange={(e)=>updateCustom({glassAlpha:Number(e.target.value)})} className="w-full"/>
                </label>
                <div className="flex gap-2 pt-2">
                  <button className="btn btn-secondary" onClick={resetCustom}>Reset</button>
                  <button className="btn btn-primary" onClick={()=>setShowTheme(false)}>Done</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
