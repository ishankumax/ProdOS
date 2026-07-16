"use client";

import { useState, useEffect } from "react";
import { CLASSES, TEXT } from "@/lib/theme";
import { useEditMode } from "@/contexts/EditModeContext";

interface Habit {
  id: string;
  name: string;
  history: Record<string, boolean>; // dateKey: checked
  streak: number;
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const { isEditing } = useEditMode();

  useEffect(() => {
    const saved = localStorage.getItem("prod_os_habits");
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setHabits([
        { id: "1", name: "Morning Meditation 🧘", history: {}, streak: 3 },
        { id: "2", name: "8 Glasses of Water 💧", history: {}, streak: 5 },
        { id: "3", name: "Read 10 Pages 📚", history: {}, streak: 0 },
      ]);
    }
  }, []);

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem("prod_os_habits", JSON.stringify(updated));
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: newHabitName.trim(),
      history: {},
      streak: 0,
    };
    saveHabits([...habits, newHabit]);
    setNewHabitName("");
  };

  const toggleToday = (id: string) => {
    const today = new Date().toDateString();
    const updated = habits.map((h) => {
      if (h.id === id) {
        const history = { ...h.history };
        const checked = !history[today];
        history[today] = checked;
        const streak = checked ? h.streak + 1 : Math.max(0, h.streak - 1);
        return { ...h, history, streak };
      }
      return h;
    });
    saveHabits(updated);
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter((h) => h.id !== id));
  };

  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className={`h-full flex flex-col p-5 ${CLASSES.card} relative group`}>
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${TEXT.base}`}>
        <span>🔄</span> Habit Tracker
      </h3>

      <form onSubmit={addHabit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New habit name..."
          className={`flex-1 ${CLASSES.input}`}
        />
        <button
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
        >
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-[220px]">
        {habits.map((habit) => {
          const isTodayDone = habit.history[new Date().toDateString()] || false;
          return (
            <div key={habit.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-white/90">{habit.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-brand-400 font-bold flex items-center gap-0.5">
                    🔥 {habit.streak} day streak
                  </span>
                  <button
                    onClick={() => toggleToday(habit.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border text-[10px] transition-colors ${
                      isTodayDone
                        ? "bg-brand-500 border-brand-500 text-white"
                        : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    {isTodayDone ? "✓" : "+"}
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      title="Delete habit"
                      className="w-6 h-6 flex items-center justify-center rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                    >
                      <i className="fi fi-sr-trash text-[9px]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Weekly dots */}
              <div className="flex justify-between pt-1">
                {weekDays.map((day, i) => {
                  const dayKey = day.toDateString();
                  const isDone = habit.history[dayKey] || false;
                  const isDayToday = dayKey === new Date().toDateString();
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[8px] text-white/30 font-semibold font-mono">
                        {day.toLocaleDateString("en-US", { weekday: "narrow" })}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border transition-all ${
                          isDone
                            ? "bg-brand-500 border-brand-500 shadow-[0_0_8px_rgba(var(--brand-500-rgb),0.3)]"
                            : isDayToday
                            ? "border-brand-500/40 bg-white/5"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
