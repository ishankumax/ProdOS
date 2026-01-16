"use client";

import { useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { useEditMode } from "@/contexts/EditModeContext";
import { ICONS, CLASSES, TEXT } from "@/lib/theme";

export default function TasksWidget() {
  const { tasks, addTask, toggleTask } = useData();
  const { isEditing } = useEditMode();
  const [newTaskText, setNewTaskText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const pendingTasks = tasks.filter((t) => !t.completed);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText("");
      setIsAdding(false);
    }
  };

  return (
    <div className={`flex-1 min-w-[400px] max-w-2xl ${CLASSES.card} p-6 flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Today&apos;s Execution</h2>
          <p className={`text-xs mt-1 ${TEXT.muted}`}>Focused task list</p>
        </div>
        {isEditing && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-medium hover:bg-brand-500/25 transition-all"
          >
            <i className={`${ICONS.add} flex items-center text-[10px]`} />
            Add Task
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto space-y-2 pr-2" style={CLASSES.scrollStyle}>
        {isEditing && isAdding && (
          <form onSubmit={handleAdd} className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              type="text"
              autoFocus
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onBlur={() => !newTaskText.trim() && setIsAdding(false)}
              placeholder="What needs to be done?"
              className={CLASSES.input}
            />
          </form>
        )}

        {pendingTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <div className={`w-5 h-5 rounded border-2 flex-shrink-0 transition-colors flex items-center justify-center ${
              task.completed
                ? "bg-brand-500 border-brand-500"
                : "border-white/20 group-hover:border-brand-400"
            }`}>
              {task.completed && <i className={`${ICONS.check} text-white text-[10px] flex items-center`} />}
            </div>
            <span className={`text-white/80 ${task.completed ? "line-through opacity-50" : ""}`}>
              {task.text}
            </span>
          </div>
        ))}

        {!isAdding && pendingTasks.length === 0 && (
          <div className={`h-full flex items-center justify-center ${TEXT.dim} italic`}>
            No tasks for today. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
