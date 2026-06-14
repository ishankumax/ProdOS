"use server";

import { CreateDomainSchema } from "@/lib/validation/domain";
import { Domain } from "@/types/domain";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserDomainsCache } from "@/lib/redis";

export async function createDomain(rawInput: unknown): Promise<ActionResponse<Domain>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validation = CreateDomainSchema.safeParse(rawInput);
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
    
    // Check if a domain with this name already exists for the user
    const { data: existingDomain } = await supabase
      .from("v2_domains")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", validation.data.name)
      .maybeSingle();

    if (existingDomain) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "A domain with this name already exists.",
          details: [{ field: "name", issue: "Name must be unique" }],
        },
      };
    }

    const { data, error } = await supabase
      .from("v2_domains")
      .insert({
        user_id: user.id,
        name: validation.data.name,
        description: validation.data.description,
        icon_key: validation.data.iconKey,
        color_hex: validation.data.colorHex,
        status: validation.data.status,
        priority: validation.data.priority,
      })
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
