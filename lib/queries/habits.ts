import { createClient } from "@/lib/supabase-server";
import { Habit, HabitLog, HabitWithStats } from "@/types/habits";
import { computeHabitStreaks } from "@/lib/analytics";
import { HabitSchema, HabitLogSchema } from "@/lib/validation/schemas";
import { z } from "zod";
import { invalidateCache } from "@/lib/cache/redis";

export async function getUserHabitsWithStats(): Promise<HabitWithStats[]> {
  const supabase = createClient();
  
  // Fetch habits
  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: true });

  if (habitsError) throw new Error(habitsError.message);
  if (!habits || habits.length === 0) return [];

  // Validate habits
  const validatedHabits = z.array(HabitSchema).safeParse(habits);
  if (!validatedHabits.success) {
    console.error("Habits validation failed:", validatedHabits.error.format());
  }

  // Fetch all completed logs for these habits
  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("*")
    .in("habit_id", habits.map(h => h.id))
    .eq("completed", true)
    .order("date", { ascending: false });

  if (logsError) throw new Error(logsError.message);

  // Validate logs
  const validatedLogs = z.array(HabitLogSchema).safeParse(logs);
  if (!validatedLogs.success) {
    console.error("Habit logs validation failed:", validatedLogs.error.format());
  }

  // Use the analytics layer to compute streaks and status
  const streakStats = computeHabitStreaks(habits, (logs ?? []) as HabitLog[]);

  return habits.map((habit) => {
    const stats = streakStats.find(s => s.habit_id === habit.id);
    const habitLogs = (logs ?? []).filter((l) => l.habit_id === habit.id);
    
    // We keep history_7_days here because it's used by the UI for the mini graph
    // but the logic can be moved to analytics as well.
    const logMap = new Map(habitLogs.map(l => [l.date, true]));
    const history_7_days: boolean[] = [];
    for (let i = 6; i >= 0; i--) {
       const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
       history_7_days.push(logMap.has(d));
    }

    return {
      ...habit,
      current_streak: stats?.current_streak ?? 0,
      today_completed: stats?.is_completed_today ?? false,
      history_7_days,
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

  // Invalidate cache
  await invalidateCache(`user:${user.id}:analytics`);

  return data;
}

export async function toggleHabitToday(habitId: string, completed: boolean): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

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

  // Invalidate cache
  await invalidateCache(`user:${user.id}:analytics`);
}

export async function deleteHabit(id: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Invalidate cache
  await invalidateCache(`user:${user.id}:analytics`);
}
