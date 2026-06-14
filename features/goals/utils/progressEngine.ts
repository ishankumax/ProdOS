import { createClient } from "@/lib/supabase-server";

/**
 * Computes progress of a weekly target by summing the weights of completed tasks.
 */
export async function calculateWeeklyProgress(weeklyTargetId: string): Promise<number> {
  const supabase = createClient();
  
  const { data: tasks, error } = await supabase
    .from("v2_tasks")
    .select("completed, weight")
    .eq("weekly_target_id", weeklyTargetId);

  if (error || !tasks || tasks.length === 0) {
    return 0.00;
  }

  const totalWeight = tasks.reduce((sum, t) => sum + Number(t.weight), 0);
  if (totalWeight === 0) return 0.00;

  const completedWeight = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + Number(t.weight), 0);

  return Math.round((completedWeight / totalWeight) * 10000) / 100;
}

/**
 * Computes progress of a monthly target by averaging its child weekly target progresses.
 */
export async function calculateMonthlyProgress(monthlyTargetId: string): Promise<number> {
  const supabase = createClient();

  const { data: weeks, error } = await supabase
    .from("v2_weekly_targets")
    .select("id")
    .eq("monthly_target_id", monthlyTargetId)
    .neq("status", "archived");

  if (error || !weeks || weeks.length === 0) {
    return 0.00;
  }

  let totalProgress = 0;
  for (const week of weeks) {
    const progress = await calculateWeeklyProgress(week.id);
    totalProgress += progress;
  }

  return Math.round((totalProgress / weeks.length) * 100) / 100;
}

/**
 * Computes progress of a yearly goal by averaging its child monthly target progresses.
 */
export async function calculateGoalProgress(goalId: string): Promise<number> {
  const supabase = createClient();

  const { data: months, error } = await supabase
    .from("v2_monthly_targets")
    .select("id")
    .eq("goal_id", goalId)
    .neq("status", "archived");

  if (error || !months || months.length === 0) {
    return 0.00;
  }

  let totalProgress = 0;
  for (const month of months) {
    const progress = await calculateMonthlyProgress(month.id);
    totalProgress += progress;
  }

  return Math.round((totalProgress / months.length) * 100) / 100;
}
