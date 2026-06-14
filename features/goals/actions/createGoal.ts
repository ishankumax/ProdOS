"use server";

import { CreateGoalSchema } from "@/lib/validation/goal";
import { Goal } from "@/types/goal";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserGoalsCache } from "@/lib/redis";
import { generateMonthlyTargets, generateWeeklyTargets } from "../utils/targetGenerator";

export async function createGoal(rawInput: unknown): Promise<ActionResponse<Goal>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = CreateGoalSchema.safeParse(rawInput);
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

    const supabase = createClient();
    
    // Verify domain ownership
    const { data: domain } = await supabase
      .from("v2_domains")
      .select("id")
      .eq("id", validation.data.domainId)
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

    // 1. Insert Goal
    const { data: goal, error: goalError } = await supabase
      .from("v2_goals")
      .insert({
        user_id: user.id,
        domain_id: validation.data.domainId,
        title: validation.data.title,
        description: validation.data.description,
        goal_type: validation.data.goalType,
        yearly_target: validation.data.yearlyTarget,
        unit: validation.data.unit,
        custom_unit: validation.data.customUnit,
        start_date: validation.data.startDate,
        end_date: validation.data.endDate,
        status: validation.data.status,
      })
      .select()
      .single();

    if (goalError || !goal) {
      return { success: false, error: { code: "DATABASE_ERROR", message: goalError?.message || "Goal insertion failed" } };
    }

    // 2. Generate Monthly Targets
    const monthlyInputs = generateMonthlyTargets(goal.yearly_target, goal.start_date, goal.end_date);
    
    for (const monthlyInput of monthlyInputs) {
      const { data: monthRecord, error: monthError } = await supabase
        .from("v2_monthly_targets")
        .insert({
          goal_id: goal.id,
          month: monthlyInput.month,
          target_value: monthlyInput.targetValue,
          status: goal.status,
        })
        .select()
        .single();

      if (monthError || !monthRecord) {
        // Rollback Goal on failure (simplified fallback)
        await supabase.from("v2_goals").delete().eq("id", goal.id);
        return { success: false, error: { code: "DATABASE_ERROR", message: monthError?.message || "Monthly target creation failed" } };
      }

      // 3. Generate Weekly Targets
      const weeklyInputs = generateWeeklyTargets(monthRecord.target_value, monthRecord.month);
      
      const weeklyRecordsToInsert = weeklyInputs.map(weekly => ({
        monthly_target_id: monthRecord.id,
        week_start: weekly.weekStart,
        week_end: weekly.weekEnd,
        target_value: weekly.targetValue,
        status: goal.status,
      }));

      const { error: weeklyError } = await supabase
        .from("v2_weekly_targets")
        .insert(weeklyRecordsToInsert);

      if (weeklyError) {
        // Rollback Goal
        await supabase.from("v2_goals").delete().eq("id", goal.id);
        return { success: false, error: { code: "DATABASE_ERROR", message: weeklyError.message } };
      }
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
