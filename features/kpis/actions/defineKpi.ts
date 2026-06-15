"use server";

import { DefineKpiSchema } from "@/lib/validation/kpi";
import { KpiDefinition } from "@/types/kpi";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserGoalsCache } from "@/lib/redis"; // KPI changes affect analytics progress rollups, which are evicted by evictUserGoalsCache

export async function defineKpi(rawInput: unknown): Promise<ActionResponse<KpiDefinition>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = DefineKpiSchema.safeParse(rawInput);
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

    const { domainId, name, metricType, unit, targetValue } = validation.data;
    const supabase = createClient();

    // 1. Verify domain ownership
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

    // 2. Check if a KPI definition with the same name already exists in this domain
    const { data: existingKpi } = await supabase
      .from("v2_kpi_definitions")
      .select("id")
      .eq("user_id", user.id)
      .eq("domain_id", domainId)
      .eq("name", name)
      .maybeSingle();

    if (existingKpi) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "A metric with this name already exists in this domain.",
          details: [{ field: "name", issue: "Name must be unique in this domain" }],
        },
      };
    }

    // 3. Insert KPI Definition
    const { data, error } = await supabase
      .from("v2_kpi_definitions")
      .insert({
        user_id: user.id,
        domain_id: domainId,
        name,
        metric_type: metricType,
        unit,
        target_value: targetValue || null,
      })
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
        name: data.name,
        metricType: data.metric_type,
        unit: data.unit,
        targetValue: data.target_value !== null ? Number(data.target_value) : null,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: { code: "DATABASE_ERROR", message: err.message || "An unknown error occurred" } };
  }
}
