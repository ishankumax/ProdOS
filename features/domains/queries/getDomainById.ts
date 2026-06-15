import { createClient } from "@/lib/supabase-server";
import { Domain } from "@/types/domain";

export async function getDomainById(id: string): Promise<Domain | null> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("v2_domains")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(error.message);
  }

  return {
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
  };
}
