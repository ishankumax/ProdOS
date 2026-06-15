"use server";

import { ToggleTaskSchema } from "@/lib/validation/task";
import { Task } from "@/types/task";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserTasksCache } from "@/lib/redis";

export async function toggleTask(rawInput: unknown): Promise<ActionResponse<Task>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = ToggleTaskSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Input validation failed",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            issue: issue.message,
          })),
        },
      };
    }

    const { id, completed } = validation.data;
    const supabase = createClient();

    // 1. Verify task ownership
    const { data: existingTask } = await supabase
      .from("v2_tasks")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingTask) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Task not found or access denied.",
        },
      };
    }

    // 2. Perform Update
    const completedAt = completed ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("v2_tasks")
      .update({
        completed,
        completed_at: completedAt,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: { code: "DATABASE_ERROR", message: error.message } };
    }

    // Evict Redis caches
    await evictUserTasksCache(user.id);

    return {
      success: true,
      data: {
        id: data.id,
        userId: data.user_id,
        domainId: data.domain_id,
        weeklyTargetId: data.weekly_target_id,
        title: data.title,
        completed: data.completed,
        completedAt: data.completed_at,
        dueDate: data.due_date,
        weight: Number(data.weight),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: { code: "DATABASE_ERROR", message: err.message || "An unknown error occurred" } };
  }
}
