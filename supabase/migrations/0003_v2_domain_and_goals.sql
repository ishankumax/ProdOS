-- ============================================================
-- ProdOS V2 — Migration: 0003_v2_domain_and_goals.sql
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE v2_domain_status AS ENUM ('active', 'paused', 'archived');
CREATE TYPE v2_domain_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE v2_goal_type AS ENUM ('numeric', 'boolean', 'milestone');
CREATE TYPE v2_goal_unit AS ENUM ('count', 'currency', 'hours', 'days', 'kilograms', 'percentage', 'custom');
CREATE TYPE v2_goal_status AS ENUM ('active', 'completed', 'paused', 'archived', 'future');

-- ── Domains Table ────────────────────────────────────────────
CREATE TABLE v2_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_key VARCHAR(100) NOT NULL DEFAULT 'circle',
    color_hex VARCHAR(7) NOT NULL DEFAULT '#10B981',
    status v2_domain_status NOT NULL DEFAULT 'active',
    priority v2_domain_priority NOT NULL DEFAULT 'medium',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_at TIMESTAMPTZ,

    CONSTRAINT check_domains_archived CHECK (
        (status = 'archived' AND archived_at IS NOT NULL) OR
        (status != 'archived' AND archived_at IS NULL)
    ),
    UNIQUE (user_id, name)
);

-- ── Goals Table ──────────────────────────────────────────────
CREATE TABLE v2_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES v2_domains (id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type v2_goal_type NOT NULL DEFAULT 'numeric',
    yearly_target NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
    unit v2_goal_unit NOT NULL DEFAULT 'count',
    custom_unit VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status v2_goal_status NOT NULL DEFAULT 'future',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_at TIMESTAMPTZ,

    CONSTRAINT check_v2_goal_dates CHECK (start_date <= end_date),
    CONSTRAINT check_v2_custom_unit CHECK (
        (unit = 'custom' AND custom_unit IS NOT NULL) OR
        (unit != 'custom' AND custom_unit IS NULL)
    ),
    CONSTRAINT check_v2_archived_status CHECK (
        (status = 'archived' AND archived_at IS NOT NULL) OR
        (status != 'archived' AND archived_at IS NULL)
    )
);

-- ── Goal Contributions Table ─────────────────────────────────
CREATE TABLE v2_goal_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES v2_goals (id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES v2_domains (id) ON DELETE CASCADE,
    contribution_percentage NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT check_contribution_percent CHECK (contribution_percentage > 0 AND contribution_percentage <= 100.00),
    UNIQUE (goal_id, domain_id)
);

-- ── Monthly Targets Table ────────────────────────────────────
CREATE TABLE v2_monthly_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES v2_goals (id) ON DELETE CASCADE,
    month DATE NOT NULL, -- Format: YYYY-MM-01
    target_value NUMERIC(12, 2) NOT NULL,
    status v2_goal_status NOT NULL DEFAULT 'future',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (goal_id, month)
);

-- ── Weekly Targets Table ─────────────────────────────────────
CREATE TABLE v2_weekly_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monthly_target_id UUID NOT NULL REFERENCES v2_monthly_targets (id) ON DELETE CASCADE,
    week_start DATE NOT NULL, -- Monday of the week
    week_end DATE NOT NULL,   -- Sunday of the week
    target_value NUMERIC(12, 2) NOT NULL,
    status v2_goal_status NOT NULL DEFAULT 'future',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT check_v2_week_bounds CHECK (week_start < week_end),
    UNIQUE (monthly_target_id, week_start)
);

