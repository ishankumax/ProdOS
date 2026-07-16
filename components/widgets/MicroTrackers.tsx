"use client";

import { useState, useEffect } from "react";
import { CLASSES } from "@/lib/theme";

export default function MicroTrackers() {
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(7);
  const [mood, setMood] = useState("Calm");
  const [exercise, setExercise] = useState(0); // mins
  const [meal, setMeal] = useState("Salad");
  const [energy, setEnergy] = useState(70);

  useEffect(() => {
    // Load local state
    setWater(parseInt(localStorage.getItem("prod_os_tracker_water") || "0", 10));
    setSleep(parseInt(localStorage.getItem("prod_os_tracker_sleep") || "7", 10));
    setMood(localStorage.getItem("prod_os_tracker_mood") || "Calm");
    setExercise(parseInt(localStorage.getItem("prod_os_tracker_exercise") || "0", 10));
    setMeal(localStorage.getItem("prod_os_tracker_meal") || "Salad");
    setEnergy(parseInt(localStorage.getItem("prod_os_tracker_energy") || "70", 10));
  }, []);

  const save = (key: string, val: string | number) => {
    localStorage.setItem(key, val.toString());
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
      
      {/* Water Tracker */}
      <div className={`p-4 ${CLASSES.card} flex flex-col justify-between`}>
        <div>
          <span className="text-[10px] text-white/40 uppercase font-semibold">Water Intake</span>
          <p className="text-lg font-bold text-white mt-1">{water} glasses</p>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => { setWater(w => { const n = Math.max(0, w - 1); save("prod_os_tracker_water", n); return n; }) }}
            className="flex-1 py-1 rounded bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white"
          >
            -
          </button>
          <button
            onClick={() => { setWater(w => { const n = w + 1; save("prod_os_tracker_water", n); return n; }) }}
            className="flex-1 py-1 rounded bg-brand-500/20 border border-brand-500/30 text-xs text-brand-300 hover:bg-brand-500/30"
          >
            +
          </button>
        </div>
      </div>

      {/* Sleep Tracker */}
      <div className={`p-4 ${CLASSES.card} flex flex-col justify-between`}>
        <div>
          <span className="text-[10px] text-white/40 uppercase font-semibold">Sleep cycles</span>
          <p className="text-lg font-bold text-white mt-1">{sleep} hrs</p>
        </div>
        <input
          type="range"
          min="4"
          max="12"
          value={sleep}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setSleep(val);
            save("prod_os_tracker_sleep", val);
          }}
          className="w-full accent-brand-500 mt-4 cursor-pointer"
        />
      </div>

      {/* Mood Tracker */}
      <div className={`p-4 ${CLASSES.card} flex flex-col justify-between`}>
        <div>
          <span className="text-[10px] text-white/40 uppercase font-semibold">Energy Vibe</span>
          <p className="text-lg font-bold text-white mt-1">{mood}</p>
        </div>
        <select
          value={mood}
          onChange={(e) => {
            setMood(e.target.value);
            save("prod_os_tracker_mood", e.target.value);
          }}
          className="w-full bg-white/[0.03] border border-white/10 rounded p-1 text-xs text-white outline-none mt-3"
        >
          <option value="Calm">Calm 🧘</option>
          <option value="Inspired">Inspired ✨</option>
          <option value="Tired">Tired 😴</option>
          <option value="Anxious">Anxious 🌧️</option>
        </select>
      </div>

      {/* Exercise Tracker */}
      <div className={`p-4 ${CLASSES.card} flex flex-col justify-between`}>
        <div>
          <span className="text-[10px] text-white/40 uppercase font-semibold">Exercise log</span>
          <p className="text-lg font-bold text-white mt-1">{exercise} mins</p>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => { setExercise(e => { const n = Math.max(0, e - 10); save("prod_os_tracker_exercise", n); return n; }) }}
            className="flex-1 py-1 rounded bg-white/5 border border-white/10 text-[10px]"
          >
            -10m
          </button>
          <button
            onClick={() => { setExercise(e => { const n = e + 10; save("prod_os_tracker_exercise", n); return n; }) }}
            className="flex-1 py-1 rounded bg-brand-500/20 border border-brand-500/30 text-[10px]"
          >
            +10m
          </button>
        </div>
      </div>

      {/* Meal Tracker */}
      <div className={`p-4 ${CLASSES.card} flex flex-col justify-between`}>
        <div>
          <span className="text-[10px] text-white/40 uppercase font-semibold">Healthy Eating</span>
          <input
            type="text"
            value={meal}
            onChange={(e) => {
              setMeal(e.target.value);
              save("prod_os_tracker_meal", e.target.value);
            }}
            className="w-full bg-transparent border-b border-white/10 mt-1 text-sm text-white font-bold outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Energy Level */}
      <div className={`p-4 ${CLASSES.card} flex flex-col justify-between`}>
        <div>
          <span className="text-[10px] text-white/40 uppercase font-semibold">Energy level</span>
          <p className="text-lg font-bold text-white mt-1">{energy}%</p>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={energy}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setEnergy(val);
            save("prod_os_tracker_energy", val);
          }}
          className="w-full accent-brand-500 mt-4 cursor-pointer"
        />
      </div>

    </div>
  );
}
