"use client";

import { useState } from "react";

export default function TasksWidget() {
  const [tasks, setTasks] = useState([
    "Review system architecture",
    "Prepare presentation for team",
    "Call mom"
  ]);

  return (
    <div className="flex-1 min-w-[400px] max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Today's Execution</h2>
          <p className="text-xs text-white/40 mt-1">Focused task list</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center font-bold transition-colors">
          +
        </button>
      </div>

      <div className="flex-1 overflow-auto space-y-2">
        {tasks.map((task, i) => (
          <div key={i} className="group flex items-center gap-4 p-3 rounded hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-5 h-5 rounded border-2 border-white/20 group-hover:border-blue-400 flex-shrink-0 transition-colors" />
            <span className="text-white/80">{task}</span>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/20 italic">
            No tasks for today. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
