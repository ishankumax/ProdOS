import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Sidebar from "@/components/dashboard/Sidebar";
import RightPanel from "@/components/dashboard/RightPanel";
import GoalsSection from "@/components/goals/GoalsSection";
import HabitsSection from "@/components/habits/HabitsSection";
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";
import { getUserGoals } from "@/lib/queries/goals";
import { getUserHabitsWithStats } from "@/lib/queries/habits";
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

  const [goals, habits] = await Promise.all([
    getUserGoals(),
    getUserHabitsWithStats(),
  ]);

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.completed).length;
  const totalHabits = habits.length;
  const bestStreak = habits.length > 0
    ? Math.max(...habits.map(h => h.current_streak))
    : 0;

  return (
    <div className="flex h-dvh bg-surface overflow-hidden">
      {/* 1. Left Sidebar (~20%) */}
      <div className="w-[20%] min-w-[240px] hidden md:block">
        <Sidebar userEmail={user.email} />
      </div>

      {/* 2. Main Content Area (~65%) */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto px-10 py-12 space-y-12">
          {/* Header & Stats */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
              <p className="text-white/40 text-sm mt-2">
                Good to have you back, {user.email?.split('@')[0]}.
              </p>
            </div>

            <div className="flex gap-4">
              {[
                { label: "Goals", val: totalGoals, sub: `${completedGoals} done`, icon: "◎" },
                { label: "Habits", val: totalHabits, sub: "tracking", icon: "⟳" },
                { label: "Streak", val: bestStreak, sub: "days", icon: "↗" }
              ].map(stat => (
                <div key={stat.label} className="flex px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 text-xs">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{stat.val}</p>
                    <p className="text-[10px] text-white/30 truncate">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Weekly Calendar View */}
          <WeeklyCalendar />

          <div className="h-px bg-white/5" />

          {/* Work Area: Goals and Habits */}
          <div className="space-y-16">
            <section id="goals" className="space-y-6">
               <GoalsSection initialGoals={goals} />
            </section>
            
            <section id="habits" className="space-y-6">
               <HabitsSection habits={habits} />
            </section>
          </div>
          
          <div id="insights" className="pt-20 pb-10 text-center opacity-20 text-[10px] uppercase font-bold tracking-[0.2em]">
             End of Feed
          </div>
        </div>
      </main>

      {/* 3. Right Panel (~15%) */}
      <div className="w-[15%] min-w-[200px] hidden xl:block">
        <RightPanel />
      </div>
    </div>
  );
}
