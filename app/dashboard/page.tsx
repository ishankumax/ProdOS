import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import LogoutButton from "@/components/LogoutButton";
import GoalsSection from "@/components/goals/GoalsSection";
import { getUserGoals } from "@/lib/queries/goals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Productivity OS",
};

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch goals server-side — RLS ensures only this user's data
  const goals = await getUserGoals();

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.completed).length;

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Dashboard Navbar */}
      <header className="border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-surface/80">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
            P
          </span>
          <span className="text-sm font-semibold text-white">
            Productivity OS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 hidden sm:block">
            {user.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      {/* Dashboard body */}
      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full space-y-10">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">
            Good to have you back. What are we executing today?
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Goals",
              count: totalGoals > 0 ? String(totalGoals) : "—",
              sub: completedGoals > 0 ? `${completedGoals} done` : "none yet",
              icon: "◎",
            },
            { label: "Habits", count: "—", sub: "coming soon", icon: "⟳" },
            { label: "Streak", count: "—", sub: "coming soon", icon: "↗" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-3"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-300 text-base">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{item.count}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.label}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/8" />

        {/* Goals section */}
        <GoalsSection initialGoals={goals} />
      </main>
    </div>
  );
}
