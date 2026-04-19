"use client";

import { useOptimistic, useTransition } from "react";
import { toggleGoalAction, deleteGoalAction } from "@/app/dashboard/actions";
import type { Goal } from "@/types/goals";

const TYPE_STYLES: Record<string, string> = {
  daily: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  weekly: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  monthly: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};

interface GoalItemProps {
  goal: Goal;
}

export default function GoalItem({ goal }: GoalItemProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    goal.completed
  );

  function handleToggle() {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      await toggleGoalAction(goal.id, !optimisticCompleted);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteGoalAction(goal.id);
    });
  }

  return (
    <li
      className={`group flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 ${
        optimisticCompleted
          ? "border-white/5 bg-white/[0.01] opacity-40 translate-y-0.5"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-brand-500/30 hover:shadow-[0_4px_20px_-10px_rgba(139,92,246,0.3)]"
      }`}
    >
      {/* Checkbox Trigger */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
          optimisticCompleted
            ? "bg-brand-500 border-brand-500 scale-95"
            : "border-white/20 group-hover:border-brand-400 group-hover:scale-105"
        }`}
      >
        {optimisticCompleted && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </button>

      {/* Target Description */}
      <div className="flex-1 min-w-0">
        <span className={`block text-[13px] font-medium transition-all duration-300 truncate ${
          optimisticCompleted ? "line-through text-white/20" : "text-white/80 group-hover:text-white"
        }`}>
          {goal.title}
        </span>
        {!optimisticCompleted && (
          <span className="text-[10px] text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Ready for execution
          </span>
        )}
      </div>

      {/* Metadata & Actions */}
      <div className="flex items-center gap-3">
        <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-tighter ${
          TYPE_STYLES[goal.type] ?? "bg-white/10"
        }`}>
          {goal.type}
        </span>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}
