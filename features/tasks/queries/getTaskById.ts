import { createClient } from "@/lib/supabase-server";
import { Task } from "@/types/task";

export async function getTaskById(taskId: string): Promise<Task | null> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("v2_tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    domainId: data.domain_id,
    weeklyTargetId: data.weekly_target_id,
    title: data.title,
    completed: data.completed,
    completedAt: data.completed_at,
    dueDate: data.due_date,
    weight: Number(data.weight),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
