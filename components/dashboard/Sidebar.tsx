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
    <div className="flex items-center gap-3 sm:gap-4 md:gap-6 px-4 prod-dock">
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
              className={cn("group", isActive ? "prod-nav-link-active" : "prod-nav-link")}
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
          className={cn("group", pathname === "/projects/finance-os" ? "prod-nav-link-active" : "prod-nav-link")}
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
          className={cn("group", pathname === "/projects/investments" ? "prod-nav-link-active" : "prod-nav-link")}
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
        className="prod-badge"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500 shrink-0"></span>
        </span>
        <span className="hidden sm:inline">Active</span>
      </div>
    </div>
  );
}
