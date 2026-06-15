"use server";

import { LogKpiSchema } from "@/lib/validation/kpi";
import { KpiLog } from "@/types/kpi";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserGoalsCache } from "@/lib/redis";

export async function logKpiValue(rawInput: unknown): Promise<ActionResponse<KpiLog>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = LogKpiSchema.safeParse(rawInput);
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

    const { kpiDefinitionId, value, logDate, notes } = validation.data;

    // 1. Prevent future dates
    // Using current local time offset or UTC? Let's check against UTC first or standard local date
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000; // in ms
    const localISODate = new Date(today.getTime() - tzOffset).toISOString().split("T")[0]!;
    
    if (logDate > localISODate) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Cannot log values for future dates.",
          details: [{ field: "logDate", issue: "Log date cannot be in the future" }],
        },
      };
    }

    const supabase = createClient();

    // 2. Verify KPI definition exists and belongs to the user
    const { data: definition } = await supabase
      .from("v2_kpi_definitions")
      .select("id, user_id")
      .eq("id", kpiDefinitionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!definition) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "KPI definition not found or access denied.",
        },
      };
    }

    // 3. Upsert KPI log entry
    const { data, error } = await supabase
      .from("v2_kpi_logs")
      .upsert(
        {
          kpi_definition_id: kpiDefinitionId,
          value,
          log_date: logDate,
          notes: notes || null,
        },
        { onConflict: "kpi_definition_id,log_date" }
      )
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
        kpiDefinitionId: data.kpi_definition_id,
        value: Number(data.value),
        logDate: data.log_date,
        notes: data.notes,
        createdAt: data.created_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: { code: "DATABASE_ERROR", message: err.message || "An unknown error occurred" } };
  }
}
