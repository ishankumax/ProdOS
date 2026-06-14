"use server";

import { Goal } from "@/types/goal";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserGoalsCache } from "@/lib/redis";

export async function pauseGoal(id: string): Promise<ActionResponse<Goal>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const supabase = createClient();
    
    // Check ownership
    const { data: existing, error: findError } = await supabase
      .from("v2_goals")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (findError || !existing) {
      return { success: false, error: { code: "NOT_FOUND", message: "Goal not found or access denied." } };
    }

    // Update goal status
    const { data: goal, error } = await supabase
      .from("v2_goals")
      .update({ status: "paused" })
      .eq("id", id)
      .select()
      .single();

    if (error || !goal) {
      return { success: false, error: { code: "DATABASE_ERROR", message: error?.message || "Failed to update goal" } };
    }

    // Cascade update to monthly targets
    const { data: months } = await supabase
      .from("v2_monthly_targets")
      .update({ status: "paused" })
      .eq("goal_id", id)
      .select("id");

    if (months && months.length > 0) {
      const monthIds = months.map(m => m.id);
      
      // Cascade update to weekly targets
      await supabase
        .from("v2_weekly_targets")
        .update({ status: "paused" })
        .in("monthly_target_id", monthIds);
    }

    // Evict Redis caches
    await evictUserGoalsCache(user.id);

    return {
      success: true,
      data: {
        id: goal.id,
        userId: goal.user_id,
        domainId: goal.domain_id,
        title: goal.title,
        description: goal.description,
        goalType: goal.goal_type,
        yearlyTarget: goal.yearly_target,
        unit: goal.unit,
        customUnit: goal.custom_unit,
        startDate: goal.start_date,
        endDate: goal.end_date,
        status: goal.status,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at,
        archivedAt: goal.archived_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: { code: "DATABASE_ERROR", message: err.message || "An unknown error occurred" } };
  }
}
