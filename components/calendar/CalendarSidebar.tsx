"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function CalendarSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeHovered, setThemeHovered] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clock, setClock] = useState(new Date());

  // Focus Timer States
  const [focusDuration, setFocusDuration] = useState(30); // in minutes
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // in seconds

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync clock time
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
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

  // Focus session countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isFocusActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isFocusActive) {
      setIsFocusActive(false);
      // Play a soft synth beep
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime); // 800 Hz
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (err) {
        console.warn("AudioContext block", err);
      }
      alert("[System Focus]: Session complete! Time to rest.");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusActive, timeLeft]);

  // Adjust remaining time when focus duration changes (and not active)
  useEffect(() => {
    if (!isFocusActive) {
      setTimeLeft(focusDuration * 60);
    }
  }, [focusDuration, isFocusActive]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
    // If selecting a date outside current month, shift view
    if (date.getMonth() !== month) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  // Focus timer actions
  const toggleFocus = () => {
    setIsFocusActive(!isFocusActive);
  };

  const adjustDuration = (amount: number) => {
    if (isFocusActive) return;
    setFocusDuration((prev) => Math.max(5, Math.min(240, prev + amount)));
  };

  // Helper formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
        title="Calendar & Focus"
      >
        <span className="text-lg select-none">📅</span>
      </button>

      {/* Windows 11 Style Calendar & Notification Sidebar */}
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
            <div className="text-sm font-semibold font-mono text-white/95">
              {clock.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="text-[10px] font-bold font-mono text-brand-400 mt-0.5 uppercase tracking-wider">
              {clock.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
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

        {/* Month Navigation & Grid */}
        <div className="p-4 flex-1 flex flex-col min-h-0 overflow-y-auto space-y-4">
          <div className="space-y-3">
            {/* Header selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-white/90">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
                >
                  ▲
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
                >
                  ▼
                </button>
              </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day} className="text-[10px] font-bold font-mono text-white/25 uppercase">
                  {day}
                </span>
              ))}
            </div>

            {/* Monthly Calendar Grid */}
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

          <div className="h-px bg-white/5 shrink-0" />

          {/* Windows-like Focus Session Section */}
          <div className="space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono text-white/35 uppercase tracking-widest">
                Focus Session
              </span>
              {isFocusActive && (
                <span className="text-[9px] font-bold font-mono text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded animate-pulse">
                  ACTIVE
                </span>
              )}
            </div>

            {isFocusActive ? (
              <div className="p-3.5 rounded-xl border border-brand-500/20 bg-brand-500/5 flex flex-col items-center justify-center gap-2">
                <div className="text-3xl font-black font-mono text-white tracking-wide">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  Remaining Session Time
                </div>
                <button
                  onClick={toggleFocus}
                  className="mt-1 w-full py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-400 font-mono text-xs hover:bg-rose-500/25 transition-all active:scale-95"
                >
                  ■ Stop Focus
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => adjustDuration(-5)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold font-mono"
                  >
                    -
                  </button>
                  <div className="w-16 text-center">
                    <div className="text-sm font-bold font-mono text-white">{focusDuration}</div>
                    <div className="text-[9px] font-mono text-white/30 uppercase">mins</div>
                  </div>
                  <button
                    onClick={() => adjustDuration(5)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold font-mono"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={toggleFocus}
                  className="flex-1 py-2 rounded-xl bg-brand-500 text-white font-mono text-xs hover:bg-brand-400 transition-all active:scale-95 flex items-center justify-center gap-1.5 font-bold shadow-[0_4px_16px_rgba(var(--brand-500-rgb),0.25)]"
                >
                  <span>▶</span> Focus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
