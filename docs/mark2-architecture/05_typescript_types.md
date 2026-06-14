# 05. TypeScript Types & Interfaces

This document contains the core TypeScript types, interfaces, and enums required to implement the ProdOS Mark 2 codebase. These interfaces mirror the database schema and provide complete type safety across API routes and components.

---

## 1. Domain Types & Enums

```typescript
export type GoalLevel = "yearly" | "monthly" | "weekly";
export type KpiMetricType = "input" | "output" | "outcome";

export interface Domain {
  id: string; // UUID
  userId: string; // UUID
  name: string; // e.g. 'ReadNovaStory'
  colorHex: string; // Hex code format (e.g. '#10B981')
  createdAt: string; // ISO DateTime
  updatedAt: string; // ISO DateTime
}
```

---

## 2. Goals & Hierarchy Types

```typescript
export interface Goal {
  id: string; // UUID
  userId: string; // UUID
  parentId: string | null; // UUID (Self-reference to parent goal)
  title: string;
  goalLevel: GoalLevel;
  targetValue: number;
  unit: string; // e.g. 'Contributions', 'USD', 'Books'
  startDate: string; // ISO Date String (YYYY-MM-DD)
  endDate: string; // ISO Date String (YYYY-MM-DD)
  createdAt: string;
  updatedAt: string;
}

// Representing the dynamic rollup calculation from database views
export interface GoalProgressRollup {
  goalId: string;
  progress: number; // calculated percentage [0.00 - 100.00]
}

// Combined structure containing both goals and their dynamic calculated progress
export interface GoalWithProgress extends Goal {
  progress: number;
}
```

---

## 3. Tasks Types

```typescript
export interface Task {
  id: string; // UUID
  userId: string; // UUID
  domainId: string | null; // Nullable for Global Tasks
  goalId: string | null; // Nullable (Typically links to a Weekly Target)
  title: string;
  completed: boolean;
  completedAt: string | null; // ISO DateTime
  dueDate: string; // ISO Date String (YYYY-MM-DD)
  weight: number; // default 1.00
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. KPI System Types

```typescript
export interface KpiDefinition {
  id: string; // UUID
  userId: string; // UUID
  domainId: string; // Associated Domain focus area
  name: string; // e.g., 'Revenue'
  metricType: KpiMetricType; // 'input' | 'output' | 'outcome'
  unit: string; // e.g. 'USD', 'calls', 'books'
  targetValue: number | null; // Optional target per period
  createdAt: string;
  updatedAt: string;
}

export interface KpiLog {
  id: string; // UUID
  kpiDefinitionId: string; // References KpiDefinition
  value: number;
  logDate: string; // ISO Date String (YYYY-MM-DD)
  notes: string | null;
  createdAt: string;
}
```

---

## 5. Analytics Aggregate Types

These match the required outputs in the frontend dashboards.

```typescript
export interface DailyScore {
  date: string; // YYYY-MM-DD
  completedTasksCount: number;
  plannedTasksCount: number;
  scorePercentage: number; // (completed/planned) * 100
}

export interface WeeklyVelocity {
  weekStartDate: string; // YYYY-MM-DD
  totalTasksCompleted: number;
  completionRate: number; // percentage
}

export interface DomainPerformance {
  domainId: string;
  domainName: string;
  colorHex: string;
  tasksCompleted: number;
  outcomeMetricsValue: Record<string, number>; // maps kpi_name -> accumulated value (e.g., 'Revenue' -> 5000)
}

export interface DashboardAnalytics {
  dailyScores: DailyScore[];
  weeklyVelocity: WeeklyVelocity;
  domainPerformances: DomainPerformance[];
  goodGoingReasons: string[];
  needsAttentionReasons: string[];
}
```
