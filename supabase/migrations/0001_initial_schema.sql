    -- ============================================================
-- Productivity OS — Initial Schema
-- Migration: 0001_initial_schema.sql
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────

create type goal_type as enum ('daily', 'weekly', 'monthly');
create type reminder_type as enum ('email', 'browser');

-- ── Profiles (extends auth.users) ───────────────────────────
-- Only needed if you store extra fields beyond what auth.users provides.
-- Remove this table if Supabase auth metadata is sufficient.

create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url   text,
  created_at timestamptz not null default now()
);

-- ── Goals ────────────────────────────────────────────────────

create table goals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text not null,
  type       goal_type not null,
  completed  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger goals_updated_at
  before update on goals
  for each row execute procedure set_updated_at();

-- ── Habits ───────────────────────────────────────────────────

create table habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

-- ── Habit Logs ───────────────────────────────────────────────

create table habit_logs (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references habits (id) on delete cascade,
  date       date not null,                        -- stored as UTC date
  completed  boolean not null default false,
  -- one log entry per habit per day
  unique (habit_id, date)
);

-- ── Reminders ────────────────────────────────────────────────

create table reminders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  title        text not null,
  scheduled_at timestamptz not null,
  type         reminder_type not null,
  sent         boolean not null default false
);

-- ============================================================
-- Indexes
-- ============================================================

-- Goals: fast lookup per user
create index idx_goals_user_id
  on goals (user_id);

-- Habit logs: fast streak / date-range queries
create index idx_habit_logs_habit_date
  on habit_logs (habit_id, date desc);

-- Habits: fast lookup per user
create index idx_habits_user_id
  on habits (user_id);

-- Reminders: fast lookup of pending reminders per user ordered by time
create index idx_reminders_user_scheduled
  on reminders (user_id, scheduled_at)
  where sent = false;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
-- Each user can only access their own rows.

alter table profiles    enable row level security;
alter table goals       enable row level security;
alter table habits      enable row level security;
alter table habit_logs  enable row level security;
alter table reminders   enable row level security;

-- profiles
create policy "profiles: owner access"
  on profiles for all
  using (auth.uid() = id);

-- goals
create policy "goals: owner access"
  on goals for all
  using (auth.uid() = user_id);

-- habits
create policy "habits: owner access"
  on habits for all
  using (auth.uid() = user_id);

-- habit_logs — derive ownership via habits table
create policy "habit_logs: owner access"
  on habit_logs for all
  using (
    exists (
      select 1 from habits
      where habits.id = habit_logs.habit_id
        and habits.user_id = auth.uid()
    )
  );

-- reminders
create policy "reminders: owner access"
  on reminders for all
  using (auth.uid() = user_id);
