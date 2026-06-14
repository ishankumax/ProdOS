import { createClient } from "@/lib/supabase-server";
import { Goal } from "@/types/goal";

export async function getGoalsByDomain(domainId: string): Promise<Goal[]> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("v2_goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("domain_id", domainId)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    domainId: row.domain_id,
    title: row.title,
    description: row.description,
    goalType: row.goal_type,
    yearlyTarget: row.yearly_target,
    unit: row.unit,
    customUnit: row.custom_unit,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  }));
}
