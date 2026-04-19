"use client";

import { useTransition } from "react";
import { UserAnalytics } from "@/types/analytics";
import { Goal } from "@/types/goals";
import { HabitWithStats } from "@/types/habits";
import GoalItem from "@/components/goals/GoalItem";
import HabitItem from "@/components/habits/HabitItem";
import GoalForm from "@/components/goals/GoalForm";
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
      {/* Visual Progress Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Daily Progress</p>
            <span className="text-brand-400 font-bold text-lg">{analytics.daily_goals.rate}%</span>
          </div>
          <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-500 transition-all duration-1000 ease-out"
              style={{ width: `${analytics.daily_goals.rate}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Habit Momentum</p>
              <p className="text-2xl font-bold text-white mt-1">🔥 {Math.max(...habits.map(h => h.current_streak), 0)} Day Streak</p>
           </div>
           <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
             🔥
           </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Weekly Velocity</p>
          <div className="flex items-end gap-1 h-8">
            {analytics.weekly_activity.map((day, i) => (
              <div 
                key={day.date}
                className={cn(
                  "flex-1 rounded-sm transition-all duration-500",
                  (day.goals_completed + day.habits_completed) > 0 ? "bg-brand-500/40" : "bg-white/5"
                )}
                style={{ height: `${Math.min((day.goals_completed + day.habits_completed) * 20, 100)}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col: Goals */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Today's Execution</h2>
            <button className="text-[10px] font-bold text-brand-400 uppercase tracking-widest hover:text-brand-300 transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
             <GoalForm />
             <div className="grid gap-3">
               {todayGoals.length === 0 ? (
                 <p className="text-sm text-white/10 italic">No goals defined for today.</p>
               ) : (
                 todayGoals.map(goal => (
                   <GoalItem key={goal.id} goal={goal} />
                 ))
               )}
             </div>
          </div>
        </div>

        {/* Right Col: Habits */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Active Routines</h2>
          <div className="grid gap-4">
             {incompleteHabits.length > 0 && (
               <div className="grid grid-cols-1 gap-3">
                 {incompleteHabits.map(habit => (
                   <HabitItem key={habit.id} habit={habit} />
                 ))}
               </div>
             )}
             
             {completedHabits.length > 0 && (
               <div className="space-y-3 opacity-40">
                 <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-2">Completed</p>
                 <div className="grid grid-cols-1 gap-3">
                   {completedHabits.map(habit => (
                     <HabitItem key={habit.id} habit={habit} />
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
