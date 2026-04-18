
import { Goal } from "@/types/goals";
import { Habit, HabitLog } from "@/types/habits";
import { getDayName, formatToISODate, isSameDay } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

interface DayCardProps {
  date: Date;
  goals: Goal[];
  habits: Habit[];
  logs: HabitLog[];
  isToday: boolean;
}

export default function DayCard({ date, goals, habits, logs, isToday }: DayCardProps) {
  const dayName = getDayName(date);
  const dateNum = date.getDate();
  const dateISO = formatToISODate(date);

  const dayGoals = goals.filter(g => isSameDay(new Date(g.created_at), date));
  
  // Calculate completion percentage for the day
  const completedHabitsCount = habits.length > 0
    ? habits.filter(h => logs.some(l => l.habit_id === h.id && l.date === dateISO)).length
    : 0;
  
  const completedGoalsCount = dayGoals.filter(g => g.completed).length;
  
  const totalItems = habits.length + dayGoals.length;
  const completedItems = completedHabitsCount + completedGoalsCount;
  
  const completionRate = totalItems > 0 ? (completedItems / totalItems) : 0;
  const isHighCompletion = completionRate > 0.8 && totalItems > 0;
  
  return (
    <div className={cn(
      "flex flex-col gap-4 p-4 rounded-xl border transition-all duration-500 min-h-[220px] group relative overflow-hidden",
      isToday 
        ? "bg-white/[0.04] border-brand-500/40 ring-1 ring-brand-500/20 shadow-[0_0_20px_rgba(139,92,246,0.05)]" 
        : isHighCompletion
          ? "bg-brand-500/[0.05] border-brand-500/20"
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
    )}>
      {/* Visual highlight for high completion */}
      {isHighCompletion && (
        <div className="absolute top-0 right-0 w-12 h-12 bg-brand-500/10 blur-[20px] rounded-full -mr-6 -mt-6" />
      )}
      {/* Date Header */}
      <div className="flex flex-col">
        <span className={cn(
          "text-[9px] font-black uppercase tracking-[0.2em]",
          isToday ? "text-brand-400" : "text-white/20"
        )}>
          {dayName}
        </span>
        <span className={cn(
          "text-2xl font-bold mt-0.5",
          isToday ? "text-white" : "text-white/60"
        )}>
          {dateNum}
        </span>
      </div>

      {/* Habits Indicators */}
      <div className="space-y-2">
        <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest">Habits</p>
        <div className="flex flex-wrap gap-1.5 min-h-[16px]">
          {habits.length === 0 ? (
            <div className="w-2 h-2 rounded-full bg-white/5" />
          ) : (
            habits.map(habit => {
              const isCompleted = logs.some(l => l.habit_id === habit.id && l.date === dateISO);
              return (
                <div 
                  key={habit.id}
                  title={habit.name}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    isCompleted 
                      ? "bg-brand-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                      : "bg-white/10"
                  )}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3 pt-2 border-t border-white/5 mt-auto">
        <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest">Goals</p>
        <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
          {dayGoals.length === 0 ? (
            <p className="text-[10px] text-white/5 italic">No entries</p>
          ) : (
            dayGoals.map(goal => (
              <div key={goal.id} className="flex items-start gap-2 group/item">
                <div className={cn(
                  "mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform group-hover/item:scale-125",
                  goal.completed ? "bg-brand-400" : "border border-white/30"
                )} />
                <p className={cn(
                  "text-[10px] leading-tight transition-colors",
                  goal.completed ? "text-white/20 line-through" : "text-white/50 group-hover/item:text-white/80"
                )}>
                  {goal.title}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
