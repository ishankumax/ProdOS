"use client";

import { motion } from "framer-motion";
import { CLASSES } from "@/lib/theme";
import { SPRING_FLUID } from "@/lib/motion";
import type { WeekDayData } from "@/hooks/useJournalData";

// ── Props ──────────────────────────────────────────────────────────────────────

interface WeeklyProgressTrackerProps {
  weeklyData: WeekDayData[];
  selectedDate: string;
  onDayClick: (dateKey: string) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Returns a CSS color based on completion percentage: red → orange → yellow → green */
function getBarColor(percentage: number): string {
  if (percentage >= 80) return "#22c55e"; // green-500
  if (percentage >= 60) return "#84cc16"; // lime-500
  if (percentage >= 40) return "#eab308"; // yellow-500
  if (percentage >= 20) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
}

function getBarGradient(percentage: number): string {
  const topColor = getBarColor(percentage);
  // Darken the bottom by mixing with a deeper shade
  if (percentage >= 80) return `linear-gradient(to top, #15803d, ${topColor})`;
  if (percentage >= 60) return `linear-gradient(to top, #4d7c0f, ${topColor})`;
  if (percentage >= 40) return `linear-gradient(to top, #a16207, ${topColor})`;
  if (percentage >= 20) return `linear-gradient(to top, #c2410c, ${topColor})`;
  return `linear-gradient(to top, #b91c1c, ${topColor})`;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function WeeklyProgressTracker({
  weeklyData,
  selectedDate,
  onDayClick,
}: WeeklyProgressTrackerProps) {
  return (
    <div className={`p-5 ${CLASSES.card} h-full flex flex-col`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fi fi-sr-chart-histogram text-brand-400 text-sm flex items-center" />
        <h3 className="text-sm font-bold text-white/85">Weekly Progress</h3>
      </div>

      {/* Bars Container */}
      <div className="flex-1 flex items-stretch justify-between gap-2 min-h-0">
        {weeklyData.map((day) => {
          const isSelected = day.date === selectedDate;

          return (
            <button
              key={day.date}
              onClick={() => onDayClick(day.date)}
              className={`flex-1 flex flex-col items-center justify-between gap-2 py-3 px-1 rounded-xl transition-all duration-200 group h-full ${
                isSelected
                  ? "bg-brand-500/10 ring-1 ring-brand-500/30"
                  : "hover:bg-white/[0.04]"
              }`}
            >
              {/* Day label */}
              <span
                className={`text-[9px] font-bold uppercase tracking-wider ${
                  day.isToday
                    ? "text-brand-400"
                    : isSelected
                    ? "text-white/70"
                    : "text-white/30"
                }`}
              >
                {day.label}
              </span>

              {/* Day number */}
              <span
                className={`text-[10px] font-semibold ${
                  day.isToday
                    ? "text-brand-300"
                    : isSelected
                    ? "text-white/80"
                    : "text-white/45"
                }`}
              >
                {day.dayNum}
              </span>

              {/* Vertical Progress Bar */}
              <div className="flex-1 w-5 rounded-full bg-white/[0.06] overflow-hidden relative flex items-end my-1">
                <motion.div
                  className="w-full rounded-full"
                  style={{
                    background:
                      day.percentage > 0
                        ? getBarGradient(day.percentage)
                        : "rgba(255,255,255,0.04)",
                    boxShadow:
                      day.percentage >= 60
                        ? `0 0 12px ${getBarColor(day.percentage)}40`
                        : "none",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${day.percentage}%` }}
                  transition={{
                    ...SPRING_FLUID,
                    delay: 0.05 * weeklyData.indexOf(day),
                  }}
                />
              </div>

              {/* Task Count */}
              <span
                className={`text-[9px] font-bold font-mono ${
                  day.completed === day.total && day.total > 0
                    ? "text-brand-400"
                    : "text-white/35"
                }`}
              >
                {day.completed}/{day.total}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
