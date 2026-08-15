/**
 * Direção visual: Arquivo de Serviço Público — alternância clara e discreta, com preferência persistida.
 */
"use client";

import { useEffect, useState } from "react";
import { LocalIcon } from "@/components/local-icon";

type Theme = "light" | "dark";
const storageKey = "datasus-releases-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const resolved = saved === "dark" || saved === "light"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  }

  const nextLabel = theme === "light" ? "Ativar tema escuro" : "Ativar tema claro";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={nextLabel}
    >
      <LocalIcon name={theme === "light" ? "moon" : "sun"} className="h-[18px] w-[18px]" />
      <span className="hidden text-xs font-semibold sm:inline">{theme === "light" ? "Escuro" : "Claro"}</span>
    </button>
  );
}
