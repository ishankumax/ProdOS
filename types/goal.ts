export type GoalStatus = "active" | "completed" | "paused" | "archived" | "future";
export type GoalType = "numeric" | "boolean" | "milestone";
export type GoalUnit = "count" | "currency" | "hours" | "days" | "kilograms" | "percentage" | "custom";

export interface Goal {
  id: string; // UUID
  userId: string; // UUID
  domainId: string; // UUID
  title: string;
  description: string | null;
  goalType: GoalType;
  yearlyTarget: number;
  unit: GoalUnit;
  customUnit: string | null;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO timestamptz
  updatedAt: string; // ISO timestamptz
  archivedAt: string | null; // ISO timestamptz
}

export interface MonthlyTarget {
  id: string; // UUID
  goalId: string; // UUID
  month: string; // YYYY-MM-01 date string
  targetValue: number;
  status: GoalStatus;
  createdAt: string; // ISO timestamptz
}

export interface WeeklyTarget {
  id: string; // UUID
  monthlyTargetId: string; // UUID
  weekStart: string; // YYYY-MM-DD date string
  weekEnd: string; // YYYY-MM-DD date string
  targetValue: number;
  status: GoalStatus;
  createdAt: string; // ISO timestamptz
}

export interface GoalContribution {
  id: string;
  goalId: string;
  domainId: string;
  contributionPercentage: number;
  createdAt: string;
}

export interface GoalProgress {
  goalId: string;
  progress: number;
}
export interface GoalForecast {
  expectedProgress: number;
  currentProgress: number;
  forecastStatus: "ahead" | "behind" | "on_track";
}
export interface DomainGoalContribution {
  domainId: string;
  domainName: string;
  colorHex: string;
  percentage: number;
}
