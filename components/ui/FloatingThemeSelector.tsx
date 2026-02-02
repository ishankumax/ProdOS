"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const theme = localStorage.getItem("prod_os_theme") || "default";
    setActiveTheme(theme);
  }, []);

  const changeTheme = (themeName: string) => {
    setActiveTheme(themeName);
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("prod_os_theme", themeName);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center h-12 overflow-hidden cursor-default select-none transition-all duration-500 ease-out rounded-full border backdrop-blur-md",
        "bg-surface-raised/80 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        "hover:border-brand-500/30",
        isHovered ? "w-[300px]" : "w-12"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 pl-4 pr-12 transition-all duration-300 w-full justify-between",
          isHovered ? "opacity-100 pointer-events-auto delay-100" : "opacity-0 pointer-events-none"
        )}
      >
        {THEMES.map((themeOpt) => (
          <button
            key={themeOpt.name}
            onClick={() => changeTheme(themeOpt.name)}
            title={themeOpt.title}
            className={cn(
              "flex items-center gap-1 px-1.5 py-1 rounded transition-all duration-200 border font-mono text-[9px] font-bold active:scale-95",
              activeTheme === themeOpt.name
                ? "border-brand-500/30 bg-brand-500/10 text-brand-400"
                : "border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full shadow-sm", themeOpt.color)} />
            {themeOpt.label}
          </button>
        ))}
      </div>

      <div className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center cursor-pointer pointer-events-none text-white/60">
        <span className="text-base font-mono leading-none text-white/40">
          ❖
        </span>
      </div>
    </div>
  );
}
