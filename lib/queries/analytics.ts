import { createClient } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { getUserGoals } from "./goals";
import { aggregateUserAnalytics } from "@/lib/analytics";
import type { UserAnalytics } from "@/types/analytics";
import type { HabitLog } from "@/types/habits";
import { getCachedData, setCachedData } from "@/lib/cache/redis";

/**
 * High-level query to fetch all derived analytics for a user in one go.
 * Implements Redis caching (Cache-Aside Pattern) with database fallback.
 */
export async function getUserAnalytics(): Promise<UserAnalytics> {
  const defaultAnalytics: UserAnalytics = {
    daily_goals: { completed: 0, total: 0, rate: 0 },
    weekly_goals: { completed: 0, total: 0, rate: 0 },
    monthly_goals: { completed: 0, total: 0, rate: 0 },
    streaks: [],
    weekly_activity: [],
  };

  try {
    const user = await getAuthenticatedUser();
    if (!user) return defaultAnalytics;

    const cacheKey = `user:${user.id}:analytics`;
    try {
      const cached = await getCachedData<UserAnalytics>(cacheKey);
      if (cached) return cached;
    } catch (cacheErr) {
      console.error("Cache retrieval error in getUserAnalytics:", cacheErr);
    }

    // Fetch goals using live query
    const goals = await getUserGoals();

    const supabase = createClient();

    // Fetch user habits
    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id);

    if (habitsError) {
      console.error("Error fetching habits for analytics:", habitsError.message);
    }

    let habitLogs: HabitLog[] = [];
    if (habits && habits.length > 0) {
      const habitIds = habits.map((h) => h.id);
      const { data: logs, error: logsError } = await supabase
        .from("habit_logs")
        .select("*")
        .in("habit_id", habitIds);

      if (logsError) {
        console.error("Error fetching habit logs for analytics:", logsError.message);
      }
      habitLogs = logs || [];
    }

    const analytics = aggregateUserAnalytics(
      goals,
      habits || [],
      habitLogs
    );

    try {
      await setCachedData(cacheKey, analytics, 300); // 5 mins cache TTL
    } catch (cacheErr) {
      console.error("Cache storage error in getUserAnalytics:", cacheErr);
    }

    return analytics;
  } catch (err) {
    console.error("Error in getUserAnalytics:", err);
    return defaultAnalytics;
  }
}
