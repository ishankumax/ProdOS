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
    <div className={`group relative flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all duration-300 ${
      optimisticCompleted
        ? "border-white/5 bg-white/[0.01] opacity-50"
        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-brand-500/30"
    }`}>
      {/* Action Trigger */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex-shrink-0 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
          optimisticCompleted
            ? "bg-brand-500 border-brand-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            : "border-white/10 text-white/10 hover:border-brand-400 hover:text-white group-hover:bg-brand-500/5"
        }`}
      >
        {optimisticCompleted ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-[10px] font-black tracking-tighter">EXEC</span>
        )}
      </button>

      {/* Routine Metadata */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-[15px] font-bold tracking-tight transition-colors ${optimisticCompleted ? "text-white/30" : "text-white"}`}>
          {habit.name}
        </h3>
        <div className="flex items-center gap-3 mt-1.5">
          <span className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest transition-colors",
            habit.current_streak > 0 ? "bg-orange-500/10 text-orange-500" : "bg-white/5 text-white/20"
          )}>
            🔥 {habit.current_streak} DAY STREAK
          </span>
          
          <div className="flex gap-1">
            {habit.history_7_days.map((done, i) => (
              <div 
                key={i} 
                className={`w-1 h-3 rounded-full transition-all duration-500 ${
                  done ? "bg-brand-500" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Control Layer */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
