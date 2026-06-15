import { createClient } from "@/lib/supabase-server";
import { Task } from "@/types/task";

export async function getTasks(): Promise<Task[]> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("v2_tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    domainId: row.domain_id,
    weeklyTargetId: row.weekly_target_id,
    title: row.title,
    completed: row.completed,
    completedAt: row.completed_at,
    dueDate: row.due_date,
    weight: Number(row.weight),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}
