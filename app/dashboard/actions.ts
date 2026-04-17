"use server";

import { revalidatePath } from "next/cache";
import {
  createGoal as dbCreate,
  toggleGoal as dbToggle,
  deleteGoal as dbDelete,
} from "@/lib/queries/goals";
import type { GoalType } from "@/types/goals";

/**
 * Server Action: create a new goal.
 * Called from GoalForm via form action / startTransition.
 */
export async function createGoalAction(formData: FormData) {
  const title = (formData.get("title") as string | null)?.trim();
  const type = formData.get("type") as GoalType | null;

  if (!title || title.length === 0) return { error: "Title is required." };
  if (!type || !["daily", "weekly", "monthly"].includes(type))
    return { error: "Invalid goal type." };

  try {
    await dbCreate(title, type);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}

/**
 * Server Action: toggle a goal's completed state.
 */
export async function toggleGoalAction(id: string, completed: boolean) {
  try {
    await dbToggle(id, completed);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}

/**
 * Server Action: delete a goal.
 */
export async function deleteGoalAction(id: string) {
  try {
    await dbDelete(id);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}
