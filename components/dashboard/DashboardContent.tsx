"use client";

import { useVersion } from "@/hooks/use-version";
import TodayExecution from "./TodayExecution";
import TodayExecutionMark2 from "./TodayExecutionMark2";
import { UserAnalytics } from "@/types/analytics";
import { Goal } from "@/types/goals";
import { HabitWithStats } from "@/types/habits";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  analytics: UserAnalytics;
  goals: Goal[];
  habits: HabitWithStats[];
  userEmail?: string;
}

export default function DashboardContent({
  analytics,
  goals,
  habits,
  userEmail,
}: DashboardContentProps) {
  const { version, setVersion } = useVersion();

  return (
    <div className="space-y-8">
      {/* Page Header — Stitch Design with Version Switcher */}
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight font-mono">ProdOS</h1>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-400 font-bold">
              SYSTEM ACTIVE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse block" />
          </div>
          <div className="h-4 w-px bg-white/10 mx-1" />
          
          {/* M1 / M2 Version Toggle Switcher */}
          <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-lg p-0.5 font-mono text-[9px] tracking-tight shrink-0">
            <button
              onClick={() => setVersion("Mark 1")}
              className={cn(
                "px-2 py-1 rounded-md transition-all duration-200 uppercase font-bold",
                version === "Mark 1"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-white/40 hover:text-white/80"
              )}
            >
              Mark 1
            </button>
            <button
              onClick={() => setVersion("Mark 2")}
              className={cn(
                "px-2 py-1 rounded-md transition-all duration-200 uppercase font-bold",
                version === "Mark 2"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-white/40 hover:text-white/80"
              )}
            >
              Mark 2
            </button>
          </div>
        </div>
        <p className="text-white/25 text-[11px] font-mono uppercase tracking-widest hidden md:block">
          {userEmail?.split("@")?.[0] ?? "User"}_session
        </p>
      </section>

      {/* Conditionally Render Mark 1 vs Mark 2 Dashboard View */}
      {version === "Mark 1" ? (
        <TodayExecution analytics={analytics} goals={goals} habits={habits} />
      ) : (
        <TodayExecutionMark2 analytics={analytics} goals={goals} habits={habits} />
      )}
    </div>
  );
}
