import { createClient } from "@/lib/supabase-server";
import { getUserGoals } from "./goals";
import { aggregateUserAnalytics } from "@/lib/analytics";
import { UserAnalytics } from "@/types/analytics";
import { getCachedData, setCachedData } from "@/lib/cache/redis";

/**
 * High-level query to fetch all derived analytics for a user in one go.
 * Implements Redis caching (Cache-Aside Pattern).
 */
export async function getUserAnalytics(): Promise<UserAnalytics> {
  const supabase = createClient();

  // 1. Resolve authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const cacheKey = `user:${user.id}:analytics`;

  // 2. Try Cache
  const cached = await getCachedData<UserAnalytics>(cacheKey);
  if (cached) return cached;

  // 3. Cache Miss: Fetch from DB
  const [goals, { data: habits }, { data: logs }] = await Promise.all([
    getUserGoals(),
    supabase.from("habits").select("*").order("created_at", { ascending: true }),
    supabase.from("habit_logs").select("*").eq("completed", true)
  ]);

  if (!habits) throw new Error("Could not fetch habits");
  if (!logs) throw new Error("Could not fetch habit logs");

  // 4. Compute Derived Data
  const analytics = aggregateUserAnalytics(goals, habits, logs);

  // 5. Update Cache (TTL: 10 minutes)
  await setCachedData(cacheKey, analytics, 600);

  return analytics;
}
