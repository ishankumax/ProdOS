"use client";

import { useState } from "react";
import { SURFACE, TEXT, ICONS } from "@/lib/theme";

const GOALS = ["Fitness", "Reading", "Code"];

export default function GoalsRail() {
  const [activeGoal, setActiveGoal] = useState<string | null>(null);

  return (
    <div className={`w-16 border-r border-white/[0.06] flex flex-col items-center py-6 gap-6 ${SURFACE.tw.base}`}>
      <div className="rotate-180" style={{ writingMode: "vertical-rl" }}>
        <span className={`text-xs font-bold tracking-widest uppercase ${TEXT.dim}`}>Goals</span>
      </div>
      <div className="flex flex-col gap-4">
        {GOALS.map((goal) => (
          <button
            key={goal}
            onClick={() => setActiveGoal(activeGoal === goal ? null : goal)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
              activeGoal === goal
                ? "bg-brand-500 text-white shadow-md shadow-[var(--accent-shadow)]"
                : "bg-white/[0.05] text-white/40 hover:bg-white/10 hover:text-white/80"
            }`}
            title={goal}
          >
            {goal[0]}
          </button>
        ))}
      </div>
      {/* Add goal */}
      <button
        className={`w-8 h-8 mt-auto rounded-full flex items-center justify-center border border-dashed border-white/20 text-white/25 hover:border-brand-500/40 hover:text-brand-400 transition-all duration-200`}
        title="Add Goal"
      >
        <i className={`${ICONS.add} text-[10px] flex items-center`} />
      </button>
    </div>
  );
}
