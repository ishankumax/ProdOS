"use client";

import { useState, useEffect } from "react";
import { CLASSES, TEXT } from "@/lib/theme";

interface HourlyTask {
  time: string;
  task: string;
}

const defaultHours = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
];

export default function DailyPlanner() {
  const [planner, setPlanner] = useState<HourlyTask[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempText, setTempText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("prod_os_daily_planner");
    if (saved) {
      try {
        setPlanner(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initial = defaultHours.map(time => ({ time, task: "" }));
      setPlanner(initial);
    }
  }, []);

  const savePlanner = (updated: HourlyTask[]) => {
    setPlanner(updated);
    localStorage.setItem("prod_os_daily_planner", JSON.stringify(updated));
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempText(planner[index]?.task || "");
  };

  const handleSave = (index: number) => {
    const updated = [...planner];
    if (updated[index]) {
      updated[index].task = tempText.trim();
      savePlanner(updated);
    }
    setEditingIndex(null);
  };

  return (
    <div className={`h-full flex flex-col p-5 ${CLASSES.card} relative group`}>
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${TEXT.base}`}>
        <span>📅</span> Daily Planner
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[300px]">
        {planner.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg border border-white/5 bg-white/[0.01]">
            <span className="text-[10px] font-mono text-white/40 w-16">{item.time}</span>
            {editingIndex === index ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded px-2 py-1 text-xs text-white outline-none"
                  autoFocus
                  onBlur={() => handleSave(index)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave(index)}
                />
              </div>
            ) : (
              <div
                onClick={() => handleEdit(index)}
                className={`flex-1 text-xs rounded px-2 py-1 cursor-pointer transition-colors ${
                  item.task ? "text-white/95 bg-brand-500/10 border border-brand-500/20" : "text-white/30 hover:bg-white/[0.03]"
                }`}
              >
                {item.task || "Block time slot..."}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
