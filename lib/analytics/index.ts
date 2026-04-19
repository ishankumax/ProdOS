import { Goal } from "@/types/goals";
import { Habit, HabitLog } from "@/types/habits";
import { UserAnalytics, GoalStats, HabitStreakStats, DayActivity } from "@/types/analytics";

/**
 * Core analytics computation layer.
 * These functions process raw DB data into derived metrics.
 */

export function computeGoalStats(goals: Goal[]): GoalStats {
  const total = goals.length;
  const completed = goals.filter(g => g.completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, rate };
}

export function computeHabitStreaks(habits: Habit[], logs: HabitLog[]): HabitStreakStats[] {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const yesterday = new Date(now.getTime() - 86400000).toISOString().split("T")[0];

  return habits.map(habit => {
    const habitLogs = logs.filter(l => l.habit_id === habit.id && l.completed);
    const sortedLogs = [...habitLogs].sort((a, b) => b.date.localeCompare(a.date));
    const logMap = new Map(sortedLogs.map(l => [l.date, true]));
    
    let streak = 0;
    let currentDateStr = logMap.has(today) ? today : yesterday;
    
    if (logMap.has(currentDateStr)) {
      while (logMap.has(currentDateStr)) {
        streak++;
        const date = new Date(currentDateStr);
        date.setDate(date.getDate() - 1);
        currentDateStr = date.toISOString().split("T")[0];
      }
    }

    return {
      habit_id: habit.id,
      habit_name: habit.name,
      current_streak: streak,
      is_completed_today: logMap.has(today),
    };
  });
}

export function computeDayActivity(
  date: Date, 
  goals: Goal[], 
  habits: Habit[], 
  logs: HabitLog[]
): DayActivity {
  const dateISO = date.toISOString().split("T")[0];
  
  const goalsCompleted = goals.filter(g => 
    g.completed && 
    new Date(g.created_at).toISOString().split("T")[0] === dateISO
  ).length;

  const habitsCompleted = logs.filter(l => 
    l.completed && 
    l.date === dateISO
  ).length;

  return {
    date: dateISO,
    goals_completed: goalsCompleted,
    habits_completed: habitsCompleted
  };
}

export function computeWeeklyActivity(goals: Goal[], habits: Habit[], logs: HabitLog[]): DayActivity[] {
  const activity: DayActivity[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    activity.push(computeDayActivity(d, goals, habits, logs));
  }
  
  return activity;
}

/**
 * Aggregator: Combines raw data into the full analytics object.
 */
export function aggregateUserAnalytics(
  goals: Goal[],
  habits: Habit[],
  logs: HabitLog[]
): UserAnalytics {
  return {
    daily_goals: computeGoalStats(goals.filter(g => g.type === "daily")),
    weekly_goals: computeGoalStats(goals.filter(g => g.type === "weekly")),
    monthly_goals: computeGoalStats(goals.filter(g => g.type === "monthly")),
    streaks: computeHabitStreaks(habits, logs),
    weekly_activity: computeWeeklyActivity(goals, habits, logs)
  };
}
