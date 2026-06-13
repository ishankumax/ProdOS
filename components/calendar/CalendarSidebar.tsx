"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function CalendarSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeHovered, setThemeHovered] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clock, setClock] = useState<Date | null>(null);

  // Navigation Views: "days" | "months" | "years"
  const [calendarView, setCalendarView] = useState<"days" | "months" | "years">("days");

  // 9 Editable Slots State
  const [slots, setSlots] = useState<string[]>(Array(9).fill(""));

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync clock time — initialize only on client to prevent SSR hydration mismatch
  useEffect(() => {
    setClock(new Date());
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load slots from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("prod_os_calendar_slots");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 9) {
          setSlots(parsed);
        }
      } catch (err) {
        console.error("Failed to parse slots", err);
      }
    }
  }, []);

  // Listen to FloatingThemeSelector hover updates
  useEffect(() => {
    const handleThemeHover = (e: Event) => {
      setThemeHovered((e as CustomEvent).detail);
    };
    window.addEventListener("theme-selector-hover", handleThemeHover);
    return () => {
      window.removeEventListener("theme-selector-hover", handleThemeHover);
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateSlot = (index: number, val: string) => {
    const nextSlots = [...slots];
    nextSlots[index] = val;
    setSlots(nextSlots);
    localStorage.setItem("prod_os_calendar_slots", JSON.stringify(nextSlots));
  };

  // Calendar Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. Day View Calculations
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const prevMonthDays = Array.from(
    { length: startDayOfWeek },
    (_, i) => new Date(year, month - 1, prevMonthTotalDays - startDayOfWeek + 1 + i)
  );

  const currentMonthDays = Array.from(
    { length: totalDays },
    (_, i) => new Date(year, month, i + 1)
  );

  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthPadding = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
  const nextMonthDays = Array.from(
    { length: nextMonthPadding },
    (_, i) => new Date(year, month + 1, i + 1)
  );

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // 2. Month View Calculations (16-cell grid: 12 current year + 4 next year padding)
  const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const allMonthsCells = [
    ...monthsList.map((m, i) => ({ label: m, monthIdx: i, yearOffset: 0 })),
    ...monthsList.slice(0, 4).map((m, i) => ({ label: m, monthIdx: i, yearOffset: 1 }))
  ];

  // 3. Year View Calculations (16-cell grid: startDecade - 2 to startDecade + 13)
  const startDecade = Math.floor(year / 10) * 10;
  const allYearsCells = Array.from({ length: 16 }, (_, i) => startDecade - 2 + i);

  // Navigation Handlers based on Active View
  const handlePrev = () => {
    if (calendarView === "days") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (calendarView === "months") {
      setCurrentDate(new Date(year - 1, month, 1));
    } else if (calendarView === "years") {
      setCurrentDate(new Date(year - 10, month, 1));
    }
  };

  const handleNext = () => {
    if (calendarView === "days") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (calendarView === "months") {
      setCurrentDate(new Date(year + 1, month, 1));
    } else if (calendarView === "years") {
      setCurrentDate(new Date(year + 10, month, 1));
    }
  };

  // Selection Actions
  const selectDay = (date: Date) => {
    setSelectedDate(date);
    if (date.getMonth() !== month || date.getFullYear() !== year) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const selectMonth = (monthIdx: number, yearOffset: number) => {
    const targetYear = year + yearOffset;
    setCurrentDate(new Date(targetYear, monthIdx, 1));
    setCalendarView("days");
  };

  const selectYear = (targetYear: number) => {
    setCurrentDate(new Date(targetYear, month, 1));
    setCalendarView("months");
  };

  // Header click handler to zoom out calendar view
  const handleHeaderClick = () => {
    if (calendarView === "days") {
      setCalendarView("months");
    } else if (calendarView === "months") {
      setCalendarView("years");
    } else {
      setCalendarView("days");
    }
  };

  // Helper formats
  const getHeaderLabel = () => {
    if (calendarView === "days") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (calendarView === "months") {
      return `${year}`;
    } else {
      return `${startDecade} - ${startDecade + 9}`;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-6 z-50 w-12 h-12 rounded-full border backdrop-blur-md bg-surface-raised/80 border-white/10 hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 active:scale-95 flex items-center justify-center text-white/70 hover:text-white pointer-events-auto",
          themeHovered ? "bottom-[298px]" : "bottom-[78px]",
          isOpen ? "border-brand-500/30 bg-brand-500/10 text-brand-400 shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.15)]" : ""
        )}
        title="Calendar & Workspace Notes"
      >
        <span className="text-lg select-none">📅</span>
      </button>

      {/* Windows 11 Style Calendar & Workspace Notes Sidebar */}
      <div
        ref={panelRef}
        className={cn(
          "fixed top-4 bottom-4 right-4 w-[350px] z-50 rounded-2xl border backdrop-blur-md bg-surface-overlay/95 border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-300 ease-out origin-right overflow-hidden",
          isOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-[calc(100%+24px)] opacity-0 pointer-events-none"
        )}
      >
        {/* Dynamic Windows-like Time/Date Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div>
            <div className="text-sm font-semibold font-mono text-white/95" suppressHydrationWarning>
              {clock ? clock.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
            </div>
            <div className="text-[10px] font-bold font-mono text-brand-400 mt-0.5 uppercase tracking-wider" suppressHydrationWarning>
              {clock ? clock.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Loading..."}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
            title="Collapse Panel"
          >
            ✕
          </button>
        </div>

        {/* Panel Content Area */}
        <div className="p-4 flex-1 flex flex-col min-h-0 overflow-y-auto space-y-5">
          
          {/* Multi-Panel Calendar Selector Block */}
          <div className="space-y-3">
            {/* View Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleHeaderClick}
                className="text-xs font-bold font-mono text-white/90 hover:text-brand-400 hover:bg-white/5 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                title="Zoom Out Calendar View"
              >
                {getHeaderLabel()}
                <span className="text-[8px] text-white/40">▼</span>
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
                >
                  ▲
                </button>
                <button
                  onClick={handleNext}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
                >
                  ▼
                </button>
              </div>
            </div>

            {/* 1. DAYS VIEW */}
            {calendarView === "days" && (
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <span key={d} className="text-[10px] font-bold font-mono text-white/25 uppercase">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {allDays.map((day, idx) => {
                    const isSelected =
                      day.getDate() === selectedDate.getDate() &&
                      day.getMonth() === selectedDate.getMonth() &&
                      day.getFullYear() === selectedDate.getFullYear();
                    const isCurrentMonth = day.getMonth() === month;
                    const isToday =
                      day.getDate() === new Date().getDate() &&
                      day.getMonth() === new Date().getMonth() &&
                      day.getFullYear() === new Date().getFullYear();

                    return (
                      <button
                        key={idx}
                        onClick={() => selectDay(day)}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-semibold font-mono transition-all relative",
                          isCurrentMonth ? "text-white/80" : "text-white/20",
                          isSelected
                            ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.3)] scale-105"
                            : "hover:bg-white/5",
                          isToday && !isSelected ? "border border-brand-500/40 text-brand-400" : ""
                        )}
                      >
                        {day.getDate()}
                        {isToday && (
                          <span className={cn(
                            "absolute bottom-1.5 w-1 h-1 rounded-full",
                            isSelected ? "bg-white" : "bg-brand-500"
                          )} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. MONTHS VIEW (4x4 Grid) */}
            {calendarView === "months" && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {allMonthsCells.map((cell, idx) => {
                  const isSelected =
                    selectedDate.getMonth() === cell.monthIdx &&
                    selectedDate.getFullYear() === year + cell.yearOffset;
                  const isOutsideYear = cell.yearOffset > 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => selectMonth(cell.monthIdx, cell.yearOffset)}
                      className={cn(
                        "h-12 rounded-xl flex items-center justify-center text-xs font-semibold font-mono transition-all",
                        isOutsideYear ? "text-white/20" : "text-white/80",
                        isSelected
                          ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.3)] scale-105"
                          : "hover:bg-white/5"
                      )}
                    >
                      {cell.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. YEARS VIEW (4x4 Grid) */}
            {calendarView === "years" && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {allYearsCells.map((cellYear, idx) => {
                  const isSelected = selectedDate.getFullYear() === cellYear;
                  const isOutsideDecade = cellYear < startDecade || cellYear > startDecade + 9;

                  return (
                    <button
                      key={idx}
                      onClick={() => selectYear(cellYear)}
                      className={cn(
                        "h-12 rounded-xl flex items-center justify-center text-xs font-semibold font-mono transition-all",
                        isOutsideDecade ? "text-white/20" : "text-white/80",
                        isSelected
                          ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.3)] scale-105"
                          : "hover:bg-white/5"
                      )}
                    >
                      {cellYear}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="h-px bg-white/5 shrink-0" />

          {/* 9 Editable Slots / Quick Protocol Panels Grid */}
          <div className="space-y-3 shrink-0">
            <span className="text-[10px] font-bold font-mono text-white/35 uppercase tracking-widest">
              Protocol Configuration
            </span>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.01] border border-white/5 rounded-xl p-1.5 flex flex-col focus-within:border-brand-500/25 focus-within:bg-white/[0.02] transition-all"
                >
                  <span className="text-[8px] font-bold font-mono text-brand-500/50 block select-none">
                    SLOT 0{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={slot}
                    onChange={(e) => updateSlot(idx, e.target.value)}
                    placeholder="—"
                    className="w-full bg-transparent border-none outline-none font-mono text-xs text-white/85 focus:text-white placeholder-white/10 text-center mt-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
