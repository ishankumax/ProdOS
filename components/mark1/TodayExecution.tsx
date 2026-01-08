"use client";

import { useTransition } from "react";
import { UserAnalytics } from "@/types/analytics";
import { Goal } from "@/types/goals";
import { HabitWithStats } from "@/types/habits";
import GoalItem from "./GoalItem";
import HabitItem from "./HabitItem";
import GoalForm from "./GoalForm";
import { cn } from "@/lib/utils";

interface TodayExecutionProps {
  analytics: UserAnalytics;
  goals: Goal[];
  habits: HabitWithStats[];
}

export default function TodayExecution({ analytics, goals, habits }: TodayExecutionProps) {
  const [isPending, startTransition] = useTransition();

  // Filter for today's items
  const todayGoals = goals.filter(g => g.type === "daily");
  const incompleteHabits = habits.filter(h => !h.today_completed);
  const completedHabits = habits.filter(h => h.today_completed);

  return (
    <div className="space-y-10">
      {/* Dashboard cleared as requested */}
    </div>
  );
}
