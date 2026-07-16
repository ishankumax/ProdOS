"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toKey } from "@/utils/date";
import { useAuth } from "@/contexts/AuthContext";
import { dbUpsert, dbDelete, dbSelectByUser } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dateKey?: string;
  priority?: "low" | "medium" | "high";
}

export interface DeletedTask extends Task {
  deletedAt: number;
  expiresAt: number; // deletedAt + 7 days
}

export interface Investment {
  id: string;
  company: string;
  amount: number;
  type: string;
}

export interface Workspace {
  name: string;
  iconClass: string;
}

interface DataContextType {
  tasks: Task[];
  addTask: (text: string, dateKey?: string, priority?: Task["priority"]) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  // Recycle bin
  recycleBin: DeletedTask[];
  restoreTask: (id: string) => void;
  permanentlyDeleteTask: (id: string) => void;
  // Investments
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, "id">) => void;
  // Workspaces
  workspaces: Workspace[];
  addWorkspace: (name: string, iconClass: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_WORKSPACES: Workspace[] = [
  { name: "Dashboard", iconClass: "fi fi-sr-home" },
  { name: "Finance", iconClass: "fi fi-sr-chart-histogram" },
  { name: "Goals", iconClass: "fi fi-sr-target" },
  { name: "Fitness", iconClass: "fi fi-sr-heart" },
  { name: "Skill Learning", iconClass: "fi fi-sr-graduation-cap" },
  { name: "Journal", iconClass: "fi fi-sr-book-alt" },
];

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// ── Provider ───────────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.email ?? null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [recycleBin, setRecycleBin] = useState<DeletedTask[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Load from localStorage on mount (always available) ──────────────────────
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("prod_os_tasks_v2");
      const storedBin = localStorage.getItem("prod_os_recycle_bin_v1");
      const storedInvestments = localStorage.getItem("prod_os_investments_v2");
      const storedWorkspaces = localStorage.getItem("prod_os_workspaces_v2");

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedInvestments) setInvestments(JSON.parse(storedInvestments));

      if (storedBin) {
        const parsed: DeletedTask[] = JSON.parse(storedBin);
        // Purge items older than 7 days
        const now = Date.now();
        setRecycleBin(parsed.filter((t) => t.expiresAt > now));
      }

      if (storedWorkspaces) {
        const parsed = JSON.parse(storedWorkspaces);
        setWorkspaces(parsed.length === 0 ? DEFAULT_WORKSPACES : parsed);
      } else {
        setWorkspaces(DEFAULT_WORKSPACES);
      }
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // ── Sync from Supabase when user logs in ────────────────────────────────────
  useEffect(() => {
    if (!userId || !isLoaded) return;
    (async () => {
      try {
        const [dbTasks, dbBin] = await Promise.all([
          dbSelectByUser<{ id: string; task_data: Task }>("tasks", userId),
          dbSelectByUser<{ id: string; task_data: Task; deleted_at: number; expires_at: number }>(
            "recycle_bin",
            userId
          ),
        ]);

        if (dbTasks.length > 0) {
          const hydratedTasks = dbTasks.map((r) => r.task_data);
          setTasks(hydratedTasks);
          localStorage.setItem("prod_os_tasks_v2", JSON.stringify(hydratedTasks));
        }

        if (dbBin.length > 0) {
          const now = Date.now();
          const hydratedBin: DeletedTask[] = dbBin
            .filter((r) => r.expires_at > now)
            .map((r) => ({ ...r.task_data, deletedAt: r.deleted_at, expiresAt: r.expires_at }));
          setRecycleBin(hydratedBin);
          localStorage.setItem("prod_os_recycle_bin_v1", JSON.stringify(hydratedBin));
        }
      } catch (e) {
        console.error("Failed to sync from Supabase", e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ── Persist to localStorage whenever state changes ───────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("prod_os_tasks_v2", JSON.stringify(tasks));
    localStorage.setItem("prod_os_investments_v2", JSON.stringify(investments));
    localStorage.setItem("prod_os_workspaces_v2", JSON.stringify(workspaces));
  }, [tasks, investments, workspaces, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const now = Date.now();
    const valid = recycleBin.filter((t) => t.expiresAt > now);
    localStorage.setItem("prod_os_recycle_bin_v1", JSON.stringify(valid));
  }, [recycleBin, isLoaded]);

  // ── Task actions ─────────────────────────────────────────────────────────────

  const addTask = useCallback(
    async (text: string, dateKey?: string, priority: Task["priority"] = "medium") => {
      const today = new Date();
      const defaultDateKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        completed: false,
        createdAt: Date.now(),
        dateKey: dateKey || defaultDateKey,
        priority,
      };
      setTasks((prev) => [...prev, newTask]);
      if (userId) {
        await dbUpsert("tasks", {
          id: newTask.id,
          user_id: userId,
          task_data: newTask,
        });
      }
    },
    [userId]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      if (userId) {
        const updated = tasks.find((t) => t.id === id);
        if (updated) {
          await dbUpsert("tasks", {
            id: updated.id,
            user_id: userId,
            task_data: { ...updated, completed: !updated.completed },
          });
        }
      }
    },
    [userId, tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const now = Date.now();
      const deleted: DeletedTask = {
        ...task,
        deletedAt: now,
        expiresAt: now + SEVEN_DAYS,
      };

      setTasks((prev) => prev.filter((t) => t.id !== id));
      setRecycleBin((prev) => [...prev, deleted]);

      if (userId) {
        await dbDelete("tasks", id);
        await dbUpsert("recycle_bin", {
          id: deleted.id,
          user_id: userId,
          task_data: task,
          deleted_at: now,
          expires_at: deleted.expiresAt,
        });
      }
    },
    [userId, tasks]
  );

  const restoreTask = useCallback(
    async (id: string) => {
      const item = recycleBin.find((t) => t.id === id);
      if (!item) return;

      const task: Task = {
        id: item.id,
        text: item.text,
        completed: item.completed,
        createdAt: item.createdAt,
        dateKey: item.dateKey,
        priority: item.priority,
      };
      setRecycleBin((prev) => prev.filter((t) => t.id !== id));
      setTasks((prev) => [...prev, task]);

      if (userId) {
        await dbDelete("recycle_bin", id);
        await dbUpsert("tasks", { id: task.id, user_id: userId, task_data: task });
      }
    },
    [userId, recycleBin]
  );

  const permanentlyDeleteTask = useCallback(
    async (id: string) => {
      setRecycleBin((prev) => prev.filter((t) => t.id !== id));
      if (userId) {
        await dbDelete("recycle_bin", id);
      }
    },
    [userId]
  );

  // ── Investment actions ───────────────────────────────────────────────────────

  const addInvestment = useCallback((inv: Omit<Investment, "id">) => {
    const newInv: Investment = { ...inv, id: Math.random().toString(36).substr(2, 9) };
    setInvestments((prev) => [...prev, newInv]);
  }, []);

  // ── Workspace actions ────────────────────────────────────────────────────────

  const addWorkspace = useCallback((name: string, iconClass: string) => {
    setWorkspaces((prev) => [...prev, { name, iconClass }]);
  }, []);

  return (
    <DataContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        recycleBin,
        restoreTask,
        permanentlyDeleteTask,
        investments,
        addInvestment,
        workspaces,
        addWorkspace,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}
