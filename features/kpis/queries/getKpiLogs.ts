import { createClient } from "@/lib/supabase-server";
import { KpiLog } from "@/types/kpi";

export async function getKpiLogs(kpiDefinitionId: string): Promise<KpiLog[]> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1. Verify owner of the definition
  const { data: kpi } = await supabase
    .from("v2_kpi_definitions")
    .select("id")
    .eq("id", kpiDefinitionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!kpi) {
    throw new Error("KPI definition not found or access denied.");
  }

  const { data, error } = await supabase
    .from("v2_kpi_logs")
    .select("*")
    .eq("kpi_definition_id", kpiDefinitionId)
    .order("log_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    kpiDefinitionId: row.kpi_definition_id,
    value: Number(row.value),
    logDate: row.log_date,
    notes: row.notes,
    createdAt: row.created_at,
  }));
}
