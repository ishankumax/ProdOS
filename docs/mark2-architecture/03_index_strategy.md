# 03. Database Index Strategy

To support dynamic progress views, multi-tenant queries, and historical time-series analytics (for the KPI system), we implement an explicit database indexing strategy in Supabase PostgreSQL.

---

## Index Definitions & SQL Commands

```sql
-- ── 1. Domains Table Indexes ─────────────────────────────────
-- Fast filtering by user to populate dashboard sidebars.
CREATE INDEX idx_domains_user_id 
    ON domains (user_id);

-- ── 2. Goals Table Indexes ────────────────────────────────────
-- Compound index to resolve hierarchical parent-child joins (e.g. Yearly -> Monthly -> Weekly) quickly.
CREATE INDEX idx_goals_user_parent_id 
    ON goals (user_id, parent_id) 
    WHERE parent_id IS NOT NULL;

-- Fast index for goal date-range filtering (dashboard views).
CREATE INDEX idx_goals_user_date_range 
    ON goals (user_id, start_date, end_date);

-- ── 3. Tasks Table Indexes ────────────────────────────────────
-- Crucial for weekly goal progress rollups (SUM/COUNT operations in views).
CREATE INDEX idx_tasks_goal_id 
    ON tasks (goal_id) 
    WHERE goal_id IS NOT NULL;

-- Speed up domain filtering in the task manager.
CREATE INDEX idx_tasks_user_domain_id 
    ON tasks (user_id, domain_id) 
    WHERE domain_id IS NOT NULL;

-- Partial Index: optimizes rendering of "Today's Task List" by targeting incomplete daily tasks.
CREATE INDEX idx_tasks_today_incomplete 
    ON tasks (user_id, due_date) 
    WHERE completed = false;

-- ── 4. KPI Definitions Indexes ────────────────────────────────
-- Fast lookup of metric templates by domain.
CREATE INDEX idx_kpi_definitions_domain_id 
    ON kpi_definitions (domain_id);

-- ── 5. KPI Logs Indexes ───────────────────────────────────────
-- Compound Index: Optimized for time-series charts, trends, and range aggregations (ordered descending).
CREATE INDEX idx_kpi_logs_definition_date 
    ON kpi_logs (kpi_definition_id, log_date DESC);
```

---

## Architectural Rationale

### 1. Multi-Tenant Separation
Every user query is filtered by `user_id = auth.uid()`. By leading compound indexes with `user_id`, PostgreSQL can perform high-performance index scans, discarding records from other tenants instantly.

### 2. Recursive Rollup Optimization
The `goals_progress_rollup` view relies on parent-child goal joins (`parent_id`). The index `idx_goals_user_parent_id` ensures that looking up all monthly children of a yearly goal (and all weekly children of a monthly goal) executes in sub-millisecond time.

### 3. Partial Indexing for Performance
The index `idx_tasks_today_incomplete` uses a `WHERE completed = false` clause. This partial index keeps the index size extremely small and fits entirely in RAM, as completed tasks are ignored. This ensures the main task list queries remain fast even after years of log accumulation.

### 4. Time-Series Sorting
Analytics graphs and "growth trend" metrics pull data sorted by date. The compound index `idx_kpi_logs_definition_date` uses `date DESC` to allow index-ordered scans, preventing expensive database sorting operations at runtime.
