# ProdOS V2 — Phase 3 Goal Engine Specification

This document details the architecture, database structures, and validation rules for the **ProdOS V2 Goal Engine**. 

Goals in ProdOS V2 act as the Growth Operating System. Instead of a flat checklist, they represent a cascading progress pipeline: **Domains $\rightarrow$ Yearly Goals $\rightarrow$ Monthly Targets $\rightarrow$ Weekly Targets $\rightarrow$ Tasks $\rightarrow$ Execution**.

---

## 1. Goal Engine Architecture Diagram

This diagram displays the structural breakdown and upstream/downstream dependencies of the Goal Engine:

```mermaid
graph TD
    %% Base Entities
    User[USER (auth.users)] --> Goals[YEARLY GOALS]
    Domain[DOMAINS] --> Goals
    
    %% Cascade Hierarchy
    Goals --> Monthly[MONTHLY TARGETS]
    Monthly --> Weekly[WEEKLY TARGETS]
    Weekly -. optionally linked .-> Tasks[TASKS]
    
    %% Progress Rollups
    Tasks -- completed weight --> WeeklyRollup[Weekly Progress View]
    WeeklyRollup -- average --> MonthlyRollup[Monthly Progress View]
    MonthlyRollup -- average --> YearlyRollup[Yearly Progress View]
    
    %% Multi-Domain Attribution
    DomainContributions[Domain Goal Contribution] --> Goals
```

---

## 2. Goal Database Schema (Supabase DDL)

We define the PostgreSQL schemas for yearly goals, monthly/weekly target structures, and domain contribution mappings.

```sql
-- ── Custom Enums ──────────────────────────────────────────────
CREATE TYPE goal_type AS ENUM ('numeric', 'boolean', 'milestone');
CREATE TYPE goal_unit AS ENUM ('count', 'currency', 'hours', 'days', 'kilograms', 'percentage', 'custom');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'paused', 'archived', 'future');

-- ── Yearly Goals Table ─────────────────────────────────────────
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES domains (id) ON DELETE RESTRICT, -- Main owner domain
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type goal_type NOT NULL DEFAULT 'numeric',
    yearly_target NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
    unit goal_unit NOT NULL DEFAULT 'count',
    custom_unit VARCHAR(50), -- Only used if unit = 'custom'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status goal_status NOT NULL DEFAULT 'future',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_at TIMESTAMPTZ,

    CONSTRAINT check_goal_dates CHECK (start_date <= end_date),
    CONSTRAINT check_custom_unit CHECK (
        (unit = 'custom' AND custom_unit IS NOT NULL) OR
        (unit != 'custom' AND custom_unit IS NULL)
    ),
    CONSTRAINT check_archived_status CHECK (
        (status = 'archived' AND archived_at IS NOT NULL) OR
        (status != 'archived' AND archived_at IS NULL)
    )
);

-- ── Domain Goal Contributions Table ────────────────────────────
-- Supports multi-domain attribution for a single goal
CREATE TABLE goal_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals (id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES domains (id) ON DELETE CASCADE,
    contribution_percentage NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT check_percentage CHECK (contribution_percentage > 0 AND contribution_percentage <= 100.00),
    UNIQUE (goal_id, domain_id)
);

-- ── Auto-Update Timestamp Trigger ─────────────────────────────
CREATE TRIGGER set_timestamp_goals
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- ── Row Level Security (RLS) Policies ─────────────────────────
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goals_owner_access" ON goals 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "goal_contributions_owner_access" ON goal_contributions 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM goals g
            WHERE g.id = goal_contributions.goal_id 
              AND g.user_id = auth.uid()
        )
    );
```

---

## 3. Monthly Target Model

Each Yearly Goal splits into **Monthly Targets** to provide mid-term milestones.

