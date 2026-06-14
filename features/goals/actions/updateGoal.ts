"use server";

import { UpdateGoalSchema } from "@/lib/validation/goal";
import { Goal } from "@/types/goal";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserGoalsCache } from "@/lib/redis";

export async function updateGoal(rawInput: unknown): Promise<ActionResponse<Goal>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = UpdateGoalSchema.safeParse(rawInput);
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

    const { id, ...updateFields } = validation.data;

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

    // Map properties to DB columns
    const mappedFields: Record<string, any> = {};
    if (updateFields.title !== undefined) mappedFields.title = updateFields.title;
    if (updateFields.description !== undefined) mappedFields.description = updateFields.description;
    if (updateFields.goalType !== undefined) mappedFields.goal_type = updateFields.goalType;
    if (updateFields.yearlyTarget !== undefined) mappedFields.yearly_target = updateFields.yearlyTarget;
    if (updateFields.unit !== undefined) mappedFields.unit = updateFields.unit;
    if (updateFields.customUnit !== undefined) mappedFields.custom_unit = updateFields.customUnit;
    if (updateFields.startDate !== undefined) mappedFields.start_date = updateFields.startDate;
    if (updateFields.endDate !== undefined) mappedFields.end_date = updateFields.endDate;
    if (updateFields.status !== undefined) mappedFields.status = updateFields.status;

    const { data, error } = await supabase
      .from("v2_goals")
      .update(mappedFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: { code: "DATABASE_ERROR", message: error.message } };
    }

    // Evict Redis caches
    await evictUserGoalsCache(user.id);

    return {
      success: true,
      data: {
        id: data.id,
        userId: data.user_id,
        domainId: data.domain_id,
        title: data.title,
        description: data.description,
        goalType: data.goal_type,
        yearlyTarget: data.yearly_target,
        unit: data.unit,
        customUnit: data.custom_unit,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        archivedAt: data.archived_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: { code: "DATABASE_ERROR", message: err.message || "An unknown error occurred" } };
  }
}
