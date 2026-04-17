"use client";

import { useState } from "react";
import GoalForm from "./GoalForm";
import GoalItem from "./GoalItem";
import type { Goal, GoalFilter, GoalType } from "@/types/goals";

const FILTERS: { value: GoalFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

interface GoalsSectionProps {
  initialGoals: Goal[];
}

export default function GoalsSection({ initialGoals }: GoalsSectionProps) {
  const [filter, setFilter] = useState<GoalFilter>("all");

  const filtered =
    filter === "all"
      ? initialGoals
      : initialGoals.filter((g) => g.type === (filter as GoalType));

  const completedCount = filtered.filter((g) => g.completed).length;
  const totalCount = filtered.length;

  return (
    <section aria-labelledby="goals-heading" className="space-y-5">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h2 id="goals-heading" className="text-lg font-semibold text-white">
            Your Goals
          </h2>
          {totalCount > 0 && (
            <p className="text-xs text-white/40 mt-0.5">
              {completedCount} / {totalCount} completed
            </p>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-lg border border-white/10 bg-white/5 w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                filter === f.value
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add goal form */}
      <GoalForm />

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* Goals list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-white/10 text-center space-y-2">
          <span className="text-3xl opacity-30">◎</span>
          <p className="text-sm text-white/40">
            {filter === "all"
              ? "No goals yet. Add one above to get started."
              : `No ${filter} goals. Add one or switch the filter.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((goal) => (
            <GoalItem key={goal.id} goal={goal} />
          ))}
        </ul>
      )}
    </section>
  );
}
