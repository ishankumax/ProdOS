"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Investment {
  id: string;
  company: string;
  amount: number;
  type: string;
}

interface DataContextType {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, "id">) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("prod_os_tasks");
      const storedInvestments = localStorage.getItem("prod_os_investments");
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedInvestments) setInvestments(JSON.parse(storedInvestments));
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("prod_os_tasks", JSON.stringify(tasks));
      localStorage.setItem("prod_os_investments", JSON.stringify(investments));
    }
  }, [tasks, investments, isLoaded]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: Date.now(),
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

  return (
    <DataContext.Provider value={{ tasks, addTask, toggleTask, investments, addInvestment }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}
