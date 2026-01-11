"use client";

import { useState } from "react";

const GOALS = ["Fitness", "Reading", "Code"];

export default function GoalsRail() {
  const [activeGoal, setActiveGoal] = useState<string | null>(null);

  return (
    <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-[#0d0d14]">
      <div className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
        <span className="text-xs font-bold tracking-widest text-white/20 uppercase">Goals</span>
      </div>
      <div className="flex flex-col gap-4">
        {GOALS.map((goal, i) => (
          <button
            key={goal}
            onClick={() => setActiveGoal(activeGoal === goal ? null : goal)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              activeGoal === goal ? "bg-blue-500 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
            title={goal}
          >
            {goal[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
