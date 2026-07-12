"use client";

import { useMemo } from "react";
import { HEALTH_COLORS, CLASSES, TEXT } from "@/lib/theme";

interface ActivityRingProps {
  radius: number;
  strokeColor: string;
  progress: number; // between 0 and 1
  strokeWidth?: number;
}

function ActivityRing({ radius, strokeColor, progress, strokeWidth = 8 }: ActivityRingProps) {
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const strokeDashoffset = useMemo(() => circumference * (1 - Math.min(Math.max(progress, 0), 1)), [circumference, progress]);

  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90">
      {/* Background track */}
      <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      {/* Active progress */}
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HealthWidget() {
  // Configurable metrics with dynamic values and colors
  const metrics = useMemo(() => [
    { label: "Steps",  value: "8k", progress: 0.77, color: HEALTH_COLORS.steps,  radius: 70 },
    { label: "Sleep",  value: "6h", progress: 0.56, color: HEALTH_COLORS.sleep,  radius: 55 },
    { label: "Screen", value: "4h", progress: 0.80, color: HEALTH_COLORS.screen, radius: 40 },
  ], []);

  return (
    <div className={`w-[300px] ${CLASSES.card} p-6 flex flex-col items-center justify-center h-full relative`}>
      <h3 className={`absolute top-6 left-6 text-xs font-bold uppercase tracking-widest ${TEXT.muted}`}>Health</h3>

      {/* Circular Activity Rings Stack */}
      <div className="relative w-40 h-40 mt-4">
        {metrics.map(metric => (
          <ActivityRing
            key={metric.label}
            radius={metric.radius}
            strokeColor={metric.color}
            progress={metric.progress}
          />
        ))}
      </div>

      {/* Metrics Labels Legend */}
      <div className="mt-8 grid grid-cols-3 w-full gap-2 text-center">
        {metrics.map(metric => (
          <div key={metric.label}>
            <div className="font-bold text-sm" style={{ color: metric.color }}>{metric.value}</div>
            <div className={`text-[9px] uppercase tracking-wider ${TEXT.muted}`}>{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
