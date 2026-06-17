import { createClient } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import type { Goal, GoalType } from "@/types/goals";

/**
 * Fetch all goals for the authenticated user, newest first.
 * RLS on the goals table ensures only the owner's rows are returned.
 */
export async function getUserGoals(): Promise<Goal[]> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return [];

    const supabase = createClient();
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user goals:", error.message);
      return [];
    }

    return (data || []) as Goal[];
  } catch (err) {
    console.error("Error in getUserGoals:", err);
    return [];
  }
}

/**
 * Insert a new goal for the authenticated user.
 */
export async function createGoal(
  title: string,
  type: GoalType
): Promise<Goal> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      title,
      type,
      completed: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating goal:", error.message);
    throw new Error(error.message);
  }

  return data as Goal;
}

/**
 * Toggle a goal's completed state.
 */
export async function toggleGoal(id: string, completed: boolean): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("goals")
    .update({ completed })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error toggling goal:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Delete a goal.
 */
export async function deleteGoal(id: string): Promise<void> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createClient();
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting goal:", error.message);
    throw new Error(error.message);
  }
}
