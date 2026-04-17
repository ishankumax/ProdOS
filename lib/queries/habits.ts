import { createClient } from "@/lib/supabase-server";
import { Habit, HabitLog, HabitWithStats } from "@/types/habits";
import { calculateCurrentStreak, get7DayHistory } from "@/lib/utils/streak";

export async function getUserHabitsWithStats(): Promise<HabitWithStats[]> {
  const supabase = createClient();
  
  // Fetch habits
  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: true });

  if (habitsError) throw new Error(habitsError.message);
  if (!habits || habits.length === 0) return [];

  // Fetch all logs for these habits (efficient to do one query for all)
  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("*")
    .in("habit_id", habits.map(h => h.id))
    .eq("completed", true)
    .order("date", { ascending: false });

  if (logsError) throw new Error(logsError.message);

  const today = new Date().toISOString().split("T")[0];

  return habits.map((habit) => {
    const habitLogs = (logs ?? []).filter((l) => l.habit_id === habit.id);
    return {
      ...habit,
      current_streak: calculateCurrentStreak(habitLogs),
      today_completed: habitLogs.some((l) => l.date === today),
      history_7_days: get7DayHistory(habitLogs),
    };
  });
}

export async function createHabit(name: string): Promise<Habit> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("habits")
    .insert({ name, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function toggleHabitToday(habitId: string, completed: boolean): Promise<void> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  if (completed) {
    // Upsert completion log
    const { error } = await supabase
      .from("habit_logs")
      .upsert({ habit_id: habitId, date: today, completed: true }, { onConflict: "habit_id, date" });
    if (error) throw new Error(error.message);
  } else {
    // Remove completion log
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("date", today);
    if (error) throw new Error(error.message);
  }
}

export async function deleteHabit(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
