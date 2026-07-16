"use client";

import { useState, useEffect } from "react";
import { CLASSES, TEXT } from "@/lib/theme";

interface JournalEntry {
  intention: string;
  biggestWin: string;
  highlight: string;
  emoji: string;
  tone: string;
  gratitude: string[];
  mood: string;
  energy: number;
  motivation: number;
  stress: number;
  socialBattery: number;
}

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🌸", label: "Bloom" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😴", label: "Tired" },
  { emoji: "💖", label: "Loved" },
  { emoji: "😤", label: "Focused" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😭", label: "Sad" },
];

const TONES = ["Calm", "Reflective", "Focused", "Anxious", "Inspired", "Tired"];

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}

function WellnessSlider({ label, value, onChange, color }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-white/40 uppercase font-semibold">{label}</span>
        <span className={`text-[10px] font-bold ${color}`}>{value}/10</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-brand-500 cursor-pointer"
        style={{ accentColor: "var(--brand-500)" }}
      />
    </div>
  );
}

export default function DigitalJournal() {
  const [entry, setEntry] = useState<JournalEntry>({
    intention: "",
    biggestWin: "",
    highlight: "",
    emoji: "🌸",
    tone: "Calm",
    gratitude: ["", "", ""],
    mood: "Calm",
    energy: 7,
    motivation: 7,
    stress: 3,
    socialBattery: 6,
  });

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("prod_os_journal_v3");
    if (saved) {
      try {
        setEntry((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error(e);
      }
    }
    const savedStreak = localStorage.getItem("prod_os_journal_streak");
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
  }, []);

  const saveEntry = (updated: JournalEntry) => {
    setEntry(updated);
    localStorage.setItem("prod_os_journal_v3", JSON.stringify(updated));
  };

  const handleChange = (field: keyof JournalEntry, value: string | string[] | number) => {
    const updated = { ...entry, [field]: value };
    saveEntry(updated);
  };

  const handleGratitudeChange = (index: number, val: string) => {
    const gratitude = [...entry.gratitude];
    gratitude[index] = val;
    const updated = { ...entry, gratitude };
    saveEntry(updated);

    if (gratitude.every((item) => item.trim().length > 0)) {
      setStreak((prev) => {
        const next = prev + 1;
        localStorage.setItem("prod_os_journal_streak", next.toString());
        return next;
      });
    }
  };

  return (
    <div className={`h-full flex flex-col p-5 ${CLASSES.card} relative group`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold flex items-center gap-2 ${TEXT.base}`}>
          <span>📖</span> Digital Journal
        </h3>
        <span className="text-[10px] text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded">
          🔥 {streak} streak
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar max-h-[320px]">

        {/* Mood Selector */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-2 block">
            How are you feeling?
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => handleChange("mood", m.label)}
                className={`flex flex-col items-center gap-0.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                  entry.mood === m.label
                    ? "bg-brand-500/20 border-brand-500/40 text-brand-200"
                    : "border-white/5 bg-white/[0.01] text-white/50 hover:bg-white/[0.04] hover:border-white/10"
                }`}
              >
                <span className="text-base leading-none">{m.emoji}</span>
                <span className="text-[9px]">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wellness Sliders */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <WellnessSlider
            label="Energy"
            value={entry.energy}
            onChange={(v) => handleChange("energy", v)}
            color={entry.energy >= 7 ? "text-green-400" : entry.energy >= 4 ? "text-amber-400" : "text-red-400"}
          />
          <WellnessSlider
            label="Motivation"
            value={entry.motivation}
            onChange={(v) => handleChange("motivation", v)}
            color={entry.motivation >= 7 ? "text-brand-400" : "text-white/50"}
          />
          <WellnessSlider
            label="Stress"
            value={entry.stress}
            onChange={(v) => handleChange("stress", v)}
            color={entry.stress >= 7 ? "text-red-400" : entry.stress >= 4 ? "text-amber-400" : "text-green-400"}
          />
          <WellnessSlider
            label="Social Battery"
            value={entry.socialBattery}
            onChange={(v) => handleChange("socialBattery", v)}
            color={entry.socialBattery >= 7 ? "text-purple-400" : "text-white/50"}
          />
        </div>

        {/* Daily Intention */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">
            Daily Intention
          </label>
          <input
            type="text"
            value={entry.intention}
            onChange={(e) => handleChange("intention", e.target.value)}
            placeholder="Today, I intend to..."
            className={`w-full ${CLASSES.input}`}
          />
        </div>

        {/* Emotional Tone */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">
            Emotional Tone
          </label>
          <select
            value={entry.tone}
            onChange={(e) => handleChange("tone", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Gratitude */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-2 block">
            Gratitude — 3 Things
          </label>
          <div className="space-y-2">
            {entry.gratitude.map((item, idx) => (
              <input
                key={idx}
                type="text"
                value={item}
                onChange={(e) => handleGratitudeChange(idx, e.target.value)}
                placeholder={`${idx + 1}. I am grateful for...`}
                className={`w-full ${CLASSES.input}`}
              />
            ))}
          </div>
        </div>

        {/* Highlight */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">
            Today&apos;s Highlight
          </label>
          <textarea
            value={entry.highlight}
            onChange={(e) => handleChange("highlight", e.target.value)}
            placeholder="The best part of today was..."
            rows={2}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white outline-none resize-none focus:border-brand-500/50 transition-colors placeholder:text-white/20"
          />
        </div>
      </div>
    </div>
  );
}
