"use client";

import { useTransition } from "react";
import { UserAnalytics } from "@/types/analytics";
import { Goal } from "@/types/goals";
import { HabitWithStats } from "@/types/habits";
import GoalItem from "@/components/goals/GoalItem";
import HabitItem from "@/components/habits/HabitItem";
import GoalForm from "@/components/goals/GoalForm";
import { cn } from "@/lib/utils";

interface TodayExecutionMark2Props {
  analytics: UserAnalytics;
  goals: Goal[];
  habits: HabitWithStats[];
}

export default function TodayExecutionMark2({ analytics, goals, habits }: TodayExecutionMark2Props) {
  const [isPending, startTransition] = useTransition();

  // Filter for today's items
  const todayGoals = goals.filter(g => g.type === "daily");
  const incompleteHabits = habits.filter(h => !h.today_completed);
  const completedHabits = habits.filter(h => h.today_completed);

  return (
    <div className="space-y-10 animate-in fade-in-50 duration-500">
      {/* Mark 2 Architecture Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-surface/80 to-surface p-6 shadow-2xl">
        <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-brand-500/40 uppercase tracking-widest select-none">
          SYSTEM_ARCH_v2.0 // STABLE
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              MARK_2_COMMAND_CENTER
            </h2>
            <p className="text-xs text-white/50 max-w-xl">
              Unified cognitive workspace implementing low-latency habit tracking, asynchronous goal state optimization, and real-time telemetry metrics.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/[0.02] border border-white/5 px-4 py-2 rounded-lg text-center shrink-0 min-w-[100px]">
              <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Telemetry</div>
              <div className="text-lg font-bold text-brand-400 font-mono">ACTIVE</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 px-4 py-2 rounded-lg text-center shrink-0 min-w-[100px]">
              <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Sync State</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Core Goal Form and Today's Agenda */}
        <div className="lg:col-span-2 space-y-6">
          <div className="prod-card space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-md font-bold text-white font-mono uppercase tracking-wider">01 // Agenda & Queue</h3>
              <span className="text-[10px] bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded font-mono font-bold">
                {todayGoals.length} ACTIVE
              </span>
            </div>

            <GoalForm />

            <div className="grid gap-3 pt-2">
              {todayGoals.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/5 rounded-lg">
                  <p className="text-sm text-white/20 italic">No execution vectors queued for today.</p>
                </div>
              ) : (
                todayGoals.map(goal => (
                  <div key={goal.id} className="relative group transition-all duration-300">
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <GoalItem goal={goal} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 2: System Telemetry and Active Routines */}
        <div className="space-y-6">
          {/* Habits Panel */}
          <div className="prod-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-md font-bold text-white font-mono uppercase tracking-wider">02 // Active Routines</h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                STREAK: {Math.max(...habits.map(h => h.current_streak), 0)}D
              </span>
            </div>

            <div className="space-y-4">
              {incompleteHabits.length > 0 && (
                <div className="grid gap-3">
                  {incompleteHabits.map(habit => (
                    <HabitItem key={habit.id} habit={habit} />
                  ))}
                </div>
              )}

              {completedHabits.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest font-mono">
                    Completed Loops
                  </p>
                  <div className="grid gap-3 opacity-50">
                    {completedHabits.map(habit => (
                      <HabitItem key={habit.id} habit={habit} />
                    ))}
                  </div>
                </div>
              )}

              {habits.length === 0 && (
                <p className="text-sm text-white/10 italic text-center py-6">No routines tracked.</p>
              )}
            </div>
          </div>

          {/* Performance Summary widget */}
          <div className="prod-card p-6 space-y-4 bg-gradient-to-b from-surface to-brand-950/20">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest font-mono">
              03 // Performance Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.01] p-3 rounded border border-white/5">
                <span className="text-[9px] text-white/40 uppercase font-mono block">Velocity</span>
                <span className="text-2xl font-bold font-mono text-white">{analytics.daily_goals.rate}%</span>
              </div>
              <div className="bg-white/[0.01] p-3 rounded border border-white/5">
                <span className="text-[9px] text-white/40 uppercase font-mono block">Volume</span>
                <span className="text-2xl font-bold font-mono text-brand-400">
                  {analytics.daily_goals.completed} / {analytics.daily_goals.total}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
