"use client";

import { useState } from "react";
import GoalForm from "./GoalForm";
import GoalItem from "./GoalItem";
import type { Goal, GoalFilter, GoalType } from "@/types/goals";
import { useRealtime } from "@/hooks/useRealtime";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // Sync with database changes
  useRealtime(["goals"], () => {
    router.refresh();
  });


  const filtered =
    filter === "all"
      ? initialGoals
      : initialGoals.filter((g) => g.type === (filter as GoalType));

  const completedCount = filtered.filter((g) => g.completed).length;
  const totalCount = filtered.length;

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="opacity-30">◎</span> Your Goals
            </h2>
            <p className="text-xs text-white/30 mt-1">Focus on what matters today.</p>
          </div>
          
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/5">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f.value
                    ? "bg-white/5 text-white shadow-sm"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                {f.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Action Row: Form */}
        <div className="p-1">
           <GoalForm />
        </div>
      </div>

      {/* List Area */}
      <div className="space-y-4">
        {totalCount > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-white/[0.03] overflow-hidden">
               <div
                className="h-full bg-brand-500 transition-all duration-700 ease-out"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-white/20 whitespace-nowrap uppercase tracking-widest">
              {completedCount} / {totalCount} Done
            </span>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-20 rounded-2xl border border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center">
            <p className="text-sm text-white/20">No tasks in this category.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3">
            {filtered.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
