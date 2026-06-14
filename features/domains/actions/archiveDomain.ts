"use server";

import { Domain } from "@/types/domain";
import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { evictUserDomainsCache } from "@/lib/redis";

export async function archiveDomain(id: string): Promise<ActionResponse<Domain>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

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

    const { data, error } = await supabase
      .from("v2_domains")
      .update({
        status: "archived",
        archived_at: new Date().toISOString(),
      })
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
