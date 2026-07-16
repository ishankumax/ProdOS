"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";
import { useEditMode } from "@/contexts/EditModeContext";
import { CLASSES, TEXT } from "@/lib/theme";

type FilterTab = "all" | "active" | "done";
type Priority = "low" | "medium" | "high";

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "text-red-400 border-red-500/20 bg-red-500/10",
  medium: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  low: "text-green-400 border-green-500/20 bg-green-500/10",
};

export default function TodoList() {
  const { tasks, addTask, toggleTask, deleteTask } = useData();
  const { isEditing } = useEditMode();
  const [newText, setNewText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<FilterTab>("all");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addTask(newText.trim(), undefined, priority);
    setNewText("");
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const doneCount = tasks.filter((t) => t.completed).length;

  const TABS: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: tasks.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "done", label: "Done", count: doneCount },
  ];

  return (
    <div className={`h-full flex flex-col p-5 ${CLASSES.card} relative group`}>
      <h3 className={`font-bold mb-3 flex items-center gap-2 ${TEXT.base}`}>
        <span>📋</span> Todo List
      </h3>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-3 bg-white/[0.03] rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${
              filter === tab.key
                ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab.label}
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? "bg-brand-500/30 text-brand-200" : "bg-white/5 text-white/30"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add a task..."
          className={`flex-1 ${CLASSES.input}`}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white/70 px-2 outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Med</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        >
          Add
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar max-h-[200px]">
        {filtered.length === 0 ? (
          <div className="text-xs text-white/30 italic text-center py-6">
            {filter === "done" ? "No completed tasks yet." : "All clear! ✨"}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((task) => {
              const p = (task.priority ?? "medium") as Priority;
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group/item ${
                    task.completed ? "opacity-50" : ""
                  }`}
                >
                  {/* Checkbox + text */}
                  <div
                    className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <i
                      className={`${
                        task.completed
                          ? "fi fi-sr-checkbox text-brand-400"
                          : "fi fi-rr-square text-white/30"
                      } text-sm flex-shrink-0`}
                    />
                    <span
                      className={`text-xs text-white/80 truncate ${
                        task.completed ? "line-through text-white/30" : ""
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  {/* Priority badge + delete (edit mode) */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[p]}`}
                    >
                      {p}
                    </span>
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        title="Delete (moved to Recycle Bin)"
                        className="w-5 h-5 flex items-center justify-center rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover/item:opacity-100"
                      >
                        <i className="fi fi-sr-trash text-[9px]" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
