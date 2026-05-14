import { createClient } from "@/lib/supabase-server";
import type { Goal, GoalType } from "@/types/goals";
import { GoalSchema } from "@/lib/validation/schemas";
import { z } from "zod";
import { invalidateCache } from "@/lib/cache/redis";

/**
 * Fetch all goals for the authenticated user, newest first.
 * RLS on the goals table ensures only the owner's rows are returned.
 */
const MOCK_GOALS: Goal[] = [
  { id: '1', title: 'Refactor Portfolio Layout', type: 'daily', completed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), user_id: 'mock' },
  { id: '2', title: 'Complete Finance OS UI', type: 'daily', completed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), user_id: 'mock' },
  { id: '3', title: 'Deep Work: Project Strategy', type: 'daily', completed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), user_id: 'mock' },
];

export async function getUserGoals(): Promise<Goal[]> {
  return MOCK_GOALS;
}


/**
 * Insert a new goal for the authenticated user.
 */
export async function createGoal(
  title: string,
  type: GoalType
): Promise<Goal> {
  console.log("Mock create goal", title, type);
  return MOCK_GOALS[0];
}

export async function toggleGoal(id: string, completed: boolean): Promise<void> {
  console.log("Mock toggle goal", id, completed);
}

export async function deleteGoal(id: string): Promise<void> {
  console.log("Mock delete goal", id);
}
