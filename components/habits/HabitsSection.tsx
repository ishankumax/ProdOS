"use client";

import HabitItem from "./HabitItem";
import HabitForm from "./HabitForm";
import type { HabitWithStats } from "@/types/habits";
import { useRealtime } from "@/hooks/useRealtime";
import { useRouter } from "next/navigation";

interface HabitsSectionProps {
  habits: HabitWithStats[];
}

export default function HabitsSection({ habits }: HabitsSectionProps) {
  const router = useRouter();

  useRealtime(["habits", "habit_logs"], () => {
    router.refresh();
  });

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="opacity-30">⟳</span> Your Habits
          </h2>
          <p className="text-xs text-white/30 mt-1">Consistency is the only metric that matters.</p>
        </div>

        {/* Action Row: Form */}
        <div className="p-1">
           <HabitForm />
        </div>
      </div>

      {/* List Area */}
      {habits.length === 0 ? (
        <div className="py-20 rounded-2xl border border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/20">Establishing your first routine...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
