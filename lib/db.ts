import { createClient } from "@/utils/supabase/client";

export type TableName =
  | "tasks"
  | "recycle_bin"
  | "habits"
  | "journal_entries"
  | "daily_entries"
  | "daily_tasks";

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

/** Select rows matching user_id AND one additional column filter */
export async function dbSelectByUserAndCol<T>(
  table: TableName,
  userId: string,
  col: string,
  val: string | number
): Promise<T[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId)
    .eq(col, val);
  if (error) {
    console.error(`[DB] selectByUserAndCol ${table}:`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}

/** Select rows matching user_id where a column is in a list of values */
export async function dbSelectByUserWhereIn<T>(
  table: TableName,
  userId: string,
  col: string,
  vals: (string | number)[]
): Promise<T[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId)
    .in(col, vals);
  if (error) {
    console.error(`[DB] selectByUserWhereIn ${table}:`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}
