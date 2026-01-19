"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toKey } from "@/utils/date";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dateKey?: string;
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
  addTask: (text: string, dateKey?: string) => void;
  toggleTask: (id: string) => void;
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, "id">) => void;
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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("prod_os_tasks_v2");
      const storedInvestments = localStorage.getItem("prod_os_investments_v2");
      const storedWorkspaces = localStorage.getItem("prod_os_workspaces_v2");

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedInvestments) setInvestments(JSON.parse(storedInvestments));
      
      if (storedWorkspaces) {
        const parsed = JSON.parse(storedWorkspaces);
        if (parsed.length === 0) {
          setWorkspaces(DEFAULT_WORKSPACES);
        } else {
          setWorkspaces(parsed);
        }
      } else {
        setWorkspaces(DEFAULT_WORKSPACES);
      }
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("prod_os_tasks_v2", JSON.stringify(tasks));
      localStorage.setItem("prod_os_investments_v2", JSON.stringify(investments));
      localStorage.setItem("prod_os_workspaces_v2", JSON.stringify(workspaces));
    }
  }, [tasks, investments, workspaces, isLoaded]);

  const addTask = (text: string, dateKey?: string) => {
    const today = new Date();
    const defaultDateKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: Date.now(),
      dateKey: dateKey || defaultDateKey,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addInvestment = (inv: Omit<Investment, "id">) => {
    const newInv: Investment = {
      ...inv,
      id: Math.random().toString(36).substr(2, 9),
    };
    setInvestments((prev) => [...prev, newInv]);
  };

  const addWorkspace = (name: string, iconClass: string) => {
    const newWs: Workspace = { name, iconClass };
    setWorkspaces((prev) => [...prev, newWs]);
  };

  return (
    <DataContext.Provider value={{ tasks, addTask, toggleTask, investments, addInvestment, workspaces, addWorkspace }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}
