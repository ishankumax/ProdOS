"use server";

import { CreateTaskSchema } from "@/lib/validation/task";
import { Task } from "@/types/task";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserTasksCache } from "@/lib/redis";

export async function createTask(rawInput: unknown): Promise<ActionResponse<Task>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = CreateTaskSchema.safeParse(rawInput);
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

    const { title, domainId, weeklyTargetId, dueDate, weight } = validation.data;
    const supabase = createClient();

    // 1. If domainId is provided, verify domain ownership
    if (domainId) {
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

    // 2. If weeklyTargetId is provided, verify weekly target ownership (via monthly_target -> goal)
    if (weeklyTargetId) {
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

    // 3. Insert Task
    const { data, error } = await supabase
      .from("v2_tasks")
      .insert({
        user_id: user.id,
        domain_id: domainId || null,
        weekly_target_id: weeklyTargetId || null,
        title,
        completed: false,
        due_date: dueDate,
        weight,
      })
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
