import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";
import TodayExecution from "@/components/dashboard/TodayExecution";
import { getUserGoals } from "@/lib/queries/goals";
import { getUserHabitsWithStats } from "@/lib/queries/habits";
import { getUserAnalytics } from "@/lib/queries/analytics";
import { Suspense } from "react";
import { CalendarSkeleton } from "@/components/skeletons/DashboardSkeletons";
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

  return (
    <DashboardShell userEmail={user.email}>
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-12 space-y-20">
        {/* Header Area */}
        <section>
           <h1 className="text-3xl font-bold text-white tracking-tight">System Identity</h1>
           <p className="text-white/40 text-sm mt-1">
              Operational status for {user.email?.split("@")?.[0] ?? "User"}.
           </p>
        </section>

        {/* Primary Execution Layer */}
        <Suspense fallback={<div className="h-[400px] animate-pulse bg-white/5 rounded-3xl" />}>
           <TodayWrapper />
        </Suspense>

        <div className="h-px bg-white/5" />

        {/* Weekly Context View */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Weekly Context</h2>
            <p className="text-xs text-white/30 mt-1">Reviewing current momentum and upcoming commitments.</p>
          </div>
          <Suspense fallback={<CalendarSkeleton />}>
             <WeeklyCalendar />
          </Suspense>
        </div>

        <div id="insights" className="pt-20 pb-10 text-center opacity-10 text-[9px] uppercase font-bold tracking-[0.4em]">
           Continuous Improvement Protocol active
        </div>
      </div>
    </DashboardShell>
  );
}

async function TodayWrapper() {
  const [analytics, goals, habits] = await Promise.all([
    getUserAnalytics(),
    getUserGoals(),
    getUserHabitsWithStats()
  ]);

  return <TodayExecution analytics={analytics} goals={goals} habits={habits} />;
}
