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
            System Identity
          </p>
          <div className="mx-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/20 uppercase tracking-tighter">Status</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-brand-400 font-bold uppercase">Online</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/20 uppercase tracking-tighter">Runtime</span>
              <span className="text-white/40 uppercase">Prod OS V1.0.4</span>
            </div>
          </div>
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
