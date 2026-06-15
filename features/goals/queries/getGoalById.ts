import { createClient } from "@/lib/supabase-server";
import { Goal } from "@/types/goal";

export async function getGoalById(id: string): Promise<Goal | null> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("v2_goals")
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
    domainId: data.domain_id,
    title: data.title,
    description: data.description,
    goalType: data.goal_type,
    yearlyTarget: data.yearly_target,
    unit: data.unit,
    customUnit: data.custom_unit,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    archivedAt: data.archived_at,
  };
}
