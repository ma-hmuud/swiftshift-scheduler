"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "swift-shift-theme";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialTheme: Theme = saved === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const switchTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  if (!mounted) {
    return <div className="h-11 w-20" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={switchTheme}
      className="theme-switch"
      aria-label="Toggle light and dark mode"
      aria-pressed={theme === "dark"}
    >
      <span className="theme-switch-track">
        <span
          className={`theme-switch-thumb ${theme === "dark" ? "is-dark" : ""}`}
        >
          {theme === "dark" ? "N" : "L"}
        </span>
      </span>
      <span className="theme-switch-text">
        {theme === "dark" ? "Night" : "Light"}
      </span>
    </button>
  );
}
