import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { getUserGoals } from "@/lib/queries/goals";
import { getUserHabitsWithStats } from "@/lib/queries/habits";
import { getUserAnalytics } from "@/lib/queries/analytics";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — ProdOS",
  description: "Your unified life operating system — goals, habits, and execution in one command center.",
};

export default async function DashboardPage() {
  // const supabase = createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) redirect("/login");
  const user = { email: "demo@workspace.ai" };

  return (
    <DashboardShell userEmail={user.email}>
      {/* Scanline Effect Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[999] overflow-hidden"
      >
        <div className="w-full h-0.5 bg-white/[0.04] animate-scanline absolute top-0 left-0" />
      </div>

      <div className="prod-container">
        {/* Primary Execution Layer (includes Header with Version switcher) */}
        <Suspense fallback={<div className="h-[400px] animate-pulse bg-white/5 rounded-[2px]" />}>
           <TodayWrapper userEmail={user.email} />
        </Suspense>

        <div id="insights" className="pt-20 pb-10 text-center opacity-10 text-[9px] uppercase font-bold tracking-[0.4em] scroll-mt-24">
           Continuous Improvement Protocol active
        </div>
      </div>
    </DashboardShell>
  );
}

async function TodayWrapper({ userEmail }: { userEmail: string }) {
  const [analytics, goals, habits] = await Promise.all([
    getUserAnalytics(),
    getUserGoals(),
    getUserHabitsWithStats()
  ]);

  return <DashboardContent analytics={analytics} goals={goals} habits={habits} userEmail={userEmail} />;
}
