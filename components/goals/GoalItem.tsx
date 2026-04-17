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
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
        optimisticCompleted
          ? "border-white/5 bg-white/[0.015] opacity-60"
          : "border-white/8 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/12"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        aria-label={optimisticCompleted ? "Mark incomplete" : "Mark complete"}
        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
          optimisticCompleted
            ? "bg-brand-500 border-brand-500"
            : "border-white/20 hover:border-brand-400"
        }`}
      >
        {optimisticCompleted && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 6l3 3 5-5"
            />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={`flex-1 text-sm transition-all duration-150 ${
          optimisticCompleted
            ? "line-through text-white/30"
            : "text-white/85"
        }`}
      >
        {goal.title}
      </span>

      {/* Type badge */}
      <span
        className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${
          TYPE_STYLES[goal.type] ?? "bg-white/10 text-white/50 border-white/10"
        }`}
      >
        {goal.type}
      </span>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete goal"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 disabled:pointer-events-none"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </li>
  );
}
