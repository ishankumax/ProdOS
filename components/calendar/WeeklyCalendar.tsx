"use client";

import { useState, useEffect, useCallback, useOptimistic, useTransition } from "react";
import DayCard from "./DayCard";
import { getDaysInWeek, getStartOfWeek, getEndOfWeek, getMonthYear } from "@/lib/utils/date";
import { fetchWeeklyDataClient } from "@/lib/utils/calendar-fetch";
import { Goal } from "@/types/goals";
import { Habit, HabitLog } from "@/types/habits";
import { cn } from "@/lib/utils";
import { useRealtime } from "@/hooks/useRealtime";
import { CalendarSkeleton } from "@/components/skeletons/DashboardSkeletons";

export default function WeeklyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<{ goals: Goal[], habits: Habit[], logs: HabitLog[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Optimistic date for instant header updates
  const [optimisticDate, setOptimisticDate] = useOptimistic(
    currentDate,
    (state, newDate: Date) => newDate
  );

  const loadData = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const start = getStartOfWeek(date);
      const end = getEndOfWeek(date);
      const result = await fetchWeeklyDataClient(start, end);
      setData(result);
    } catch (err) {
      console.error("Failed to fetch calendar data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(currentDate);
  }, [currentDate, loadData]);

  // Real-time sync
  useRealtime(["goals", "habits", "habit_logs"], () => {
    loadData(currentDate);
  });

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    startTransition(() => {
      setOptimisticDate(prev);
    });
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    startTransition(() => {
      setOptimisticDate(next);
    });
    setCurrentDate(next);
  };

  const handleToday = () => {
    const today = new Date();
    startTransition(() => {
      setOptimisticDate(today);
    });
    setCurrentDate(today);
  };

  const days = getDaysInWeek(optimisticDate);

  if (loading && !data) return <CalendarSkeleton />;

  return (
    <section className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            {getMonthYear(optimisticDate)}
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              loading ? "bg-white/20" : "bg-brand-500 animate-pulse"
            )} />
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
        "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 transition-opacity duration-300",
        loading ? "opacity-50" : "opacity-100"
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
    </section>
  );
}

