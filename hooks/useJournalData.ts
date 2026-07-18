"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toKey } from "@/utils/date";
import { useAuth } from "@/contexts/AuthContext";
import {
  dbUpsert,
  dbSelectByUserAndCol,
  dbSelectByUserWhereIn,
} from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DailyTask {
  id: string;
  taskName: string;
  completed: boolean;
  order: number;
}

export interface DailyEntry {
  id: string;
  date: string; // YYYY-MM-DD
  journalContent: string;
  completionPercentage: number;
  tasks: DailyTask[];
  createdAt: number;
  updatedAt: number;
}

export interface WeekDayData {
  date: string; // YYYY-MM-DD
  label: string; // "Mon", "Tue", etc.
  dayNum: number; // 1–31
  completed: number;
  total: number;
  percentage: number;
  isToday: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const TASK_COUNT = 12;
const DEBOUNCE_MS = 500;
const LS_PREFIX = "prod_os_daily_";

// ── Helpers ────────────────────────────────────────────────────────────────────

function todayKey(): string {
  const now = new Date();
  return toKey(now.getFullYear(), now.getMonth(), now.getDate());
}

function dateFromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y!, m! - 1, d);
}

function getWeekKeys(): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    keys.push(toKey(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  return keys;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function createBlankEntry(dateKey: string): DailyEntry {
  const now = Date.now();
  const tasks: DailyTask[] = Array.from({ length: TASK_COUNT }, (_, i) => ({
    id: generateId(),
    taskName: `Task ${i + 1}`,
    completed: false,
    order: i,
  }));
  return {
    id: generateId(),
    date: dateKey,
    journalContent: "",
    completionPercentage: 0,
    tasks,
    createdAt: now,
    updatedAt: now,
  };
}

function computeCompletion(tasks: DailyTask[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.completed).length;
  return Math.round((done / tasks.length) * 100);
}

function lsKey(dateKey: string): string {
  return `${LS_PREFIX}${dateKey}`;
}

function loadFromLS(dateKey: string): DailyEntry | null {
  try {
    const raw = localStorage.getItem(lsKey(dateKey));
    if (raw) return JSON.parse(raw) as DailyEntry;
  } catch (e) {
    console.error("[Journal] Failed to parse localStorage", e);
  }
  return null;
}

function saveToLS(entry: DailyEntry): void {
  try {
    localStorage.setItem(lsKey(entry.date), JSON.stringify(entry));
  } catch (e) {
    console.error("[Journal] Failed to save localStorage", e);
  }
}

// ── Supabase sync helpers ──────────────────────────────────────────────────────

async function syncEntryToSupabase(entry: DailyEntry, userId: string) {
  try {
    await dbUpsert("daily_entries", {
      id: entry.id,
      user_id: userId,
      date: entry.date,
      journal_content: entry.journalContent,
      completion_percentage: entry.completionPercentage,
      created_at: new Date(entry.createdAt).toISOString(),
      updated_at: new Date(entry.updatedAt).toISOString(),
    });

    // Upsert all tasks
    for (const task of entry.tasks) {
      await dbUpsert("daily_tasks", {
        id: task.id,
        daily_entry_id: entry.id,
        user_id: userId,
        date: entry.date,
        task_name: task.taskName,
        completed: task.completed,
        order: task.order,
      });
    }
  } catch (e) {
    console.error("[Journal] Supabase sync failed", e);
  }
}

interface SupabaseEntry {
  id: string;
  date: string;
  journal_content: string;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

interface SupabaseTask {
  id: string;
  daily_entry_id: string;
  date: string;
  task_name: string;
  completed: boolean;
  order: number;
}

async function loadFromSupabase(
  dateKey: string,
  userId: string
): Promise<DailyEntry | null> {
  try {
    const entries = await dbSelectByUserAndCol<SupabaseEntry>(
      "daily_entries",
      userId,
      "date",
      dateKey
    );
    if (entries.length === 0) return null;

    const entry = entries[0]!;
    const tasks = await dbSelectByUserAndCol<SupabaseTask>(
      "daily_tasks",
      userId,
      "date",
      dateKey
    );

    return {
      id: entry.id,
      date: entry.date,
      journalContent: entry.journal_content || "",
      completionPercentage: entry.completion_percentage || 0,
      tasks: tasks
        .sort((a, b) => a.order - b.order)
        .map((t) => ({
          id: t.id,
          taskName: t.task_name,
          completed: t.completed,
          order: t.order,
        })),
      createdAt: new Date(entry.created_at).getTime(),
      updatedAt: new Date(entry.updated_at).getTime(),
    };
  } catch (e) {
    console.error("[Journal] Supabase load failed", e);
    return null;
  }
}

async function loadWeekFromSupabase(
  weekKeys: string[],
  userId: string
): Promise<Map<string, DailyEntry>> {
  const map = new Map<string, DailyEntry>();
  try {
    const entries = await dbSelectByUserWhereIn<SupabaseEntry>(
      "daily_entries",
      userId,
      "date",
      weekKeys
    );
    const tasks = await dbSelectByUserWhereIn<SupabaseTask>(
      "daily_tasks",
      userId,
      "date",
      weekKeys
    );

    for (const entry of entries) {
      const entryTasks = tasks
        .filter((t) => t.daily_entry_id === entry.id)
        .sort((a, b) => a.order - b.order)
        .map((t) => ({
          id: t.id,
          taskName: t.task_name,
          completed: t.completed,
          order: t.order,
        }));

      map.set(entry.date, {
        id: entry.id,
        date: entry.date,
        journalContent: entry.journal_content || "",
        completionPercentage: entry.completion_percentage || 0,
        tasks: entryTasks,
        createdAt: new Date(entry.created_at).getTime(),
        updatedAt: new Date(entry.updated_at).getTime(),
      });
    }
  } catch (e) {
    console.error("[Journal] Supabase week load failed", e);
  }
  return map;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useJournalData(externalDate?: string | null) {
  const { user } = useAuth();
  const userId = user?.email ?? null;

  const [selectedDate, setSelectedDate] = useState<string>(todayKey());
  const [entry, setEntry] = useState<DailyEntry>(() => createBlankEntry(todayKey()));
  const [weeklyData, setWeeklyData] = useState<WeekDayData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Handle external date changes (from calendar) ──────────────────────────
  useEffect(() => {
    if (externalDate && externalDate !== selectedDate) {
      setSelectedDate(externalDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalDate]);

  // ── Load entry for selectedDate ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // 1. Try localStorage
      let loaded = loadFromLS(selectedDate);

      // 2. If logged in, try Supabase (might be newer)
      if (userId) {
        const remote = await loadFromSupabase(selectedDate, userId);
        if (!cancelled && remote) {
          if (!loaded || remote.updatedAt > loaded.updatedAt) {
            loaded = remote;
            saveToLS(remote); // cache locally
          }
        }
      }

      // 3. If still nothing, create blank (only for today or future)
      if (!loaded) {
        loaded = createBlankEntry(selectedDate);
        saveToLS(loaded);
        if (userId) {
          syncEntryToSupabase(loaded, userId);
        }
      } else {
        let dirty = false;
        if (!loaded.tasks || !Array.isArray(loaded.tasks)) {
          loaded.tasks = createBlankEntry(selectedDate).tasks;
          dirty = true;
        }
        if (typeof loaded.journalContent !== "string") {
          loaded.journalContent = "";
          dirty = true;
        }
        if (typeof loaded.completionPercentage !== "number") {
          loaded.completionPercentage = computeCompletion(loaded.tasks);
          dirty = true;
        }
        if (dirty) {
          saveToLS(loaded);
          if (userId) {
            syncEntryToSupabase(loaded, userId);
          }
        }
      }

      if (!cancelled) {
        setEntry(loaded);
        setIsLoaded(true);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [selectedDate, userId]);

  // ── Load weekly data ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadWeek = async () => {
      const weekKeys = getWeekKeys();
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = todayKey();

      // Load from localStorage first
      const localEntries = new Map<string, DailyEntry>();
      for (const key of weekKeys) {
        const cached = loadFromLS(key);
        if (cached) localEntries.set(key, cached);
      }

      // If logged in, merge from Supabase
      if (userId) {
        const remoteEntries = await loadWeekFromSupabase(weekKeys, userId);
        remoteEntries.forEach((remote, key) => {
          const local = localEntries.get(key);
          if (!local || remote.updatedAt > local.updatedAt) {
            localEntries.set(key, remote);
            saveToLS(remote);
          }
        });
      }

      if (cancelled) return;

      const week: WeekDayData[] = weekKeys.map((key) => {
        const d = dateFromKey(key);
        const entry = localEntries.get(key);
        const total = (entry && entry.tasks) ? entry.tasks.length : TASK_COUNT;
        const completed = (entry && entry.tasks)
          ? entry.tasks.filter((t) => t.completed).length
          : 0;
        return {
          date: key,
          label: dayNames[d.getDay()]!,
          dayNum: d.getDate(),
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
          isToday: key === today,
        };
      });

      setWeeklyData(week);
    };

    loadWeek();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, userId, entry.updatedAt]);

  // ── Persistence helper ────────────────────────────────────────────────────
  const persistEntry = useCallback(
    (updated: DailyEntry) => {
      const withTimestamp = {
        ...updated,
        completionPercentage: computeCompletion(updated.tasks),
        updatedAt: Date.now(),
      };
      setEntry(withTimestamp);
      saveToLS(withTimestamp);

      // Debounced Supabase sync
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (userId) {
          syncEntryToSupabase(withTimestamp, userId);
        }
      }, DEBOUNCE_MS);
    },
    [userId]
  );

  // ── Actions ───────────────────────────────────────────────────────────────

  const toggleTask = useCallback(
    (taskId: string) => {
      const updated = {
        ...entry,
        tasks: (entry.tasks || []).map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      };
      persistEntry(updated);
    },
    [entry, persistEntry]
  );

  const renameTask = useCallback(
    (taskId: string, newName: string) => {
      const updated = {
        ...entry,
        tasks: (entry.tasks || []).map((t) =>
          t.id === taskId ? { ...t, taskName: newName } : t
        ),
      };
      persistEntry(updated);
    },
    [entry, persistEntry]
  );

  const reorderTasks = useCallback(
    (reorderedTasks: DailyTask[]) => {
      const updated = {
        ...entry,
        tasks: reorderedTasks.map((t, i) => ({ ...t, order: i })),
      };
      persistEntry(updated);
    },
    [entry, persistEntry]
  );

  const updateJournalContent = useCallback(
    (content: string) => {
      const updated = { ...entry, journalContent: content };
      persistEntry(updated);
    },
    [entry, persistEntry]
  );

  const navigateToDate = useCallback((dateKey: string) => {
    setSelectedDate(dateKey);
  }, []);

  return {
    selectedDate,
    entry,
    weeklyData,
    isLoaded,
    isToday: selectedDate === todayKey(),
    // Actions
    toggleTask,
    renameTask,
    reorderTasks,
    updateJournalContent,
    navigateToDate,
    setSelectedDate: navigateToDate,
  };
}
