export type GoalType = "daily" | "weekly" | "monthly";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  type: GoalType;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type GoalFilter = GoalType | "all";
