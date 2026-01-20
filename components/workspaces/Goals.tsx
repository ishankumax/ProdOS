"use client";

import { useState } from "react";
import { CLASSES, TEXT } from "@/lib/theme";

type GoalView = "Today" | "Weekly" | "Yearly";

interface GoalItem {
  id: string;
  category: string;
  text: string;
  progress: number;
}

export default function Goals() {
  const [view, setView] = useState<GoalView>("Today");
  const [goals, setGoals] = useState<GoalItem[]>([
    { id: "1", category: "Mindfulness 🧘", text: "15 minutes morning breathing session", progress: 60 },
    { id: "2", category: "Career 💻", text: "Complete ProdOS UI elements design", progress: 85 },
    { id: "3", category: "Health 💧", text: "Drink 3 liters of spring water", progress: 40 },
  ]);

  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalCat, setNewGoalCat] = useState("Mindfulness 🧘");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const item: GoalItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: newGoalCat,
      text: newGoalText.trim(),
      progress: 0,
    };
    setGoals([...goals, item]);
    setNewGoalText("");
  };

  const handleSliderChange = (id: string, val: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: val } : g));
  };

  return (
    <div className="h-full w-full flex flex-col pt-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">🎯 Long-Term Goals</h1>
        
        {/* View Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {(["Today", "Weekly", "Yearly"] as GoalView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                view === v
                  ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.3)]"
                  : "text-white/40 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goals List Card */}
        <div className={`lg:col-span-2 p-6 ${CLASSES.card} space-y-4`}>
          <h3 className={`font-bold ${TEXT.base}`}>{view} Milestones</h3>
          
          <div className="space-y-4">
            {goals.map((g) => (
              <div key={g.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">{g.category}</span>
                  <span className="text-xs font-mono text-white/50">{g.progress}%</span>
                </div>
                <p className="text-xs text-white/80">{g.text}</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={g.progress}
                  onChange={(e) => handleSliderChange(g.id, parseInt(e.target.value, 10))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Add goal card */}
        <div className={`p-6 ${CLASSES.card} space-y-4`}>
          <h3 className={`font-bold ${TEXT.base}`}>Set New Intention</h3>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 block mb-1">Category</label>
              <select
                value={newGoalCat}
                onChange={(e) => setNewGoalCat(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
              >
                <option value="Mindfulness 🧘">Mindfulness 🧘</option>
                <option value="Health 💧">Health 💧</option>
                <option value="Career 💻">Career 💻</option>
                <option value="Finance 🪙">Finance 🪙</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-white/40 block mb-1">Goal Milestone</label>
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="e.g. Meditate for 20 minutes"
                className={`w-full ${CLASSES.input}`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold transition-all shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.25)]"
            >
              Add Intention
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
