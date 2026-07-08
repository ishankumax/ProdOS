"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AgendaTask {
  id: string;
  title: string;
  completed: boolean;
  type: "task";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function getMonthName(month: number, short = false) {
  const name = MONTH_NAMES[Math.max(0, Math.min(11, month))] ?? MONTH_NAMES[0];
  return short ? name.slice(0, 3) : name;
}
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type ViewMode = "month" | "year" | "decade";

interface CalendarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Panel width constant — keeps panel to the left of the 60px button strip ──
const PANEL_WIDTH = 300; // px
const BUTTON_STRIP_WIDTH = 68; // px (right-6 + button w-11 = 24+44=68)

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CalendarOverlay({ isOpen, onClose }: CalendarOverlayProps) {
  const { tasks, addTask, toggleTask } = useData();
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [decadeStart, setDecadeStart] = useState(
    Math.floor(today.getFullYear() / 10) * 10
  );

  // Task input state
  const [newTaskText, setNewTaskText] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus input when adding
  useEffect(() => {
    if (isAddingTask) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isAddingTask]);

  // Close on outside click (but not on the trigger button — Shell handles toggle)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timeout = setTimeout(() => document.addEventListener("mousedown", handler), 80);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goToPrev = () => {
    if (viewMode === "month") {
      if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
      else setViewMonth(m => m - 1);
      setSelectedDay(1);
    } else if (viewMode === "year") {
      setViewYear(y => y - 1);
    } else {
      setDecadeStart(d => d - 10);
    }
  };
  const goToNext = () => {
    if (viewMode === "month") {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
      else setViewMonth(m => m + 1);
      setSelectedDay(1);
    } else if (viewMode === "year") {
      setViewYear(y => y + 1);
    } else {
      setDecadeStart(d => d + 10);
    }
  };

  // ── Calendar Grid ──────────────────────────────────────────────────────────
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const isSelectedDay = (day: number) => day === selectedDay;

  // ── Task data ─────────────────────────────────────────────────────────────
  const selectedKey = toKey(viewYear, viewMonth, selectedDay);
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelectedToday = selectedKey === todayKey;

  // Show all pending tasks when today is selected; otherwise empty
  const visibleTasks: AgendaTask[] = useMemo(() => {
    if (!isSelectedToday) return [];
    return tasks.filter(t => !t.completed).map(t => ({
      id: t.id,
      title: t.text,
      completed: t.completed,
      type: "task" as const,
    }));
  }, [isSelectedToday, tasks]);

  // Dates that have pending tasks (for dots)
  const datesWithTasks = useMemo(() => {
    const set = new Set<number>();
    if (
      tasks.filter(t => !t.completed).length > 0 &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    ) {
      set.add(today.getDate());
    }
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, viewMonth, viewYear]);

  // ── Task Add ───────────────────────────────────────────────────────────────
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText("");
      setIsAddingTask(false);
    }
  };

  // ── Header label ──────────────────────────────────────────────────────────
  const headerLabel =
    viewMode === "month"
      ? `${getMonthName(viewMonth)} ${viewYear}`
      : viewMode === "year"
      ? `${viewYear}`
      : `${decadeStart} – ${decadeStart + 9}`;

  const taskSectionLabel = isSelectedToday
    ? "Today's Tasks"
    : `${selectedDay} ${getMonthName(viewMonth, true)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop blur overlay ───────────────────────────────────── */}
          <motion.div
            key="cal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[149] bg-black/20 backdrop-blur-[2px]"
            onMouseDown={onClose}
          />

          {/* ── Full-height panel ──────────────────────────────────────── */}
          <motion.div
            ref={panelRef}
            key="cal-panel"
            initial={{ opacity: 0, x: PANEL_WIDTH }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: PANEL_WIDTH }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: BUTTON_STRIP_WIDTH,
              width: PANEL_WIDTH,
              height: "100vh",
              zIndex: 150,
            }}
            className="flex flex-col border-l border-r border-white/8 bg-[#0d0d18]/98 backdrop-blur-2xl shadow-[-24px_0_64px_rgba(0,0,0,0.6)]"
            onMouseDown={e => e.stopPropagation()}
          >
            {/* ══ TOP SECTION: Clock + Calendar ══════════════════════════ */}
            <div className="flex-shrink-0 px-5 pt-5 pb-3">

              {/* Live Clock */}
              <LiveClock />

              {/* Separator */}
              <div className="mt-4 mb-3 border-t border-white/6" />

              {/* Calendar header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={goToPrev}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-all"
                >
                  <i className="fi fi-sr-angle-left text-[10px] flex items-center" />
                </button>

                <button
                  onClick={() =>
                    setViewMode(m =>
                      m === "month" ? "year" : m === "year" ? "decade" : "month"
                    )
                  }
                  className="text-sm font-bold text-white/85 tracking-wide hover:text-violet-300 transition-colors"
                >
                  {headerLabel}
                </button>

                <button
                  onClick={goToNext}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-all"
                >
                  <i className="fi fi-sr-angle-right text-[10px] flex items-center" />
                </button>
              </div>

              {/* ── Calendar Views ──────────────────────────── */}
              <AnimatePresence mode="wait">

                {/* Month View */}
                {viewMode === "month" && (
                  <motion.div
                    key="month"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Day labels */}
                    <div className="grid grid-cols-7 mb-1">
                      {DAY_LABELS.map((d, i) => (
                        <div
                          key={i}
                          className={`text-center text-[9px] font-bold py-1 ${i === 0 || i === 6
                            ? "text-violet-400/50"
                            : "text-white/20"
                            }`}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Date cells */}
                    <div className="grid grid-cols-7">
                      {cells.map((day, idx) => {
                        if (day === null)
                          return <div key={`e-${idx}`} className="h-8" />;
                        const todayF = isToday(day);
                        const selF = isSelectedDay(day);
                        const hasDot = datesWithTasks.has(day);
                        const isWknd = idx % 7 === 0 || idx % 7 === 6;

                        return (
                          <button
                            key={`d-${day}`}
                            onClick={() => setSelectedDay(day)}
                            className="relative flex flex-col items-center justify-center h-9 rounded-lg transition-all duration-150 group/cell"
                          >
                            <span
                              className={`
                                w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-150
                                ${selF && todayF
                                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/50 scale-110"
                                  : selF
                                  ? "bg-white/18 text-white ring-1 ring-white/25"
                                  : todayF
                                  ? "ring-1 ring-violet-400 text-violet-300"
                                  : isWknd
                                  ? "text-violet-300/45 group-hover/cell:bg-white/8 group-hover/cell:text-white/80"
                                  : "text-white/55 group-hover/cell:bg-white/8 group-hover/cell:text-white/80"
                                }
                              `}
                            >
                              {day}
                            </span>
                            {hasDot && (
                              <span
                                className={`absolute bottom-0.5 w-1 h-1 rounded-full ${selF ? "bg-white" : "bg-violet-400"}`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Year View */}
                {viewMode === "year" && (
                  <motion.div
                    key="year"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-3 gap-1.5 py-1"
                  >
                    {MONTH_NAMES.map((name, mi) => {
                      const isCurr = mi === today.getMonth() && viewYear === today.getFullYear();
                      const isSel = mi === viewMonth;
                      return (
                        <button
                          key={name}
                          onClick={() => { setViewMonth(mi); setViewMode("month"); setSelectedDay(1); }}
                          className={`py-2 rounded-xl text-[11px] font-semibold transition-all duration-150 ${isCurr
                            ? "bg-violet-500 text-white shadow-md shadow-violet-500/30"
                            : isSel
                            ? "bg-white/14 text-white ring-1 ring-white/20"
                            : "text-white/45 hover:bg-white/8 hover:text-white"
                            }`}
                        >
                          {name.slice(0, 3)}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Decade View */}
                {viewMode === "decade" && (
                  <motion.div
                    key="decade"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-4 gap-1.5 py-1"
                  >
                    {Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i).map(yr => {
                      const inDec = yr >= decadeStart && yr <= decadeStart + 9;
                      const isCurr = yr === today.getFullYear();
                      const isSel = yr === viewYear;
                      return (
                        <button
                          key={yr}
                          onClick={() => { if (inDec) { setViewYear(yr); setViewMode("year"); } }}
                          className={`py-2 rounded-xl text-[10px] font-semibold transition-all duration-150 ${isCurr
                            ? "bg-violet-500 text-white shadow-md shadow-violet-500/30"
                            : !inDec
                            ? "text-white/18 cursor-default"
                            : isSel
                            ? "bg-white/14 text-white ring-1 ring-white/20"
                            : "text-white/45 hover:bg-white/8 hover:text-white"
                            }`}
                        >
                          {yr}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* ── Divider ─────────────────────────────────────────────── */}
            <div className="flex-shrink-0 mx-4 border-t border-white/6" />

            {/* ══ MIDDLE SECTION: Tasks (fills remaining height) ══════════ */}
            <div className="flex-1 flex flex-col min-h-0 px-4 pt-3 pb-2">

              {/* Tasks header */}
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <i className="fi fi-sr-list-check text-[10px] text-violet-400 flex items-center" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/35">
                    {taskSectionLabel}
                  </span>
                  {visibleTasks.length > 0 && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold ml-1">
                      {visibleTasks.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Add task inline form */}
              <AnimatePresence>
                {isAddingTask && (
                  <motion.form
                    key="add-input"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleAddTask}
                    className="flex-shrink-0 overflow-hidden"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={newTaskText}
                      onChange={e => setNewTaskText(e.target.value)}
                      onBlur={() => { if (!newTaskText.trim()) setIsAddingTask(false); }}
                      onKeyDown={e => e.key === "Escape" && setIsAddingTask(false)}
                      placeholder="New task…"
                      className="w-full bg-violet-500/10 border border-violet-500/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500/60 text-white placeholder:text-white/25 transition-all"
                    />
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Scrollable task list */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 min-h-0"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.2) transparent" }}
              >
                <AnimatePresence mode="popLayout">
                  {visibleTasks.length === 0 && !isAddingTask ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full py-8 text-center"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center mb-3">
                        <i className="fi fi-sr-check-circle text-white/15 text-lg flex items-center" />
                      </div>
                      <p className="text-[11px] text-white/20 italic">No tasks for this day</p>
                      <p className="text-[10px] text-white/12 mt-1">Tap + to add one</p>
                    </motion.div>
                  ) : (
                    visibleTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.18, delay: i * 0.03 }}
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 cursor-pointer transition-all group"
                      >
                        {/* Checkbox */}
                        <div className="w-4 h-4 rounded-[5px] border border-violet-400/35 flex-shrink-0 flex items-center justify-center group-hover:border-violet-400/70 transition-colors">
                          <i className="fi fi-sr-check text-[7px] text-violet-400 opacity-0 group-hover:opacity-50 flex items-center transition-opacity" />
                        </div>

                        {/* Violet accent bar */}
                        <div className="w-0.5 h-full self-stretch rounded-full flex-shrink-0 bg-violet-400/50" />

                        {/* Text */}
                        <p className="text-[11px] font-medium text-white/75 leading-tight truncate flex-1">
                          {task.title}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Divider ─────────────────────────────────────────────── */}
            <div className="flex-shrink-0 mx-4 border-t border-white/6" />

            {/* ══ BOTTOM: Add button ═══════════════════════════════════════ */}
            <div className="flex-shrink-0 px-4 py-4 flex items-center justify-between">
              <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                {visibleTasks.length} task{visibleTasks.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setIsAddingTask(a => !a)}
                title="Add Task"
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-all duration-200 ${isAddingTask
                  ? "bg-violet-500 border-violet-400 text-white scale-110 shadow-violet-500/40"
                  : "bg-white/6 border-white/12 text-white/50 hover:bg-violet-500/20 hover:border-violet-500/40 hover:text-violet-300 hover:scale-105"
                  }`}
              >
                <motion.i
                  animate={{ rotate: isAddingTask ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="fi fi-sr-plus text-sm flex items-center"
                />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Live Clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const dateStr = time.toLocaleDateString([], {
    weekday: "long", month: "long", day: "numeric",
  }).toUpperCase();

  return (
    <div>
      <p className="text-2xl font-light tracking-tight text-white font-mono leading-none">
        {timeStr}
      </p>
      <p className="text-[10px] text-white/35 mt-1.5 tracking-widest font-semibold">
        {dateStr}
      </p>
    </div>
  );
}
