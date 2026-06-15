"use server";

import { UpdateTaskSchema } from "@/lib/validation/task";
import { Task } from "@/types/task";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserTasksCache } from "@/lib/redis";

export async function updateTask(rawInput: unknown): Promise<ActionResponse<Task>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = UpdateTaskSchema.safeParse(rawInput);
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

    const { id, title, domainId, weeklyTargetId, dueDate, weight } = validation.data;
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

    // 2. If domainId is being updated and is not null/undefined, verify ownership
    if (domainId !== undefined && domainId !== null) {
      const { data: domain } = await supabase
        .from("v2_domains")
        .select("id")
        .eq("id", domainId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!domain) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Domain not found or access denied.",
          },
        };
      }
    }

    // 3. If weeklyTargetId is being updated and is not null/undefined, verify weekly target ownership
    if (weeklyTargetId !== undefined && weeklyTargetId !== null) {
      const { data: weeklyTarget } = await supabase
        .from("v2_weekly_targets")
        .select("id")
        .eq("id", weeklyTargetId)
        .maybeSingle();

      if (!weeklyTarget) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Weekly target not found or access denied.",
          },
        };
      }

      // Check if it belongs to the user
      const { data: weeklyOwner } = await supabase
        .from("v2_weekly_targets")
        .select(`
          id,
          v2_monthly_targets (
            id,
            v2_goals (
              id,
              user_id
            )
          )
        `)
        .eq("id", weeklyTargetId)
        .single();

      const goalUser = (weeklyOwner as any)?.v2_monthly_targets?.v2_goals?.user_id;
      if (goalUser !== user.id) {
        return {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized access to weekly target.",
          },
        };
      }
    }

    // 4. Perform Update
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (domainId !== undefined) updateData.domain_id = domainId;
    if (weeklyTargetId !== undefined) updateData.weekly_target_id = weeklyTargetId;
    if (dueDate !== undefined) updateData.due_date = dueDate;
    if (weight !== undefined) updateData.weight = weight;

    const { data, error } = await supabase
      .from("v2_tasks")
      .update(updateData)
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
