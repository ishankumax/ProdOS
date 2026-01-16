"use client";

import { useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import { SURFACE, CLASSES, TEXT, ICONS } from "@/lib/theme";

export default function CompletedDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { tasks, toggleTask } = useData();

  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className={`fixed left-0 top-16 bottom-0 z-20 ${SURFACE.tw.base} border-r border-white/[0.06] transition-transform duration-300 ${isOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"}`}>

      {/* Slide handle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-24 bg-white/[0.05] border border-l-0 border-white/[0.09] rounded-r-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
      >
        <i className={`${isOpen ? ICONS.chevronLeft : ICONS.chevronRight} text-[10px] flex items-center`} />
      </button>

      <div className="p-6 h-full flex flex-col">
        <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4 ${TEXT.subtle}`}>
          Completed
        </h3>

        <div className="flex-1 overflow-auto space-y-3" style={CLASSES.scrollStyle}>
          {completedTasks.length === 0 ? (
            <div className={`text-sm italic text-center mt-4 ${TEXT.dim}`}>No completed tasks</div>
          ) : (
            completedTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 ${CLASSES.cardHover} line-through text-white/40 text-sm cursor-pointer`}
              >
                {task.text}
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-white/[0.06] text-center">
          <button className={`text-xs text-brand-400 hover:text-brand-300 transition-colors`}>
            View History (Reset Sun)
          </button>
        </div>
      </div>
    </div>
  );
}
