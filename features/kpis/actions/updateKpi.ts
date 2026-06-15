"use server";

import { UpdateKpiSchema } from "@/lib/validation/kpi";
import { KpiDefinition } from "@/types/kpi";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserGoalsCache } from "@/lib/redis";

export async function updateKpi(rawInput: unknown): Promise<ActionResponse<KpiDefinition>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = UpdateKpiSchema.safeParse(rawInput);
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

    const { id, name, domainId, metricType, unit, targetValue } = validation.data;
    const supabase = createClient();

    // 1. Verify KPI definition ownership
    const { data: existingKpi } = await supabase
      .from("v2_kpi_definitions")
      .select("id, user_id, domain_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingKpi) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "KPI definition not found or access denied.",
        },
      };
    }

    const targetDomainId = domainId || existingKpi.domain_id;

    // 2. If domainId is updated, verify domain ownership
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

    // 3. If name is being updated, ensure uniqueness in the target domain
    if (name) {
      const { data: duplicateKpi } = await supabase
        .from("v2_kpi_definitions")
        .select("id")
        .eq("user_id", user.id)
        .eq("domain_id", targetDomainId)
        .eq("name", name)
        .neq("id", id)
        .maybeSingle();

      if (duplicateKpi) {
        return {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "A metric with this name already exists in this domain.",
            details: [{ field: "name", issue: "Name must be unique" }],
          },
        };
      }
    }

    // 4. Perform Update
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (domainId !== undefined) updateData.domain_id = domainId;
    if (metricType !== undefined) updateData.metric_type = metricType;
    if (unit !== undefined) updateData.unit = unit;
    if (targetValue !== undefined) updateData.target_value = targetValue;

    const { data, error } = await supabase
      .from("v2_kpi_definitions")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
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
