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
        <div className="prod-card-interactive space-y-4 group">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Daily Progress</p>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded tracking-tighter">↗ 12.5%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{analytics.daily_goals.rate}%</span>
            <span className="text-[10px] text-white/20 font-medium">Protocol Velocity</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-500 transition-all duration-1000 ease-out"
              style={{ width: `${analytics.daily_goals.rate}%` }}
            />
          </div>
        </div>

        <div className="prod-card-interactive space-y-4 group">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Habit Momentum</p>
            <span className="text-[10px] font-black text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded tracking-tighter">STABLE</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">{Math.max(...habits.map(h => h.current_streak), 0)}</span>
              <span className="text-[10px] text-white/20 font-medium uppercase tracking-tighter">Day Streak</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 text-lg">
              🔥
            </div>
          </div>
        </div>

        <div className="prod-card-interactive space-y-4 group">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Weekly Capacity</p>
            <span className="text-[10px] font-black text-brand-400/60 tracking-tighter">7 DAY PROTOCOL</span>
          </div>
          <div className="flex items-end gap-1.5 h-10">
            {analytics.weekly_activity.map((day, i) => (
              <div 
                key={day.date}
                className={cn(
                  "flex-1 rounded-[2px] transition-all duration-500 hover:opacity-100",
                  (day.goals_completed + day.habits_completed) > 0 ? "bg-brand-500" : "bg-white/5"
                )}
                style={{ 
                  height: `${Math.max(15, Math.min((day.goals_completed + day.habits_completed) * 20, 100))}%`,
                  opacity: 0.3 + (i * 0.1)
                }}
                title={`${day.date}: ${day.goals_completed + day.habits_completed} activities`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col: Goals */}
        <div id="goals" className="space-y-6 scroll-mt-24">
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
        <div id="habits" className="space-y-6 scroll-mt-24">
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