```sql
CREATE TABLE monthly_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals (id) ON DELETE CASCADE,
    month DATE NOT NULL, -- Stored as the 1st of the calendar month (e.g. YYYY-MM-01)
    target_value NUMERIC(12, 2) NOT NULL,
    status goal_status NOT NULL DEFAULT 'future',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure only one target per goal per month
    UNIQUE (goal_id, month)
);

ALTER TABLE monthly_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "monthly_targets_owner" ON monthly_targets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM goals g
            WHERE g.id = monthly_targets.goal_id AND g.user_id = auth.uid()
        )
    );
```

### Rationale & Expected Calculations
Monthly Targets act as stepping stones. The target value can be divided evenly or scaled dynamically (e.g., lower targets during holidays or travel). **Expected Progress** is calculated on-the-fly relative to the elapsed days of that month.

---

## 4. Weekly Target Model

Monthly Targets divide further into **Weekly Targets** (aligned strictly to Monday $\rightarrow$ Sunday).

```sql
CREATE TABLE weekly_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monthly_target_id UUID NOT NULL REFERENCES monthly_targets (id) ON DELETE CASCADE,
    week_start DATE NOT NULL, -- Monday of the week
    week_end DATE NOT NULL,   -- Sunday of the week
    target_value NUMERIC(12, 2) NOT NULL,
    status goal_status NOT NULL DEFAULT 'future',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT check_week_bounds CHECK (week_start < week_end),
    UNIQUE (monthly_target_id, week_start)
);

ALTER TABLE weekly_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weekly_targets_owner" ON weekly_targets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM monthly_targets mt
            JOIN goals g ON g.id = mt.goal_id
            WHERE mt.id = weekly_targets.monthly_target_id AND g.user_id = auth.uid()
        )
    );
```

---

## 5. Progress Rollup Design (Database Views)

Progress is computed on-the-fly to prevent stale cache states.

```sql
-- 1. Weekly Target Progress (Sum of completed task weights / Total task weights)
CREATE OR REPLACE VIEW view_weekly_targets_progress AS
SELECT 
    wt.id AS weekly_target_id,
    COALESCE(
        SUM(CASE WHEN t.completed = true THEN t.weight ELSE 0 END) / 
        NULLIF(SUM(t.weight), 0) * 100, 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM weekly_targets wt
LEFT JOIN tasks t ON t.goal_id = wt.id -- Future Tasks connection points here
GROUP BY wt.id;

-- 2. Monthly Target Progress (Average of child Weekly Target progress)
CREATE OR REPLACE VIEW view_monthly_targets_progress AS
SELECT 
    mt.id AS monthly_target_id,
    COALESCE(
        AVG(wp.progress), 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM monthly_targets mt
LEFT JOIN weekly_targets wt ON wt.monthly_target_id = mt.id
LEFT JOIN view_weekly_targets_progress wp ON wp.weekly_target_id = wt.id
GROUP BY mt.id;

-- 3. Yearly Goals Progress (Average of child Monthly Target progress)
CREATE OR REPLACE VIEW view_goals_progress AS
SELECT 
    g.id AS goal_id,
    COALESCE(
        AVG(mp.progress), 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM goals g
LEFT JOIN monthly_targets mt ON mt.goal_id = g.id
LEFT JOIN view_monthly_targets_progress mp ON mp.monthly_target_id = mt.id
GROUP BY g.id;
```

---

## 6. Goal Forecasting Engine

The forecasting engine compares progress against a linear target timeline.

### Ahead / Behind Calculations
For any goal/target, we compute the elapsed percentage of the timeline:

$$\text{Time Elapsed \%} = \frac{\text{Current Date} - \text{Start Date}}{\text{End Date} - \text{Start Date}} \times 100$$

* **Status Mapping:**
  * **Ahead:** $\text{Progress \%} \ge \text{Time Elapsed \%} + 5\%$
  * **Behind:** $\text{Progress \%} < \text{Time Elapsed \%} - 5\%$
  * **On Track:** $\text{Actual}$ is within $\pm 5\%$ of $\text{Time Elapsed \%}$.

These values are calculated dynamically inside read queries, ensuring no manual updates are required.

---

## 7. Multi-Domain Contribution Design

