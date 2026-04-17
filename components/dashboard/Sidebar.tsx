"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const NAV_ITEMS = [
  { label: "Goals", icon: "◎", href: "#goals" },
  { label: "Habits", icon: "⟳", href: "#habits" },
  { label: "Insights", icon: "↗", href: "#insights" },
];

const FILTERS = ["All", "Daily", "Weekly", "Monthly"];

export default function Sidebar({ userEmail }: { userEmail?: string }) {
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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all group"
            >
              <span className="text-lg opacity-40 group-hover:opacity-100">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">
            Quick Filters
          </p>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              {filter}
              <span className="text-[10px] opacity-20">→</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="px-3 py-2">
          <p className="text-[10px] text-white/30 truncate">{userEmail}</p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
