import { createClient } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { computeHabitStreaks } from "@/lib/analytics";
import type { Habit, HabitWithStats } from "@/types/habits";

/**
 * Fetch all habits for the authenticated user along with streak statistics
 * and a 7-day completion history log.
 */
export async function getUserHabitsWithStats(): Promise<HabitWithStats[]> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return [];

    const supabase = createClient();
    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (habitsError) {
      console.error("Error fetching habits:", habitsError.message);
      return [];
    }

    if (!habits || habits.length === 0) return [];

    // Fetch habit logs
    const habitIds = habits.map((h) => h.id);
    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .in("habit_id", habitIds);

    if (logsError) {
      console.error("Error fetching habit logs:", logsError.message);
    }

    const habitLogs = logs || [];

    // Calculate dates for history_7_days (from 6 days ago to today)
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]!);
    }

    const todayStr = new Date().toISOString().split("T")[0]!;

    // Compute streaks and completion today
    const streakStats = computeHabitStreaks(habits, habitLogs);
    const statsMap = new Map(streakStats.map((s) => [s.habit_id, s]));

    return habits.map((habit) => {
      const stats = statsMap.get(habit.id);
      const history_7_days = dates.map((dateStr) =>
        habitLogs.some((l) => l.habit_id === habit.id && l.date === dateStr && l.completed)
      );

      return {
        id: habit.id,
        user_id: habit.user_id,
        name: habit.name,
        created_at: habit.created_at,
        current_streak: stats ? stats.current_streak : 0,
        today_completed: habitLogs.some(
          (l) => l.habit_id === habit.id && l.date === todayStr && l.completed
        ),
        history_7_days,
      };
    });
  } catch (err) {
    console.error("Error in getUserHabitsWithStats:", err);
    return [];
  }
}

/**
 * Insert a new habit.
 */
export async function createHabit(name: string): Promise<Habit> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: user.id,
      name,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating habit:", error.message);
    throw new Error(error.message);
  }

  return data as Habit;
}

/**
 * Toggle completion status of a habit for today.
 */
export async function toggleHabitToday(habitId: string, completed: boolean): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const todayStr = new Date().toISOString().split("T")[0]!;

  const { error } = await supabase
    .from("habit_logs")
    .upsert(
      {
        habit_id: habitId,
        date: todayStr,
        completed,
      },
      { onConflict: "habit_id,date" }
    );

  if (error) {
    console.error("Error toggling habit today:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Delete a habit.
 */
export async function deleteHabit(id: string): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting habit:", error.message);
    throw new Error(error.message);
  }
}
