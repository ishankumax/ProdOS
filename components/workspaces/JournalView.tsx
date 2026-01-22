"use client";

import { motion } from "framer-motion";
import { useJournal } from "@/contexts/JournalContext";
import DailyTasksGrid from "@/components/journal/DailyTasksGrid";
import WeeklyProgressTracker from "@/components/journal/WeeklyProgressTracker";
import DailyJournalEditor from "@/components/journal/DailyJournalEditor";
import { SPRING_FLUID } from "@/lib/motion";

// ── Main Component ─────────────────────────────────────────────────────────────

export default function JournalView() {
  const {
    selectedDate,
    entry,
    weeklyData,
    isToday,
    isLoaded,
    toggleTask,
    renameTask,
    reorderTasks,
    updateJournalContent,
    navigateToDate,
  } = useJournal();

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col pt-4 relative">
      {/* Go to Today banner (only when viewing a past date) */}
      {!isToday && (
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-6 rounded-2xl bg-brand-500/8 border border-brand-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_FLUID}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <i className="fi fi-sr-calendar text-sm flex items-center" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/95">Viewing Past Journal Entry</p>
              <p className="text-[10px] text-white/40">You are browsing historical records. Journal entry and tasks are in read-only mode.</p>
            </div>
          </div>
          <button
            onClick={() => {
              const now = new Date();
              const y = now.getFullYear();
              const m = now.getMonth();
              const d = now.getDate();
              navigateToDate(`${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <i className="fi fi-sr-calendar-day text-xs flex items-center" />
            Go to Today
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* ── Section 1: Daily Tasks Grid ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_FLUID, delay: 0.05 }}
        >
          <DailyTasksGrid
            tasks={entry.tasks}
            onToggle={toggleTask}
            onRename={renameTask}
            onReorder={reorderTasks}
            isToday={isToday}
          />
        </motion.div>

        {/* ── Section 2 & 3: Weekly Progress + Journal ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
          {/* Left — Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING_FLUID, delay: 0.1 }}
          >
            <WeeklyProgressTracker
              weeklyData={weeklyData}
              selectedDate={selectedDate}
              onDayClick={navigateToDate}
            />
          </motion.div>

          {/* Right — Daily Journal Editor */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING_FLUID, delay: 0.15 }}
          >
            <DailyJournalEditor
              date={selectedDate}
              content={entry.journalContent}
              onContentChange={updateJournalContent}
              isToday={isToday}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
