export interface GoalStats {
  total: number;
  completed: number;
  rate: number; // percentage 0-100
}

export interface HabitStreakStats {
  habit_id: string;
  habit_name: string;
  current_streak: number;
  is_completed_today: boolean;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  goals_completed: number;
  habits_completed: number;
}

export interface UserAnalytics {
  daily_goals: GoalStats;
  weekly_goals: GoalStats;
  monthly_goals: GoalStats;
  streaks: HabitStreakStats[];
  weekly_activity: DayActivity[];
}
