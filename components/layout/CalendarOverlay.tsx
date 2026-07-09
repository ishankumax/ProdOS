"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";
import { ICONS, CLASSES, TEXT, LAYOUT } from "@/lib/theme";

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

// ─── Layout constants (sourced from lib/theme.ts LAYOUT token) ────────────────
const PANEL_TOP    = LAYOUT.headerH + LAYOUT.margin;          // 88px from top
const PANEL_BOTTOM = LAYOUT.margin;                            // 24px from bottom
const PANEL_RIGHT  = LAYOUT.margin + LAYOUT.btnStripW + LAYOUT.btnGap; // 80px from right
const PANEL_WIDTH  = 288;                                      // px

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CalendarOverlay({ isOpen, onClose }: CalendarOverlayProps) {
  const { tasks, addTask, toggleTask } = useData();
  const today = new Date();

  const [viewYear,    setViewYear]    = useState(today.getFullYear());
  const [viewMonth,   setViewMonth]   = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [viewMode,    setViewMode]    = useState<ViewMode>("month");
  const [decadeStart, setDecadeStart] = useState(Math.floor(today.getFullYear() / 10) * 10);

  const [newTaskText,  setNewTaskText]  = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAddingTask) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isAddingTask]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // small delay so the opening click doesn't instantly close
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 80);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", handler); };
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ── Navigation ────────────────────────────────────────────────────────────
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

  // ── Grid ──────────────────────────────────────────────────────────────────
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday       = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelectedDay = (d: number) => d === selectedDay;

  // ── Tasks ─────────────────────────────────────────────────────────────────
  const selectedKey    = toKey(viewYear, viewMonth, selectedDay);
  const todayKey       = toKey(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelectedToday = selectedKey === todayKey;

  const visibleTasks: AgendaTask[] = useMemo(() => {
    if (!isSelectedToday) return [];
    return tasks.filter(t => !t.completed).map(t => ({
      id: t.id, title: t.text, completed: t.completed, type: "task" as const,
    }));
  }, [isSelectedToday, tasks]);

  const datesWithTasks = useMemo(() => {
    const set = new Set<number>();
    if (tasks.filter(t => !t.completed).length > 0 && viewMonth === today.getMonth() && viewYear === today.getFullYear())
      set.add(today.getDate());
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, viewMonth, viewYear]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) { addTask(newTaskText.trim()); setNewTaskText(""); setIsAddingTask(false); }
  };

  const headerLabel =
    viewMode === "month" ? `${getMonthName(viewMonth)} ${viewYear}` :
    viewMode === "year"  ? `${viewYear}` :
                           `${decadeStart} – ${decadeStart + 9}`;

  const taskSectionLabel = isSelectedToday ? "Today's Tasks" : `${selectedDay} ${getMonthName(viewMonth, true)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Subtle backdrop (not full-screen blur, just dimming) ── */}
          <motion.div
            key="cal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[149]"
            onMouseDown={onClose}
          />

          {/* ── Floating inline panel anchored bottom-right ── */}
          <motion.div
            ref={panelRef}
            key="cal-panel"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{   opacity: 0, x: 24 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: "fixed",
              top:    PANEL_TOP,
              bottom: PANEL_BOTTOM,
              right:  PANEL_RIGHT,
              width:  PANEL_WIDTH,
              zIndex: 150,
            }}
            className={`flex flex-col overflow-hidden ${CLASSES.panel}`}
            onMouseDown={e => e.stopPropagation()}
          >

            {/* ══ HEADER: Clock strip ══════════════════════════════════ */}
            <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/[0.06]">
              <LiveClock />
            </div>

            {/* ══ CALENDAR SECTION ════════════════════════════════════ */}
            <div className="flex-shrink-0 px-4 pt-3 pb-2">

              {/* Month/Year header with nav */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={goToPrev}
                  className={CLASSES.iconBtn}
                >
                  <i className={`${ICONS.chevronLeft} text-[10px] flex items-center`} />
                </button>
                <button
                  onClick={() =>
                    setViewMode(m =>
                      m === "month" ? "year" : m === "year" ? "decade" : "month"
                    )
                  }
                  className="text-xs font-bold text-white/85 tracking-wide hover:text-violet-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  {headerLabel}
                </button>
                <button onClick={goToNext} className={CLASSES.iconBtn}>
                  <i className={`${ICONS.chevronRight} text-[10px] flex items-center`} />
                </button>
              </div>

              <AnimatePresence mode="wait">

                {/* Month view */}
                {viewMode === "month" && (
                  <motion.div
                    key="month"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.15 }}
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
                    <div className="grid grid-cols-7">
                      {cells.map((day, idx) => {
                        if (day === null) return <div key={`e-${idx}`} className="h-9" />;
                        const todF = isToday(day), selF = isSelectedDay(day), hasDot = datesWithTasks.has(day), isWknd = idx % 7 === 0 || idx % 7 === 6;
                        return (
                          <button
                            key={`d-${day}`}
                            onClick={() => setSelectedDay(day)}
                            className="relative flex flex-col items-center justify-center h-8 rounded-lg transition-all duration-150 group/cell"
                          >
                            <span
                              className={`
                                w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-150
                                ${selF && todF
                                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/50 scale-110"
                                  : selF
                                  ? "bg-white/18 text-white ring-1 ring-white/25"
                                  : todF
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
                                className={`absolute bottom-0 w-1 h-1 rounded-full ${selF ? "bg-white" : "bg-violet-400"}`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Year view */}
                {viewMode === "year" && (
                  <motion.div
                    key="year"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-3 gap-1.5 py-1"
                  >
                    {MONTH_NAMES.map((name, mi) => {
                      const isCurr = mi === today.getMonth() && viewYear === today.getFullYear(), isSel = mi === viewMonth;
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

                {/* Decade view */}
                {viewMode === "decade" && (
                  <motion.div
                    key="decade"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-4 gap-1.5 py-1"
                  >
                    {Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i).map(yr => {
                      const inDec = yr >= decadeStart && yr <= decadeStart + 9, isCurr = yr === today.getFullYear(), isSel = yr === viewYear;
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

            {/* ── Divider ──────────────────────────────────────────── */}
            <div className="flex-shrink-0 mx-4 border-t border-white/[0.06]" />

            {/* ══ TASKS SECTION ════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col px-4 pt-3 pb-4 min-h-0">

              {/* Tasks header row */}
              <div className="flex items-center justify-between mb-2 flex-shrink-0 gap-2">
                <div className="flex items-center gap-1.5">
                  <i className="fi fi-sr-list-check text-[10px] text-violet-400 flex items-center" />
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${TEXT.muted}`}>{taskSectionLabel}</span>
                  {visibleTasks.length > 0 && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold ml-1">{visibleTasks.length}</span>
                  )}
                </div>
                {/* Add task button inline */}
                <button
                  onClick={() => setIsAddingTask(a => !a)}
                  title="Add Task"
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 ${isAddingTask ? "bg-brand-500 border-brand-400 text-white scale-110" : "bg-white/[0.06] border-white/[0.12] text-white/40 hover:bg-brand-500/20 hover:border-brand-500/40 hover:text-brand-400"}`}
                >
                  <motion.i
                    animate={{ rotate: isAddingTask ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${ICONS.add} text-[10px] flex items-center`}
                  />
                </button>
              </div>

              {/* Add-task form */}
              <AnimatePresence>
                {isAddingTask && (
                  <motion.form key="add-input" initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: "auto", marginBottom: 8 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ duration: 0.2 }} onSubmit={handleAddTask} className="flex-shrink-0 overflow-hidden">
                    <input ref={inputRef} type="text" value={newTaskText} onChange={e => setNewTaskText(e.target.value)}
                      onBlur={() => { if (!newTaskText.trim()) setIsAddingTask(false); }}
                      onKeyDown={e => e.key === "Escape" && setIsAddingTask(false)}
                      placeholder="New task…"
                      className={CLASSES.input}
                    />
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Scrollable task list */}
              <div
                className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 min-h-0"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.2) transparent" }}
              >
                <AnimatePresence mode="popLayout">
                  {visibleTasks.length === 0 && !isAddingTask ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-5 text-center"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center mb-2">
                        <i className="fi fi-sr-check-circle text-white/15 text-sm flex items-center" />
                      </div>
                      <p className="text-[10px] text-white/20 italic">No tasks for this day</p>
                    </motion.div>
                  ) : (
                    visibleTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.15, delay: i * 0.03 }}
                        onClick={() => toggleTask(task.id)}
                        className={`${CLASSES.cardHover} flex items-center gap-2 p-2.5 cursor-pointer group`}
                      >
                        <div className="w-4 h-4 rounded-[5px] border border-brand-400/35 flex-shrink-0 flex items-center justify-center group-hover:border-brand-400/70 transition-colors">
                          <i className={`${ICONS.check} text-[7px] text-brand-400 opacity-0 group-hover:opacity-50 flex items-center transition-opacity`} />
                        </div>
                        {/* Accent bar */}
                        <div className="w-0.5 self-stretch rounded-full flex-shrink-0 bg-brand-400/50" />
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

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Live Clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit",
  });
  const dateStr = time.toLocaleDateString([], {
    weekday: "short", month: "short", day: "numeric",
  }).toUpperCase();

  return (
    <div className="flex items-center justify-between">
      <p className="text-xl font-light tracking-tight text-white font-mono leading-none">
        {timeStr}
      </p>
      <p className="text-[9px] text-white/35 tracking-widest font-semibold">
        {dateStr}
      </p>
    </div>
  );
}
