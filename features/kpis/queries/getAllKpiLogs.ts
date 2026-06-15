import { createClient } from "@/lib/supabase-server";
import { KpiLog } from "@/types/kpi";

export async function getAllKpiLogs(): Promise<KpiLog[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Fetch logs that belong to definitions owned by user
  const { data, error } = await supabase
    .from("v2_kpi_logs")
    .select(`
      *,
      v2_kpi_definitions!inner (
        user_id
      )
    `)
    .eq("v2_kpi_definitions.user_id", user.id)
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
