export interface Habit {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD (UTC)
  completed: boolean;
}

export interface HabitWithStats extends Habit {
  current_streak: number;
  today_completed: boolean;
  history_7_days: boolean[]; // last 7 days including today
}