-- ── Tasks Table Connectors (V2) ──────────────────────────────
-- Extends/creates the V2 task table with goal link support
CREATE TABLE v2_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    domain_id UUID REFERENCES v2_domains (id) ON DELETE SET NULL,
    weekly_target_id UUID REFERENCES v2_weekly_targets (id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    due_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Triggers (Auto update updated_at)
-- ============================================================
CREATE TRIGGER set_timestamp_v2_domains BEFORE UPDATE ON v2_domains FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_timestamp_v2_goals BEFORE UPDATE ON v2_goals FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_timestamp_v2_tasks BEFORE UPDATE ON v2_tasks FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- ============================================================
-- Indexes Strategy
-- ============================================================
-- Active Domains per user
CREATE INDEX idx_v2_domains_user_active ON v2_domains (user_id) WHERE status != 'archived';

-- Hierarchical Goals lookup
CREATE INDEX idx_v2_goals_domain ON v2_goals (domain_id);
CREATE INDEX idx_v2_goals_user_active ON v2_goals (user_id) WHERE status != 'archived';

-- Targets index
CREATE INDEX idx_v2_monthly_targets_goal ON v2_monthly_targets (goal_id);
CREATE INDEX idx_v2_weekly_targets_monthly ON v2_weekly_targets (monthly_target_id);

-- Tasks targets link
CREATE INDEX idx_v2_tasks_weekly_target ON v2_tasks (weekly_target_id) WHERE weekly_target_id IS NOT NULL;
CREATE INDEX idx_v2_tasks_user_active ON v2_tasks (user_id, due_date) WHERE completed = false;

-- ============================================================
-- Computed Views (Progress Rollup)
-- ============================================================

-- 1. Weekly targets dynamic progress
CREATE OR REPLACE VIEW view_v2_weekly_targets_progress AS
SELECT 
    wt.id AS weekly_target_id,
    COALESCE(
        SUM(CASE WHEN t.completed = true THEN t.weight ELSE 0 END) / 
        NULLIF(SUM(t.weight), 0) * 100, 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM v2_weekly_targets wt
LEFT JOIN v2_tasks t ON t.weekly_target_id = wt.id
GROUP BY wt.id;

-- 2. Monthly targets dynamic progress
CREATE OR REPLACE VIEW view_v2_monthly_targets_progress AS
SELECT 
    mt.id AS monthly_target_id,
    COALESCE(
        AVG(wp.progress), 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM v2_monthly_targets mt
LEFT JOIN v2_weekly_targets wt ON wt.monthly_target_id = mt.id
LEFT JOIN view_v2_weekly_targets_progress wp ON wp.weekly_target_id = wt.id
GROUP BY mt.id;

-- 3. Yearly goals dynamic progress
CREATE OR REPLACE VIEW view_v2_goals_progress AS
SELECT 
    g.id AS goal_id,
    COALESCE(
        AVG(mp.progress), 
        0.00
    )::NUMERIC(5, 2) AS progress
FROM v2_goals g
LEFT JOIN v2_monthly_targets mt ON mt.goal_id = g.id
LEFT JOIN view_v2_monthly_targets_progress mp ON mp.monthly_target_id = mt.id
GROUP BY g.id;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE v2_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_goal_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_monthly_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_weekly_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "v2_domains: owner access" ON v2_domains FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "v2_goals: owner access" ON v2_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "v2_tasks: owner access" ON v2_tasks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "v2_goal_contributions: owner access" ON v2_goal_contributions FOR ALL USING (
    EXISTS (SELECT 1 FROM v2_goals g WHERE g.id = v2_goal_contributions.goal_id AND g.user_id = auth.uid())
);
CREATE POLICY "v2_monthly_targets: owner access" ON v2_monthly_targets FOR ALL USING (
    EXISTS (SELECT 1 FROM v2_goals g WHERE g.id = v2_monthly_targets.goal_id AND g.user_id = auth.uid())
);
CREATE POLICY "v2_weekly_targets: owner access" ON v2_weekly_targets FOR ALL USING (
    EXISTS (
        SELECT 1 FROM v2_monthly_targets mt
        JOIN v2_goals g ON g.id = mt.goal_id
        WHERE mt.id = v2_weekly_targets.monthly_target_id AND g.user_id = auth.uid()
    )
);
