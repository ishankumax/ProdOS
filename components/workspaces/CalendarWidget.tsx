"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AgendaEvent {
  id: string;
  time: string;
  title: string;
  type: "task" | "meeting" | "event";
  color: string;
}

// ─── Mock data keyed by "YYYY-MM-DD" ──────────────────────────────────────────
const MOCK_EVENTS: Record<string, AgendaEvent[]> = {
  // Populated dynamically + some fixed mock entries
};

const EVENT_TYPE_ICON: Record<string, string> = {
  task: "fi fi-sr-check-circle",
  meeting: "fi fi-sr-users",
  event: "fi fi-sr-star",
};

const EVENT_TYPE_COLOR: Record<string, string> = {
  task: "#3bf651ff",
  meeting: "#5cf6e9ff",
  event: "#daf50bff",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0 = Sun
}
function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["S","M","T","W","T","F","S"];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CalendarWidget() {
  const { tasks } = useData();
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Navigation
  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(1);
  };
  const goToNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(1);
  };

  // Calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const isSelected = (day: number) => day === selectedDay;

  // Agenda items for selected day
  const selectedKey = toKey(viewYear, viewMonth, selectedDay);

  const agendaItems: AgendaEvent[] = useMemo(() => {
    const items: AgendaEvent[] = [];

    // Inject pending tasks for today's key
    const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
    if (selectedKey === todayKey) {
      tasks.filter(t => !t.completed).slice(0, 4).forEach(t => {
        items.push({
          id: t.id,
          time: "Today",
          title: t.text,
          type: "task",
          color: EVENT_TYPE_COLOR.task,
        });
      });
    }

    // Merge any mock events
    const mocks = MOCK_EVENTS[selectedKey] ?? [];
    items.push(...mocks);

    return items;
  }, [selectedKey, tasks, today]);

  // Dates that have events (dots)
  const datesWithEvents = useMemo(() => {
    const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
    const set = new Set<number>();
    // Mark today if tasks exist
    if (tasks.filter(t => !t.completed).length > 0 &&
        viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
      set.add(today.getDate());
    }
    // Mark mock-event dates
    Object.keys(MOCK_EVENTS).forEach(key => {
      if (MOCK_EVENTS[key].length > 0) {
        const [y, m, d] = key.split("-").map(Number);
        if (y === viewYear && m - 1 === viewMonth) set.add(d);
      }
    });
    return set;
  }, [tasks, viewMonth, viewYear, today]);

  const formattedSelected = `${selectedDay} ${MONTH_NAMES[viewMonth].slice(0, 3)}`;

  return (
    <div className="relative">
      {/* ── Trigger Button ─────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        title="Calendar"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 group ${
          isOpen
            ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/8 hover:border-white/20 hover:text-white/80"
        }`}
      >
        <div className="flex items-center gap-2">
          <i className={`fi fi-sr-calendar text-xs flex items-center ${isOpen ? "text-indigo-400" : ""}`} />
          <span className="text-xs font-semibold tracking-wide uppercase">
            {isOpen ? `${MONTH_NAMES[viewMonth]} ${viewYear}` : "Calendar"}
          </span>
        </div>
        <motion.i
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fi fi-sr-angle-down text-[10px] flex items-center"
        />
      </button>

      {/* ── Collapsible Panel ──────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="calendar-panel"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-white/8 bg-[#0f0f1a]/80 backdrop-blur-md p-3">

              {/* ── Month Header ──────────────────────────── */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={goToPrev}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <i className="fi fi-sr-angle-left text-[10px] flex items-center" />
                </button>
                <span className="text-xs font-bold text-white/80 tracking-wide">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button
                  onClick={goToNext}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <i className="fi fi-sr-angle-right text-[10px] flex items-center" />
                </button>
              </div>

              {/* ── Day Labels ────────────────────────────── */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map((d, i) => (
                  <div
                    key={i}
                    className={`text-center text-[10px] font-bold py-0.5 ${
                      i === 0 || i === 6 ? "text-indigo-400/60" : "text-white/25"
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* ── Calendar Grid ─────────────────────────── */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, idx) => {
                  if (day === null) return <div key={`e-${idx}`} />;
                  const todayFlag = isToday(day);
                  const selectedFlag = isSelected(day);
                  const hasEvent = datesWithEvents.has(day);
                  const isWeekend = idx % 7 === 0 || idx % 7 === 6;

                  return (
                    <button
                      key={`d-${day}`}
                      onClick={() => setSelectedDay(day)}
                      className="relative flex flex-col items-center justify-center py-1 rounded-lg transition-all duration-150 group/cell"
                      style={{ minWidth: 0 }}
                    >
                      {/* Selection / today ring */}
                      <span
                        className={`
                          w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-150
                          ${selectedFlag && todayFlag
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-110"
                            : selectedFlag
                            ? "bg-white/20 text-white ring-1 ring-white/30"
                            : todayFlag
                            ? "ring-1 ring-indigo-400 text-indigo-300"
                            : isWeekend
                            ? "text-indigo-300/50 group-hover/cell:bg-white/8 group-hover/cell:text-white"
                            : "text-white/50 group-hover/cell:bg-white/8 group-hover/cell:text-white"
                          }
                        `}
                      >
                        {day}
                      </span>

                      {/* Event dot */}
                      {hasEvent && (
                        <span
                          className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                            selectedFlag ? "bg-white" : "bg-indigo-400"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Divider ───────────────────────────────── */}
              <div className="my-3 border-t border-white/6" />

              {/* ── Agenda Section ────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                    {formattedSelected}
                  </span>
                  {agendaItems.length > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                      {agendaItems.length}
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {agendaItems.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="py-4 text-center text-[11px] text-white/20 italic"
                    >
                      No events for this day
                    </motion.div>
                  ) : (
                    <motion.div
                      key={selectedKey}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5 custom-scroll"
                    >
                      {agendaItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-white/4 border border-white/6 hover:bg-white/7 transition-colors"
                        >
                          {/* Color bar */}
                          <div
                            className="w-0.5 self-stretch rounded-full flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-white/80 truncate leading-tight">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <i
                                className={`${EVENT_TYPE_ICON[item.type]} flex items-center text-[8px]`}
                                style={{ color: item.color }}
                              />
                              <span className="text-[9px] text-white/30 capitalize font-medium">
                                {item.time} · {item.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
