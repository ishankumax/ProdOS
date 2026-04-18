
"use client";

import { useState, useEffect } from "react";
import DayCard from "./DayCard";
import { getDaysInWeek, getStartOfWeek, getEndOfWeek, getMonthYear } from "@/lib/utils/date";
import { fetchWeeklyDataClient } from "@/lib/utils/calendar-fetch";
import { Goal } from "@/types/goals";
import { Habit, HabitLog } from "@/types/habits";
import { cn } from "@/lib/utils";

export default function WeeklyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<{ goals: Goal[], habits: Habit[], logs: HabitLog[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const days = getDaysInWeek(currentDate);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const start = getStartOfWeek(currentDate);
        const end = getEndOfWeek(currentDate);
        const result = await fetchWeeklyDataClient(start, end);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch calendar data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentDate]);

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <section className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            {getMonthYear(currentDate)}
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          </h2>
          <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">
            Weekly Activity View
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <button 
            onClick={handlePrevWeek} 
            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all group"
            title="Previous Week"
          >
            <span className="group-active:scale-90 transition-transform">←</span>
          </button>
          
          <button 
            onClick={handleToday} 
            className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/[0.03] hover:bg-brand-500/10 hover:text-brand-400 rounded-lg text-white/40 transition-all border border-transparent hover:border-brand-500/20"
          >
            Today
          </button>
          
          <button 
            onClick={handleNextWeek} 
            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all group"
            title="Next Week"
          >
            <span className="group-active:scale-90 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className={cn(
        "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 transition-opacity duration-500",
        loading ? "opacity-50 pointer-events-none" : "opacity-100"
      )}>
        {days.map(day => (
          <DayCard 
            key={day.toISOString()}
            date={day}
            isToday={new Date().toDateString() === day.toDateString()}
            goals={data?.goals || []}
            habits={data?.habits || []}
            logs={data?.logs || []}
          />
        ))}
      </div>

      {/* Mobile Loading Indicator */}
      {loading && (
        <div className="flex justify-center pt-4">
          <div className="w-4 h-4 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
        </div>
      )}
    </section>
  );
}
