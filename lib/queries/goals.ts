import { createClient } from "@/lib/supabase-server";
import type { Goal, GoalType } from "@/types/goals";
import { GoalSchema } from "@/lib/validation/schemas";
import { z } from "zod";
import { invalidateCache } from "@/lib/cache/redis";

/**
 * Fetch all goals for the authenticated user, newest first.
 * RLS on the goals table ensures only the owner's rows are returned.
 */
export async function getUserGoals(): Promise<Goal[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  
  // Validate array of goals
  const validated = z.array(GoalSchema).safeParse(data);
  if (!validated.success) {
    console.error("Goals validation failed:", validated.error.format());
    return (data ?? []) as Goal[]; 
  }
  
  return validated.data as Goal[];
}


/**
 * Insert a new goal for the authenticated user.
 */
export async function createGoal(
  title: string,
  type: GoalType
): Promise<Goal> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("goals")
    .insert({ title, type, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Invalidate cache
  await invalidateCache(`user:${user.id}:analytics`);

  return data as Goal;
}

/**
 * Toggle the completed status of a goal.
 */
export async function toggleGoal(id: string, completed: boolean): Promise<void> {
  const supabase = createClient();

  // Get user to build cache key
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("goals")
    .update({ completed })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Invalidate cache
  await invalidateCache(`user:${user.id}:analytics`);
}

/**
 * Delete a goal by ID.
 */
export async function deleteGoal(id: string): Promise<void> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Invalidate cache
  await invalidateCache(`user:${user.id}:analytics`);
}
