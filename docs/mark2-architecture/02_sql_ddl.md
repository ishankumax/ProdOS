# 02. SQL DDL Schema Design

This document outlines the PostgreSQL schemas for the ProdOS Mark 2 database, designed for Supabase. It implements enums, foreign keys, row-level security (RLS) policies, and dynamic computed views for progress rollups.

---

## 1. Custom Types & Enums

```sql
-- Enums for Goal Hierarchies
CREATE TYPE goal_level AS ENUM ('yearly', 'monthly', 'weekly');

-- Enums for Metric Classifications (Input, Output, Outcome)
CREATE TYPE kpi_metric_type AS ENUM ('input', 'output', 'outcome');
```

---

## 2. Table Definitions

### Domains Table
```sql
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#10B981', -- default brand tech green
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure domain names are unique per user
    UNIQUE (user_id, name)
);
```

### Goals Table
```sql
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    parent_id UUID REFERENCES goals (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    goal_level goal_level NOT NULL,
    target_value NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
    unit VARCHAR(50) NOT NULL DEFAULT '%', -- e.g., 'Contributions', 'Books', 'Hours'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints to prevent invalid hierarchy loops
    CONSTRAINT check_start_before_end CHECK (start_date <= end_date)
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains (id) ON DELETE SET NULL, -- Global tasks have domain_id = NULL
    goal_id UUID REFERENCES goals (id) ON DELETE SET NULL, -- Tasks can optionally link to a Goal
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    due_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight NUMERIC(5, 2) NOT NULL DEFAULT 1.00, -- Enables weighted task completion (default 1.0)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### KPI Definitions Table
```sql
CREATE TABLE kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    metric_type kpi_metric_type NOT NULL, -- input, output, outcome
    unit VARCHAR(50) NOT NULL,            -- e.g., 'USD', 'hours', 'count'
    target_value NUMERIC(12, 2),          -- Optional target value per time unit
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (user_id, domain_id, name)
);
```

### KPI Logs Table
```sql
CREATE TABLE kpi_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_definition_id UUID NOT NULL REFERENCES kpi_definitions (id) ON DELETE CASCADE,
    value NUMERIC(12, 2) NOT NULL,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Prevent duplicate log entries for the same metric on the same day
    UNIQUE (kpi_definition_id, log_date)
);
```

---

## 3. Auto-updating Trigger (`updated_at`)

```sql
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_domains BEFORE UPDATE ON domains FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_goals BEFORE UPDATE ON goals FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_tasks BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_kpi_definitions BEFORE UPDATE ON kpi_definitions FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
```

---

## 4. Computed Progress Rollups (SQL Views)

We calculate progress percentages on-the-fly dynamically using views to prevent stale, duplicated state.

```sql
-- 1. Weekly Goals Progress View (based directly on completed Tasks weight)
CREATE OR REPLACE VIEW view_weekly_goals_progress AS
SELECT 
    g.id AS goal_id,
    COALESCE(
        SUM(CASE WHEN t.completed = true THEN t.weight ELSE 0 END) / 
        NULLIF(SUM(t.weight), 0) * 100, 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM goals g
LEFT JOIN tasks t ON t.goal_id = g.id
WHERE g.goal_level = 'weekly'
GROUP BY g.id;

-- 2. Monthly Goals Progress View (average of child Weekly Goals progress)
CREATE OR REPLACE VIEW view_monthly_goals_progress AS
SELECT 
    g.id AS goal_id,
    COALESCE(
        AVG(wgp.progress), 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM goals g
LEFT JOIN goals child ON child.parent_id = g.id AND child.goal_level = 'weekly'
LEFT JOIN view_weekly_goals_progress wgp ON wgp.goal_id = child.id
WHERE g.goal_level = 'monthly'
GROUP BY g.id;

-- 3. Yearly Goals Progress View (average of child Monthly Goals progress)
CREATE OR REPLACE VIEW view_yearly_goals_progress AS
SELECT 
    g.id AS goal_id,
    COALESCE(
        AVG(mgp.progress), 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM goals g
LEFT JOIN goals child ON child.parent_id = g.id AND child.goal_level = 'monthly'
LEFT JOIN view_monthly_goals_progress mgp ON mgp.goal_id = child.id
WHERE g.goal_level = 'yearly'
GROUP BY g.id;

-- 4. Unified Goals Progress View
CREATE OR REPLACE VIEW goals_progress_rollup AS
SELECT goal_id, progress FROM view_weekly_goals_progress
UNION ALL
SELECT goal_id, progress FROM view_monthly_goals_progress
UNION ALL
SELECT goal_id, progress FROM view_yearly_goals_progress;
```

---

## 5. Row Level Security (RLS) Policies

All tables restrict queries to the logged-in user (`auth.uid()`).

```sql
-- Enable RLS
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_logs ENABLE ROW LEVEL SECURITY;

-- Domains Policies
CREATE POLICY "domains_owner_access" ON domains 
    FOR ALL USING (auth.uid() = user_id);

-- Goals Policies
CREATE POLICY "goals_owner_access" ON goals 
    FOR ALL USING (auth.uid() = user_id);

-- Tasks Policies
CREATE POLICY "tasks_owner_access" ON tasks 
    FOR ALL USING (auth.uid() = user_id);

-- KPI Definitions Policies
CREATE POLICY "kpi_definitions_owner_access" ON kpi_definitions 
    FOR ALL USING (auth.uid() = user_id);

-- KPI Logs Policies (checks ownership of definition)
CREATE POLICY "kpi_logs_owner_access" ON kpi_logs 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM kpi_definitions d
            WHERE d.id = kpi_logs.kpi_definition_id 
              AND d.user_id = auth.uid()
        )
    );
```
