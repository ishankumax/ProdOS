"use server";

import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserTasksCache } from "@/lib/redis";

export async function deleteTask(taskId: string): Promise<ActionResponse<void>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    if (!taskId || typeof taskId !== "string") {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Task ID is required",
        },
      };
    }

    const supabase = createClient();

    // 1. Verify task ownership
    const { data: existingTask } = await supabase
      .from("v2_tasks")
      .select("id, user_id")
      .eq("id", taskId)
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

    // 2. Perform Delete
    const { error } = await supabase
      .from("v2_tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: { code: "DATABASE_ERROR", message: error.message } };
    }

    // Evict Redis caches
    await evictUserTasksCache(user.id);

    return {
      success: true,
    };
  } catch (err: any) {
    return { success: false, error: { code: "DATABASE_ERROR", message: err.message || "An unknown error occurred" } };
  }
}
