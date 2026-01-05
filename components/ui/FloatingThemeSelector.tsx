"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const THEMES = [
  { name: "default", label: "NOR", color: "bg-indigo-500", title: "Nordic Blue (Default)" },
  { name: "amber", label: "AMB", color: "bg-amber-500", title: "Cyberpunk Amber" },
  { name: "green", label: "MAT", color: "bg-emerald-500", title: "Matrix Green" },
  { name: "rose", label: "DRC", color: "bg-rose-500", title: "Dracula Rose" },
  { name: "mono", label: "GHO", color: "bg-zinc-400", title: "Ghost Monochrome" },
];

export default function FloatingThemeSelector() {
  const [activeTheme, setActiveTheme] = useState<string>("default");
  const [isHovered, setIsHovered] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 400); // 400ms delay for visual forgiveness
  };

  useEffect(() => {
    // Initial load from localStorage
    const theme = localStorage.getItem("prod_os_theme") || "default";
    setActiveTheme(theme);

    // Sync theme if changed elsewhere
    const handleThemeChange = (e: CustomEvent<string>) => {
      setActiveTheme(e.detail);
    };

    window.addEventListener("theme-change", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange as EventListener);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const changeTheme = (themeName: string) => {
    setActiveTheme(themeName);
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("prod_os_theme", themeName);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("theme-change", { detail: themeName }));
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col justify-end items-center w-12 overflow-hidden cursor-default select-none transition-all duration-500 ease-out rounded-full border backdrop-blur-md",
        "bg-surface-raised/80 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        "hover:border-brand-500/30 hover:shadow-[0_0_20px_rgba(var(--brand-500-rgb),0.15)]",
        isHovered ? "h-[268px]" : "h-12"
      )}
    >
      {/* Expanded Theme Selection Stack */}
      <div
        className={cn(
          "absolute top-3 flex flex-col items-center gap-1.5 transition-all duration-300 w-full",
          isHovered ? "opacity-100 pointer-events-auto delay-100" : "opacity-0 pointer-events-none"
        )}
      >
        {THEMES.map((themeOpt) => (
          <button
            key={themeOpt.name}
            onClick={() => changeTheme(themeOpt.name)}
            title={themeOpt.title}
            className={cn(
              "flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 border font-mono text-[9px] tracking-tighter active:scale-95 shrink-0",
              activeTheme === themeOpt.name
                ? "border-brand-500/30 bg-brand-500/10 text-brand-400 shadow-[0_0_8px_rgba(var(--brand-500-rgb),0.1)]"
                : "border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full mb-0.5 shadow-sm", themeOpt.color)} />
            {themeOpt.label}
          </button>
        ))}
      </div>

      {/* Trigger Dot / Icon - Shows active theme abbreviation in its color */}
      {(() => {
        const currentTheme = THEMES.find((t) => t.name === activeTheme) || THEMES[0];
        return (
          <div className="w-12 h-12 flex items-center justify-center cursor-pointer pointer-events-none shrink-0 select-none">
            <span className="text-[10px] font-bold text-brand-400 tracking-wider font-mono uppercase">
              {currentTheme.label}
            </span>
          </div>
        );
      })()}
    </div>
  );
}
