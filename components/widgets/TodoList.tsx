"use client";

import { useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { CLASSES, TEXT } from "@/lib/theme";

export default function TodoList() {
  const { tasks, addTask, toggleTask } = useData();
  const [newText, setNewText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addTask(`${priority.toUpperCase()}: ${newText.trim()}`);
    setNewText("");
  };

  const getPriorityColor = (taskText: string) => {
    if (taskText.startsWith("HIGH:")) return "text-red-400 border-red-500/20 bg-red-500/10";
    if (taskText.startsWith("MEDIUM:")) return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    return "text-green-400 border-green-500/20 bg-green-500/10";
  };

  const cleanText = (taskText: string) => {
    return taskText.replace(/^(HIGH|MEDIUM|LOW):\s*/i, "");
  };

  return (
    <div className={`h-full flex flex-col p-5 ${CLASSES.card} relative group`}>
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${TEXT.base}`}>
        <span>📋</span> Todo List
      </h3>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add zen task..."
          className={`flex-1 ${CLASSES.input}`}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          className="bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white/70 px-2 outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
        >
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[220px]">
        {tasks.length === 0 ? (
          <div className="text-xs text-white/30 italic text-center py-6">
            All tasks clear. Find peace.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer ${
                task.completed ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <i
                  className={`${
                    task.completed ? "fi fi-sr-checkbox text-brand-400" : "fi fi-rr-square text-white/30"
                  } text-sm flex-shrink-0`}
                />
                <span className={`text-xs text-white/80 truncate ${task.completed ? "line-through text-white/40" : ""}`}>
                  {cleanText(task.text)}
                </span>
              </div>
              <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityColor(task.text)}`}>
                {task.text.split(":")[0]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
