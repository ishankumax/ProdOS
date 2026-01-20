"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WorkspaceType } from "./BottomNavbar";
import { useEditMode } from "@/contexts/EditModeContext";
import { ICONS } from "@/lib/theme";
import { pressAnimation } from "@/lib/motion";

// ─── SVG Segmented Progress Bar ───────────────────────────────────────────────
// Uses rect cutouts for pixel-perfect 1px gaps — immune to CSS subpixel rounding.
function SegmentedBar({ width, height, segments, progress, color }: {
  width: number; height: number; segments: number; progress: number; color: string;
}) {
  const gap = 1;
  const segW = (width - gap * (segments - 1)) / segments;
  const filled = progress * segments;

  return (
    <svg width={width} height={height} style={{ display: "block", borderRadius: height / 2, overflow: "hidden" }}>
      <rect x={0} y={0} width={width} height={height} fill="rgba(255,255,255,0.07)" rx={height / 2} />
      {Array.from({ length: segments }).map((_, i) => {
        const x = i * (segW + gap);
        const fill = Math.min(Math.max(filled - i, 0), 1);
        if (fill === 0) return null;
        return (
          <rect key={i} x={Math.round(x)} y={0} width={Math.round(segW * fill)} height={height} fill={color} />
        );
      })}
      {/* Gap cutouts drawn on top — crisp 1px at exact integer coords */}
      {Array.from({ length: segments - 1 }).map((_, i) => {
        const x = Math.round((i + 1) * (segW + gap)) - 1;
        return <rect key={i} x={x} y={0} width={1} height={height} fill="#09090e" />;
      })}
    </svg>
  );
}

// ─── Types & Helpers ──────────────────────────────────────────────────────────
interface StatusBarProps {
  activeWorkspace: WorkspaceType;
  calOpen: boolean;
  setCalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  calBtnRef: React.RefObject<HTMLButtonElement>;
  notesOpen: boolean;
  setNotesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notesBtnRef: React.RefObject<HTMLButtonElement>;
  onSettingsOpen?: () => void;
}

const getWeekNumber = (d: Date) => {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

const getProgressColor = (progress: number): string => {
  if (progress < 0.25) return "#f43f5e";
  if (progress < 0.5)  return "#f97316";
  if (progress < 0.75) return "#eab308";
  return "#10b981";
};



// ─── Status Bar ──────────────────────────────────────────────────────────
export default function StatusBar({ activeWorkspace, calOpen, setCalOpen, calBtnRef, notesOpen, setNotesOpen, notesBtnRef, onSettingsOpen }: StatusBarProps) {
  const { isEditing, toggleEdit } = useEditMode();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted,   setIsMounted]   = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours   = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const dayProgress  = (hours + minutes / 60 + seconds / 3600) / 24;
  const dayIndex     = (currentTime.getDay() + 6) % 7;
  const weekProgress = (dayIndex + dayProgress) / 7;
  const currentWeek  = getWeekNumber(currentTime);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#09090e]/90 backdrop-blur-md border-t border-white/[0.06] flex items-center justify-between px-8 z-[100] text-[11px] uppercase tracking-wider font-semibold text-white/40 select-none">

      {/* ── Left: Workspace label ── */}
      <span onClick={onSettingsOpen} className="cursor-pointer hover:text-white transition-colors">
        Workspace: {activeWorkspace}
      </span>

      {/* ── Right: Time / Date / Day + Edit button ── */}
      {isMounted && (
        <div className="flex items-center gap-2 text-white/35 normal-case font-mono">
          {/* Cal button — opens CalendarOverlay via Shell */}
          <button
            ref={calBtnRef}
            onClick={() => setCalOpen(o => !o)}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-150 border border-transparent hover:bg-white/[0.08] hover:text-white/70 ${
              calOpen ? "bg-white/[0.08] text-white/70" : ""
            }`}
          >
            {/* Time */}
            <div className="flex flex-col items-center gap-1 w-28">
              <span className="flex items-center leading-none">
                {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                <sup className="ml-0.5 text-[9px] text-white/20">IST</sup>
              </span>
              <div className="w-[77px] h-[3px]" />
            </div>

            <span className="text-white/10 self-stretch flex items-center justify-center">|</span>

            {/* Date + Day progress */}
            <div className="flex flex-col items-center gap-1 w-28">
              <span className="flex items-center leading-none">
                {currentTime.getDate()} {currentTime.toLocaleString("en-US", { month: "short" })}
                <sup className="ml-0.5 text-[9px] text-white/20">{currentTime.getFullYear()}</sup>
              </span>
              <SegmentedBar width={77} height={3} segments={6} progress={dayProgress} color={getProgressColor(dayProgress)} />
            </div>

            <span className="text-white/10 self-stretch flex items-center justify-center">|</span>

            {/* Day + Week progress */}
            <div className="flex flex-col items-center gap-1 w-28">
              <span className="flex items-center leading-none">
                {currentTime.toLocaleString("en-US", { weekday: "long" })}
                <sup className="ml-0.5 text-[9px] text-white/20">W{currentWeek}</sup>
              </span>
              <SegmentedBar width={76} height={3} segments={7} progress={weekProgress} color={getProgressColor(weekProgress)} />
            </div>
          </button>

          <span className="text-white/10">|</span>

          <motion.button
            onClick={toggleEdit}
            whileTap={pressAnimation}
            title={isEditing ? "Exit Edit Mode" : "Edit Mode"}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 ${
              isEditing
                ? "bg-brand-500/20 border border-brand-500/40 text-brand-400 shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.25)]"
                : "text-white/35 hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            <i className={`${isEditing ? ICONS.check : ICONS.edit} text-[10px] flex items-center`} />
          </motion.button>

          <span className="text-white/10">|</span>

          {/* ── Notes icon button (far right) ── */}
          <motion.button
            ref={notesBtnRef}
            whileTap={pressAnimation}
            onClick={() => setNotesOpen(v => !v)}
            title="Quick Notes"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 border border-transparent ${
              notesOpen
                ? "bg-white/[0.08] text-white/70"
                : "text-white/35 hover:text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            <i className={`${ICONS.note} text-[10px] flex items-center`} />
          </motion.button>
        </div>
      )}
    </div>
  );
}
