"use server";

import { UpdateDomainSchema } from "@/lib/validation/domain";
import { Domain } from "@/types/domain";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserDomainsCache } from "@/lib/redis";

export async function updateDomain(rawInput: unknown): Promise<ActionResponse<Domain>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = UpdateDomainSchema.safeParse(rawInput);
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
      .from("v2_domains")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (findError || !existing) {
      return { success: false, error: { code: "NOT_FOUND", message: "Domain not found or access denied." } };
    }

    // Prepare fields to map DB columns
    const mappedFields: Record<string, any> = {};
    if (updateFields.name !== undefined) mappedFields.name = updateFields.name;
    if (updateFields.description !== undefined) mappedFields.description = updateFields.description;
    if (updateFields.iconKey !== undefined) mappedFields.icon_key = updateFields.iconKey;
    if (updateFields.colorHex !== undefined) mappedFields.color_hex = updateFields.colorHex;
    if (updateFields.priority !== undefined) mappedFields.priority = updateFields.priority;
    if (updateFields.status !== undefined) mappedFields.status = updateFields.status;

    const { data, error } = await supabase
      .from("v2_domains")
      .update(mappedFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: { code: "DATABASE_ERROR", message: error.message } };
    }

    // Evict Redis caches
    await evictUserDomainsCache(user.id);

    return {
      success: true,
      data: {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        description: data.description,
        iconKey: data.icon_key,
        colorHex: data.color_hex,
        status: data.status,
        priority: data.priority,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        archivedAt: data.archived_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: { code: "DATABASE_ERROR", message: err.message || "An unknown error occurred" } };
  }
}
