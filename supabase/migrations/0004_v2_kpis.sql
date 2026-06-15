-- ============================================================
-- ProdOS V2 — Migration: 0004_v2_kpis.sql
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE v2_kpi_metric_type AS ENUM ('input', 'output', 'outcome');

-- ── KPI Definitions Table ─────────────────────────────────────
CREATE TABLE v2_kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES v2_domains (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    metric_type v2_kpi_metric_type NOT NULL DEFAULT 'input',
    unit VARCHAR(50) NOT NULL,
    target_value NUMERIC(12, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (user_id, domain_id, name)
);

-- ── KPI Logs Table ───────────────────────────────────────────
CREATE TABLE v2_kpi_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_definition_id UUID NOT NULL REFERENCES v2_kpi_definitions (id) ON DELETE CASCADE,
    value NUMERIC(12, 2) NOT NULL,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (kpi_definition_id, log_date)
);

-- ============================================================
-- Triggers (Auto update updated_at)
-- ============================================================
CREATE TRIGGER set_timestamp_v2_kpi_definitions BEFORE UPDATE ON v2_kpi_definitions FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- ============================================================
-- Indexes Strategy
-- ============================================================
CREATE INDEX idx_v2_kpi_definitions_user ON v2_kpi_definitions (user_id);
CREATE INDEX idx_v2_kpi_logs_date ON v2_kpi_logs (kpi_definition_id, log_date DESC);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE v2_kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2_kpi_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "v2_kpi_definitions: owner access" ON v2_kpi_definitions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "v2_kpi_logs: owner access" ON v2_kpi_logs FOR ALL USING (
    EXISTS (
        SELECT 1 FROM v2_kpi_definitions d
        WHERE d.id = v2_kpi_logs.kpi_definition_id AND d.user_id = auth.uid()
    )
);
