"use client";

import { UserAnalytics } from "@/types/analytics";
import { Goal } from "@/types/goals";
import { HabitWithStats } from "@/types/habits";

interface TodayExecutionMark2Props {
  analytics: UserAnalytics;
  goals: Goal[];
  habits: HabitWithStats[];
}

export default function TodayExecutionMark2({ analytics, goals, habits }: TodayExecutionMark2Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.01]">
      <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 font-mono font-bold text-sm mb-4 animate-pulse">
        M2
      </div>
      <h3 className="text-md font-bold font-mono text-white uppercase tracking-wider mb-2">
        Mark 2 Architecture Void
      </h3>
      <p className="text-xs text-white/40 max-w-sm">
        This folder is intentionally left empty. Code logic and layout for the Mark 2 system will be developed here in complete isolation from Mark 1.
      </p>
    </div>
  );
}
