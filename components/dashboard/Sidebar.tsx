"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "⊞", href: "/dashboard" },
  { label: "Goals", icon: "◎", href: "/dashboard#goals" },
  { label: "Habits", icon: "⟳", href: "/dashboard#habits" },
  { label: "Insights", icon: "↗", href: "/dashboard#insights" },
];

export default function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3 sm:gap-4 md:gap-6 px-4 py-2.5 rounded-full border backdrop-blur-md bg-surface-raised/85 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-brand-500/20 transition-all duration-300 pointer-events-auto">
      {/* Brand Icon & Label */}
      <div className="flex items-center gap-2 select-none">
        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.3)]">
          P
        </div>
        <span className="font-bold text-xs text-white tracking-tight hidden lg:inline">ProdOS</span>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-white/10" />

      {/* Core Pages Section */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href.startsWith("/dashboard#") && pathname === "/dashboard");
          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all group font-mono whitespace-nowrap",
                isActive 
                  ? "text-brand-400 bg-brand-500/10 border border-brand-500/20 shadow-[0_0_8px_rgba(var(--brand-500-rgb),0.1)]" 
                  : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <span className={cn(
                "text-sm transition-opacity",
                isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100"
              )}>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-5 w-px bg-white/10" />

      {/* Protocols Section */}
      <div className="flex items-center gap-1">
        <Link
          href="/projects/finance-os"
          title="Finance OS"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all group font-mono whitespace-nowrap",
            pathname === "/projects/finance-os"
              ? "text-brand-400 bg-brand-500/10 border border-brand-500/20 shadow-[0_0_8px_rgba(var(--brand-500-rgb),0.1)]"
              : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
          )}
        >
          <span className={cn(
            "text-sm transition-opacity",
            pathname === "/projects/finance-os" ? "opacity-100" : "opacity-40 group-hover:opacity-100"
          )}>＄</span>
          <span className="hidden md:inline">Finance OS</span>
        </Link>
        <Link
          href="/projects/investments"
          title="Investment OS"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all group font-mono whitespace-nowrap",
            pathname === "/projects/investments"
              ? "text-brand-400 bg-brand-500/10 border border-brand-500/20 shadow-[0_0_8px_rgba(var(--brand-500-rgb),0.1)]"
              : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
          )}
        >
          <span className={cn(
            "text-sm transition-opacity",
            pathname === "/projects/investments" ? "opacity-100" : "opacity-40 group-hover:opacity-100"
          )}>⎋</span>
          <span className="hidden md:inline">Investment OS</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-white/10" />

      {/* Heartbeat Integrity Status */}
      <div 
        title={`Operational Status: Active | User: ${userEmail ?? "Guest"}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.01] border border-white/5 font-mono text-[9px] shrink-0 select-none"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
        </span>
        <span className="text-brand-400 font-bold uppercase tracking-wider hidden sm:inline">Active</span>
      </div>
    </div>
  );
}
