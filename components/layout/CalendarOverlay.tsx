"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ICONS, CLASSES, LAYOUT } from "@/lib/theme";
import { GENIE_PANEL_VARIANTS, GENIE_PANEL_TRANSITION } from "@/lib/motion";
import { getDaysInMonth, getFirstDayOfMonth, toKey, getMonthName, DAY_LABELS, MONTH_NAMES } from "@/utils/date";

type ViewMode = "month" | "year" | "decade";

interface CalendarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect?: (dateKey: string) => void;
}

const PANEL_BOTTOM = LAYOUT.margin + 40;                      // 64px from bottom (clears 40px status bar)
const PANEL_RIGHT  = LAYOUT.margin;                           // 24px from right (aligns with status bar buttons)
const PANEL_WIDTH  = 288;                                      // px

export default function CalendarOverlay({ isOpen, onClose, onDateSelect }: CalendarOverlayProps) {
  const today = new Date();

  const [viewYear,    setViewYear]    = useState(today.getFullYear());
  const [viewMonth,   setViewMonth]   = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [viewMode,    setViewMode]    = useState<ViewMode>("month");
  const [decadeStart, setDecadeStart] = useState(Math.floor(today.getFullYear() / 10) * 10);

  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
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

  const headerLabel =
    viewMode === "month" ? `${getMonthName(viewMonth)} ${viewYear}` :
    viewMode === "year"  ? `${viewYear}` :
                           `${decadeStart} – ${decadeStart + 9}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[149]"
            onMouseDown={onClose}
          />

          <motion.div
            ref={panelRef}
            key="cal-panel"
            variants={GENIE_PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={GENIE_PANEL_TRANSITION}
            style={{
              position:        "fixed",
              bottom:          PANEL_BOTTOM,
              right:           PANEL_RIGHT,
              width:           PANEL_WIDTH,
              zIndex:          150,
              transformOrigin: "bottom right",
            }}
            className={`flex flex-col overflow-hidden pb-4 ${CLASSES.panel}`}
            onMouseDown={e => e.stopPropagation()}
          >
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
                        const todF = isToday(day), selF = isSelectedDay(day), isWknd = idx % 7 === 0 || idx % 7 === 6;
                        return (
                          <button
                            key={`d-${day}`}
                            onClick={() => {
                              setSelectedDay(day);
                              if (onDateSelect) {
                                onDateSelect(toKey(viewYear, viewMonth, day));
                              }
                            }}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
