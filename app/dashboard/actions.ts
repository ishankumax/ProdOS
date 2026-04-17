"use server";

import { revalidatePath } from "next/cache";
import {
  createGoal as dbCreate,
  toggleGoal as dbToggle,
  deleteGoal as dbDelete,
} from "@/lib/queries/goals";
import {
  createHabit as dbCreateHabit,
  toggleHabitToday as dbToggleHabit,
  deleteHabit as dbDeleteHabit,
} from "@/lib/queries/habits";
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

// --- Habit Actions ---

export async function createHabitAction(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim();
  if (!name || name.length === 0) return { error: "Name is required." };

  try {
    await dbCreateHabit(name);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}

export async function toggleHabitAction(habitId: string, completed: boolean) {
  try {
    await dbToggleHabit(habitId, completed);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteHabitAction(id: string) {
  try {
    await dbDeleteHabit(id);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}
