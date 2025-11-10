// src/hooks/useTheme.js
import { useEffect, useState } from "react";

const LS_THEME = "ft_ui_theme"; // 'light' | 'dark'
const LS_CUSTOM = "ft_ui_custom"; // {brandHue:number, blur:number, glassAlpha:number}

const defaultCustom = { brandHue: 238, blur: 8, glassAlpha: 0.08 };

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(LS_THEME) || "light");
  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_CUSTOM)) || defaultCustom; }
    catch { return defaultCustom; }
  });

  useEffect(() => {
    localStorage.setItem(LS_THEME, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LS_CUSTOM, JSON.stringify(custom));
    const root = document.documentElement.style;
    root.setProperty("--brand-hue", custom.brandHue);
    root.setProperty("--glass-blur", `${custom.blur}px`);
    root.setProperty("--glass-alpha", custom.glassAlpha);
  }, [custom]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const updateCustom = (partial) => setCustom((c) => ({ ...c, ...partial }));
  const resetCustom = () => setCustom(defaultCustom);

  return { theme, toggle, custom, updateCustom, resetCustom };
}
