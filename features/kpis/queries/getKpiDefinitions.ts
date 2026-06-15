import { createClient } from "@/lib/supabase-server";
import { KpiDefinition } from "@/types/kpi";

export async function getKpiDefinitions(domainId?: string): Promise<KpiDefinition[]> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let query = supabase
    .from("v2_kpi_definitions")
    .select("*")
    .eq("user_id", user.id);

  if (domainId) {
    query = query.eq("domain_id", domainId);
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    domainId: row.domain_id,
    name: row.name,
    metricType: row.metric_type,
    unit: row.unit,
    targetValue: row.target_value !== null ? Number(row.target_value) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}
