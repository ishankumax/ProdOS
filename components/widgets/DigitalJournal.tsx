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
}

export default function DigitalJournal() {
  const [entry, setEntry] = useState<JournalEntry>({
    intention: "",
    biggestWin: "",
    highlight: "",
    emoji: "🌸",
    tone: "Calm",
    gratitude: ["", "", ""],
  });

  const [streak, setStreak] = useState(0);
  const emojis = ["🌸", "🧘", "✨", "☀️", "🌙", "🌧️", "🔥", "🌱"];
  const tones = ["Calm", "Reflective", "Focused", "Anxious", "Inspired", "Tired"];

  useEffect(() => {
    const saved = localStorage.getItem("prod_os_journal_v2");
    if (saved) {
      try {
        setEntry(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    const savedStreak = localStorage.getItem("prod_os_journal_streak");
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
  }, []);

  const saveEntry = (updated: JournalEntry) => {
    setEntry(updated);
    localStorage.setItem("prod_os_journal_v2", JSON.stringify(updated));
  };

  const handleChange = (field: keyof JournalEntry, value: string | string[]) => {
    const updated = { ...entry, [field]: value };
    saveEntry(updated);
  };

  const handleGratitudeChange = (index: number, val: string) => {
    const gratitude = [...entry.gratitude];
    gratitude[index] = val;
    const updated = { ...entry, gratitude };
    saveEntry(updated);

    // If gratitude is filled, bump streak
    if (gratitude.every(item => item.trim().length > 0)) {
      setStreak(prev => {
        const next = prev + 1;
        localStorage.setItem("prod_os_journal_streak", next.toString());
        return next;
      });
    }
  };

  return (
    <div className={`h-full flex flex-col p-5 ${CLASSES.card} relative group`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold flex items-center gap-2 ${TEXT.base}`}>
          <span>📖</span> Digital Journal
        </h3>
        <span className="text-[10px] text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded">
          🔥 {streak} gratitude streak
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar max-h-[300px]">
        {/* Intention setting */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">Daily Intention</label>
          <input
            type="text"
            value={entry.intention}
            onChange={(e) => handleChange("intention", e.target.value)}
            placeholder="Today, I intend to..."
            className={`w-full ${CLASSES.input}`}
          />
        </div>

        {/* Emojis and Mood tone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">Emoji Vibe</label>
            <div className="flex gap-1.5 overflow-x-auto py-1">
              {emojis.map((em) => (
                <button
                  key={em}
                  onClick={() => handleChange("emoji", em)}
                  className={`text-sm p-1 rounded hover:bg-white/5 ${entry.emoji === em ? "bg-brand-500/20 border border-brand-500/40" : ""}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase font-semibold mb-1 block">Emotional Tone</label>
            <select
              value={entry.tone}
              onChange={(e) => handleChange("tone", e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
            >
              {tones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gratitude checklist */}
        <div>
          <label className="text-[10px] text-white/40 uppercase font-semibold mb-2 block">Gratitude Tracker (3 Things)</label>
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
      </div>
    </div>
  );
}
