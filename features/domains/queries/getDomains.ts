import { createClient } from "@/lib/supabase-server";
import { Domain } from "@/types/domain";

export async function getDomains(): Promise<Domain[]> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("v2_domains")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "archived")
    .order("priority", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    iconKey: row.icon_key,
    colorHex: row.color_hex,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  }));
}
