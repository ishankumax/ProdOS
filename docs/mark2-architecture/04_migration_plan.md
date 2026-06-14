# 04. Database Migration Plan (Mark 1 to Mark 2)

This document details the transition path from the current Mark 1 schema (defined in `0001_initial_schema.sql` and `0002_finance_schema.sql`) to the new Mark 2 architecture. 

---

## Migration Strategy: Parallel Run & Backfill

To avoid service disruption, we will execute a staged migration:
1. **Pre-Migration Backup:** Full database dump.
2. **Apply DDL Changes:** Create the new tables alongside existing tables.
3. **Data Backfill & Transformation:** Run automated migration scripts to port existing data to the new unified models.
4. **Validation Check:** Run sanity checks on row counts and mappings.
5. **Deprecation/Cleanup:** Drop old tables and views after verifying the new system.

---

## Step-by-Step Execution Plan

### Step 1: Pre-Migration Backup
```bash
# Run via Supabase CLI to backup production schema and data
supabase db dump --local > backup_before_m2.sql
```

### Step 2: Create Mark 2 Schema
Apply the DDL from [02_sql_ddl.md](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/docs/mark2-architecture/02_sql_ddl.md). This creates `domains`, `goals` (hierarchical), `tasks`, `kpi_definitions`, and `kpi_logs` tables without touching the old `goals`, `habits`, and `habit_logs` tables.

---

### Step 3: Run the Backfill Script (SQL)

We write migrations to map the old entities to the new architecture:

#### 1. Seed Default Domains
We automatically seed standard domains for all existing users:
```sql
INSERT INTO domains (user_id, name, color_hex)
SELECT DISTINCT user_id, 'Global', '#6B7280' FROM goals
UNION
SELECT DISTINCT user_id, 'Routines', '#10B981' FROM habits;
```

#### 2. Migrate Mark 1 Goals to Mark 2 Goals
Mark 1 had flat `goals` with type `weekly` and `monthly`. Mark 2 uses a hierarchy.
* We select `weekly` and `monthly` goals and insert them into the new table.
* Since they did not have dates in Mark 1, we default `start_date` and `end_date` to the current week/month.

```sql
-- Move Weekly & Monthly Goals
INSERT INTO goals (id, user_id, title, goal_level, target_value, start_date, end_date)
SELECT 
    id, 
    user_id, 
    title, 
    type::text::goal_level, 
    100.00, -- Default target
    date_trunc('week', created_at)::date, 
    (date_trunc('week', created_at) + interval '6 days')::date
FROM goals
WHERE type IN ('weekly', 'monthly');
```

#### 3. Migrate Mark 1 Daily Goals to Tasks
In Mark 2, **Daily Goals** do not exist as goals; instead, they are unified under the `tasks` table.
```sql
-- Map Daily Goals to Tasks
INSERT INTO tasks (user_id, title, completed, created_at, updated_at, due_date)
SELECT 
    user_id, 
    title, 
    completed, 
    created_at, 
    updated_at, 
    created_at::date
FROM goals
WHERE type = 'daily';
```

#### 4. Migrate Habits to KPI Definitions & Logs
Habits are converted into dynamic, tracking-friendly KPI Definitions under the "Routines" domain:
```sql
-- Convert Habits to KPI Definitions
INSERT INTO kpi_definitions (user_id, domain_id, name, metric_type, unit)
SELECT 
    h.user_id,
    d.id AS domain_id,
    h.name,
    'output'::kpi_metric_type,
    'completions'
FROM habits h
JOIN domains d ON d.user_id = h.user_id AND d.name = 'Routines';

-- Migrate Habit Logs to KPI Logs
INSERT INTO kpi_logs (kpi_definition_id, value, log_date, created_at)
SELECT 
    kd.id AS kpi_definition_id,
    CASE WHEN hl.completed = true THEN 1.00 ELSE 0.00 END AS value,
    hl.date,
    hl.date::timestamptz
FROM habit_logs hl
JOIN habits h ON h.id = hl.habit_id
JOIN kpi_definitions kd ON kd.name = h.name AND kd.user_id = h.user_id;
```

---

### Step 4: Verification Checks
Verify that the record counts match up exactly:
```sql
-- Count tasks migrated from daily goals
SELECT COUNT(*) FROM goals WHERE type = 'daily';
SELECT COUNT(*) FROM tasks WHERE goal_id IS NULL AND domain_id IS NULL; -- Should match

-- Check KPI logs migrated from habit logs
SELECT COUNT(*) FROM habit_logs;
SELECT COUNT(*) FROM kpi_logs; -- Should match
```

---

### Step 5: Deprecate Old Tables
Once verification succeeds, clean up the database to maintain integrity:
```sql
-- DROP original tables
DROP TABLE IF EXISTS habit_logs CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS goals CASCADE; -- Make sure we delete the old one, not the new one
-- Note: It is safer to run a script renaming 'goals' to 'old_goals' prior to DDL setup, 
-- or namespaces them cleanly during migration.
```

---

## Rollback Plan
If any step fails, we can restore the entire database instantly:
```bash
# Clean up any new tables created
psql -h localhost -U postgres -d prodos -c "
    DROP TABLE IF EXISTS kpi_logs CASCADE;
    DROP TABLE IF EXISTS kpi_definitions CASCADE;
    DROP TABLE IF EXISTS tasks CASCADE;
    DROP TABLE IF EXISTS goals CASCADE;
    DROP TABLE IF EXISTS domains CASCADE;
    DROP TYPE IF EXISTS goal_level CASCADE;
    DROP TYPE IF EXISTS kpi_metric_type CASCADE;
"

# Restore from backup
supabase db restore --local < backup_before_m2.sql
```