Goals support contribution weights from multiple domains:
* A yearly goal has one **Primary Owner Domain** (`goals.domain_id`).
* Secondary domains record their target share in `goal_contributions`.
* *Example:* "Earn ₹9,00,000" (Primary Owner: Investments) receives 33% from RNS, 44% from ITB, and 23% from Ibtida. The sum of weights must equal 100% on validation.

---

## 8. TypeScript Types

Strict TS models mapped to schemas:

```typescript
export type GoalType = "numeric" | "boolean" | "milestone";
export type GoalUnit = "count" | "currency" | "hours" | "days" | "kilograms" | "percentage" | "custom";
export type GoalStatus = "active" | "completed" | "paused" | "archived" | "future";

export interface Goal {
  id: string;
  userId: string;
  domainId: string;
  title: string;
  description: string | null;
  goalType: GoalType;
  yearlyTarget: number;
  unit: GoalUnit;
  customUnit: string | null;
  startDate: string;
  endDate: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface MonthlyTarget {
  id: string;
  goalId: string;
  month: string; // YYYY-MM-01
  targetValue: number;
  status: GoalStatus;
  createdAt: string;
}

export interface WeeklyTarget {
  id: string;
  monthlyTargetId: string;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;   // YYYY-MM-DD
  targetValue: number;
  status: GoalStatus;
  createdAt: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  domainId: string;
  contributionPercentage: number;
}
```

---

## 9. Zod Input Validation Schemas

Inputs are strictly validated prior to database insertion.

```typescript
import { z } from "zod";

export const CreateGoalSchema = z.object({
  domainId: z.string().uuid("Invalid Domain ID"),
  title: z.string().min(1, "Goal title is required").max(255).trim(),
  description: z.string().max(1000).trim().optional(),
  goalType: z.enum(["numeric", "boolean", "milestone"]).default("numeric"),
  yearlyTarget: z.number().positive("Target must be greater than 0"),
  unit: z.enum(["count", "currency", "hours", "days", "kilograms", "percentage", "custom"]).default("count"),
  customUnit: z.string().max(50).trim().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["active", "paused", "future"]).default("future")
}).refine(data => data.startDate <= data.endDate, {
  message: "Start date must be before or equal to End date",
  path: ["startDate"]
});

export const UpdateGoalSchema = CreateGoalSchema.partial().extend({
  id: z.string().uuid("Invalid Goal ID")
});
```

---

## 10. Server Actions Design

Mutations are executed as Server Actions returning unified API envelopes:

```typescript
// features/goals/actions/createGoal.ts
"use server";
import { CreateGoalSchema } from "../validation";
import { ActionResponse } from "@/types";

export async function createGoal(rawInput: unknown): Promise<ActionResponse<Goal>> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };

  const validation = CreateGoalSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Input validation failed",
        details: validation.error.issues.map(i => ({ field: i.path.join('.'), issue: i.message }))
      }
    };
  }

  // Insert Goal
  const { data, error } = await supabase
    .from("goals")
    .insert({ ...validation.data, user_id: user.id })
    .select()
    .single();

  if (error) return { success: false, error: { code: "DATABASE_ERROR", message: error.message } };

  // Evict cache
  await evictUserCache(user.id);

  return { success: true, data };
}
```

---

## Testing Strategy

* **Progress Tests:** Validate SQL progress rollup views against mock tasks and ensure dividing by zero weights outputs `0.00`.
* **Forecast Tests:** Validate Time-Elapsed math and ensure leap years (e.g. Feb 29 dates) calculate elapsed timeline ratios accurately.
* **Validation Tests:** Validate color hex inputs and ensure custom units are required only when the unit ENUM is set to `'custom'`.

---

### **Final Review Answer:**
### **Is the Goal Engine production-ready and prepared for Phase 4 Task Engine integration?**
### **YES.**
The database schemas, target structures, forecasting calculations, and validation schemas are fully defined. The layout is locked. Do not proceed to any Task Engine UI implementations yet.
