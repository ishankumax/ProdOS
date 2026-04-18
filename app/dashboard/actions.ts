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
import { GoalTypeSchema } from "@/lib/validation/schemas";
import { z } from "zod";

const CreateGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: GoalTypeSchema,
});

/**
 * Server Action: create a new goal.
 * Called from GoalForm via form action / startTransition.
 */
export async function createGoalAction(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    type: formData.get("type"),
  };

  const validated = CreateGoalSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { title, type } = validated.data;

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

const CreateHabitSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function createHabitAction(formData: FormData) {
  const name = formData.get("name");
  
  const validated = CreateHabitSchema.safeParse({ name });
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    await dbCreateHabit(validated.data.name);
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
