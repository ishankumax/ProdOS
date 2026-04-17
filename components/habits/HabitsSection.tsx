"use client";

import HabitItem from "./HabitItem";
import HabitForm from "./HabitForm";
import type { HabitWithStats } from "@/types/habits";

interface HabitsSectionProps {
  habits: HabitWithStats[];
}

export default function HabitsSection({ habits }: HabitsSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Your Habits</h2>
          <p className="text-xs text-white/40 mt-0.5">Build consistency daily</p>
        </div>
      </div>

      <HabitForm />

      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-white/10 text-center">
          <span className="text-2xl opacity-20 mb-2">⟳</span>
          <p className="text-xs text-white/30">No habits tracked yet. Start one today!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </section>
  );
}
