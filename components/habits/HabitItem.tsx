"use client";

import { useOptimistic, useTransition } from "react";
import { toggleHabitAction, deleteHabitAction } from "@/app/dashboard/actions";
import type { HabitWithStats } from "@/types/habits";

interface HabitItemProps {
  habit: HabitWithStats;
}

export default function HabitItem({ habit }: HabitItemProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    habit.today_completed
  );

  function handleToggle() {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      await toggleHabitAction(habit.id, !optimisticCompleted);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteHabitAction(habit.id);
    });
  }

  return (
    <div className="group relative flex items-center gap-4 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.05] transition-all">
      {/* Check-in Toggle */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
          optimisticCompleted
            ? "bg-brand-500 border-brand-500 text-white"
            : "border-white/20 text-white/20 hover:border-brand-400"
        }`}
      >
        {optimisticCompleted ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-[10px] font-bold">DONE</span>
        )}
      </button>

      {/* Name & Streak */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium truncate ${optimisticCompleted ? "text-white/50" : "text-white"}`}>
          {habit.name}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold text-brand-400 flex items-center gap-0.5">
            🔥 {habit.current_streak} DAY STREAK
          </span>
          
          {/* Sparkline (7 days) */}
          <div className="flex gap-0.5">
            {habit.history_7_days.map((done, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${
                  done ? "bg-brand-500" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Options */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
