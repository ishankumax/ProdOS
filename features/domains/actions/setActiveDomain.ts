"use server";

import { ActionResponse } from "@/types/action";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";

export async function setActiveDomain(domainId: string | null): Promise<ActionResponse<{ activeDomainId: string | null }>> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    if (domainId !== null) {
      const supabase = createClient();
      
      // Check ownership & existence
      const { data: existing, error } = await supabase
        .from("v2_domains")
        .select("id")
        .eq("id", domainId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !existing) {
        return { success: false, error: { code: "NOT_FOUND", message: "Domain not found or access denied." } };
      }
    }

    const cookieStore = cookies();
    if (domainId) {
      cookieStore.set("v2_active_domain_id", domainId, {
        path: "/",
        maxAge: 31536000, // 1 year in seconds
        httpOnly: false,  // Allow client reading for simple client-side state
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      cookieStore.delete("v2_active_domain_id");
    }

    return {
      success: true,
      data: { activeDomainId: domainId },
    };
  } catch (err: any) {
    return { success: false, error: { code: "DATABASE_ERROR", message: err.message || "An unknown error occurred" } };
  }
}

export async function getActiveDomain(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get("v2_active_domain_id")?.value ?? null;
}
