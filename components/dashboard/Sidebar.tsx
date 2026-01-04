"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "⊞", href: "/dashboard" },
  { label: "Goals", icon: "◎", href: "/dashboard#goals" },
  { label: "Habits", icon: "⟳", href: "/dashboard#habits" },
  { label: "Insights", icon: "↗", href: "/dashboard#insights" },
];

export default function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const [activeTheme, setActiveTheme] = useState<string>("default");

  useEffect(() => {
    const theme = localStorage.getItem("prod_os_theme") || "default";
    setActiveTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);

    const handleThemeChange = (e: CustomEvent<string>) => {
      setActiveTheme(e.detail);
    };

    window.addEventListener("theme-change", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange as EventListener);
    };
  }, []);

  const changeTheme = (themeName: string) => {
    setActiveTheme(themeName);
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("prod_os_theme", themeName);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: themeName }));
  };

  return (
    <aside className="w-full h-full flex flex-col bg-surface border-r border-white/5 sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
          P
        </div>
        <span className="font-bold text-white tracking-tight">Prod OS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href.startsWith("/dashboard#") && pathname === "/dashboard");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  isActive 
                    ? "text-brand-400 bg-brand-500/5 border border-brand-500/10" 
                    : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <span className={cn(
                  "text-lg transition-opacity",
                  isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                )}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">
            Protocols
          </p>
          <Link
            href="/projects/finance-os"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              pathname === "/projects/finance-os"
                ? "text-brand-400 bg-brand-500/5 border border-brand-500/10"
                : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            <span className={cn(
              "text-lg transition-opacity",
              pathname === "/projects/finance-os" ? "opacity-100" : "opacity-40 group-hover:opacity-100"
            )}>＄</span>
            Finance OS
          </Link>
          <Link
            href="/projects/investments"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              pathname === "/projects/investments"
                ? "text-brand-400 bg-brand-500/5 border border-brand-500/10"
                : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            <span className={cn(
              "text-lg transition-opacity",
              pathname === "/projects/investments" ? "opacity-100" : "opacity-40 group-hover:opacity-100"
            )}>⎋</span>
            Investment OS
          </Link>
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">
            System Integrity
          </p>
          <div className="mx-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2 font-mono">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/20 uppercase tracking-tighter">Heartbeat</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-brand-400 font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/20 uppercase tracking-tighter">Latency</span>
              <span className="text-emerald-400/80 uppercase">12ms</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">
            System Interface
          </p>
          <div className="mx-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-3 font-mono">
            <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2">
              <span className="text-white/20 uppercase tracking-tighter">Protocol</span>
              <span className="text-brand-400 font-bold uppercase tracking-wider">
                {activeTheme === 'default' ? 'Nordic' : activeTheme}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-0.5">
              {[
                { name: "default", label: "NOR", color: "bg-indigo-500", title: "Nordic Blue (Default)" },
                { name: "amber", label: "AMB", color: "bg-amber-500", title: "Cyberpunk Amber" },
                { name: "green", label: "MAT", color: "bg-emerald-500", title: "Matrix Green" },
                { name: "rose", label: "DRC", color: "bg-rose-500", title: "Dracula Rose" },
                { name: "mono", label: "GHO", color: "bg-zinc-400", title: "Ghost Monochrome" },
              ].map((themeOpt) => (
                <button
                  key={themeOpt.name}
                  onClick={() => changeTheme(themeOpt.name)}
                  title={themeOpt.title}
                  className={cn(
                    "flex flex-col items-center justify-center p-1.5 rounded border transition-all font-sans text-[9px] font-medium tracking-wider uppercase",
                    activeTheme === themeOpt.name
                      ? "border-brand-500/40 bg-brand-500/10 text-brand-400"
                      : "border-white/5 bg-white/[0.01] text-white/30 hover:text-white/60 hover:bg-white/5"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full mb-1", themeOpt.color)} />
                  {themeOpt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* User / Logout - Disabled for dev */}
      <div className="p-4 border-t border-white/5 opacity-20 pointer-events-none">
        <p className="text-[10px] text-white/30 uppercase tracking-widest px-3">Dev Mode Active</p>
      </div>
    </aside>
  );
}
