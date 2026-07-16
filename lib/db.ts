import { createClient } from "@/utils/supabase/client";

export type TableName = "tasks" | "recycle_bin" | "habits" | "journal_entries";

// ── Generic helpers ────────────────────────────────────────────────────────────

export async function dbUpsert(table: TableName, row: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase.from(table).upsert(row);
  if (error) console.error(`[DB] upsert ${table}:`, error.message);
}

export async function dbDelete(table: TableName, id: string) {
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) console.error(`[DB] delete ${table}:`, error.message);
}

export async function dbSelectByUser<T>(
  table: TableName,
  userId: string
): Promise<T[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error(`[DB] select ${table}:`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}

export async function dbDeleteWhere(
  table: TableName,
  col: string,
  val: string | number
) {
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq(col, val);
  if (error) console.error(`[DB] deleteWhere ${table}:`, error.message);
}
