export type KpiMetricType = "input" | "output" | "outcome";

export interface KpiDefinition {
  id: string; // UUID
  userId: string; // UUID
  domainId: string; // UUID
  name: string;
  metricType: KpiMetricType;
  unit: string;
  targetValue: number | null;
  createdAt: string; // ISO timestamptz
  updatedAt: string; // ISO timestamptz
}

export interface KpiLog {
  id: string; // UUID
  kpiDefinitionId: string; // UUID
  value: number;
  logDate: string; // YYYY-MM-DD date string
  notes: string | null;
  createdAt: string; // ISO timestamptz
}
