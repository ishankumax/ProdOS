import { createClient } from "@/lib/supabase-server";
import type { Goal, GoalType } from "@/types/goals";

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
  return (data ?? []) as Goal[];
}

/**
 * Insert a new goal for the authenticated user.
 * user_id is injected server-side via auth.uid() through RLS;
 * we still pass it explicitly so the insert is unambiguous.
 */
export async function createGoal(
  title: string,
  type: GoalType
): Promise<Goal> {
  const supabase = createClient();

  // Resolve authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("goals")
    .insert({ title, type, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Goal;
}

/**
 * Toggle the completed status of a goal.
 * RLS prevents any user from toggling another user's goal.
 */
export async function toggleGoal(id: string, completed: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("goals")
    .update({ completed })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/**
 * Delete a goal by ID.
 * RLS prevents cross-user deletes.
 */
export async function deleteGoal(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
