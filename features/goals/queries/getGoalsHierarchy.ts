import { createClient } from "@/lib/supabase-server";

export interface GoalHierarchyNode {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  yearlyTarget: number;
  unit: string;
  customUnit: string | null;
  status: string;
  progress: number;
  monthlyTargets: {
    id: string;
    month: string;
    targetValue: number;
    status: string;
    progress: number;
    weeklyTargets: {
      id: string;
      weekStart: string;
      weekEnd: string;
      targetValue: number;
      status: string;
      progress: number;
    }[];
  }[];
}

export async function getGoalsHierarchy(): Promise<GoalHierarchyNode[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // 1. Fetch all goals
  const { data: goals, error: goalsError } = await supabase
    .from("v2_goals")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  if (goalsError) throw new Error(goalsError.message);

  if (!goals || goals.length === 0) return [];

  // 2. Fetch monthly targets for these goals
  const goalIds = goals.map(g => g.id);
  const { data: monthlyTargets, error: monthlyError } = await supabase
    .from("v2_monthly_targets")
    .select("*")
    .in("goal_id", goalIds)
    .order("month", { ascending: true });

  if (monthlyError) throw new Error(monthlyError.message);

  // 3. Fetch weekly targets for these monthly targets
  const monthlyIds = (monthlyTargets || []).map(m => m.id);
  let weeklyTargets: any[] = [];
  if (monthlyIds.length > 0) {
    const { data: weekly, error: weeklyError } = await supabase
      .from("v2_weekly_targets")
      .select("*")
      .in("monthly_target_id", monthlyIds)
      .order("week_start", { ascending: true });

    if (weeklyError) throw new Error(weeklyError.message);
    weeklyTargets = weekly || [];
  }

  // 4. Fetch progress rollups from database views
  const { data: goalProgress } = await supabase
    .from("view_v2_goals_progress")
    .select("*");
  const { data: monthlyProgress } = await supabase
    .from("view_v2_monthly_targets_progress")
    .select("*");
  const { data: weeklyProgress } = await supabase
    .from("view_v2_weekly_targets_progress")
    .select("*");

  // Create progress lookup maps
  const goalProgressMap = new Map((goalProgress || []).map(p => [p.goal_id, Number(p.progress)]));
  const monthlyProgressMap = new Map((monthlyProgress || []).map(p => [p.monthly_target_id, Number(p.progress)]));
  const weeklyProgressMap = new Map((weeklyProgress || []).map(p => [p.weekly_target_id, Number(p.progress)]));

  // 5. Build hierarchy tree
  return goals.map((g): GoalHierarchyNode => {
    const months = (monthlyTargets || [])
      .filter((m) => m.goal_id === g.id)
      .map((m) => {
        const weeks = weeklyTargets
          .filter((w) => w.monthly_target_id === m.id)
          .map((w) => ({
            id: w.id,
            weekStart: w.week_start,
            weekEnd: w.week_end,
            targetValue: Number(w.target_value),
            status: w.status,
            progress: weeklyProgressMap.get(w.id) ?? 0,
          }));

        return {
          id: m.id,
          month: m.month,
          targetValue: Number(m.target_value),
          status: m.status,
          progress: monthlyProgressMap.get(m.id) ?? 0,
          weeklyTargets: weeks,
        };
      });

    return {
      id: g.id,
      title: g.title,
      startDate: g.start_date,
      endDate: g.end_date,
      yearlyTarget: Number(g.yearly_target),
      unit: g.unit,
      customUnit: g.custom_unit,
      status: g.status,
      progress: goalProgressMap.get(g.id) ?? 0,
      monthlyTargets: months,
    };
  });
}
