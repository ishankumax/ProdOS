"use client";

import { motion } from "framer-motion";
import { useJournalData } from "@/hooks/useJournalData";
import DailyTasksGrid from "@/components/journal/DailyTasksGrid";
import WeeklyProgressTracker from "@/components/journal/WeeklyProgressTracker";
import DailyJournalEditor from "@/components/journal/DailyJournalEditor";
import { SPRING_FLUID } from "@/lib/motion";

// ── Props ──────────────────────────────────────────────────────────────────────

interface JournalViewProps {
  /** When the calendar overlay selects a date, it passes the dateKey here */
  calendarSelectedDate?: string | null;
}



// ── Main Component ─────────────────────────────────────────────────────────────

export default function JournalView({ calendarSelectedDate }: JournalViewProps) {
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
  } = useJournalData(calendarSelectedDate);

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
      {/* Go to Today button (only when viewing a past date) */}
      {!isToday && (
        <motion.div
          className="flex justify-end mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING_FLUID}
        >
          <button
            onClick={() => {
              const now = new Date();
              const y = now.getFullYear();
              const m = now.getMonth();
              const d = now.getDate();
              navigateToDate(`${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold hover:bg-brand-500/25 transition-all"
          >
            <i className="fi fi-sr-calendar-day text-[10px]" />
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
