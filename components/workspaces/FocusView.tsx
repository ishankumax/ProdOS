"use client";

import { useState, useEffect, useRef } from "react";
import { CLASSES, TEXT } from "@/lib/theme";

export default function FocusView() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "short" | "long">("focus");
  const [soundLoop, setSoundLoop] = useState<"none" | "lofi" | "rain" | "wind">("none");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      // Play chime alert
      const chime = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav");
      chime.play().catch(e => console.log(e));
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === "focus") setSecondsLeft(25 * 60);
    else if (newMode === "short") setSecondsLeft(5 * 60);
    else setSecondsLeft(15 * 60);
  };

  const handleSoundToggle = (sound: typeof soundLoop) => {
    if (soundLoop === sound) {
      setSoundLoop("none");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } else {
      setSoundLoop(sound);
      if (audioRef.current) audioRef.current.pause();

      let url = "";
      if (sound === "lofi") url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      else if (sound === "rain") url = "https://assets.mixkit.co/active_storage/sfx/2433/2433-84.wav";
      else if (sound === "wind") url = "https://assets.mixkit.co/active_storage/sfx/2435/2435-84.wav";

      if (url) {
        audioRef.current = new Audio(url);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(e => console.log(e));
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="h-full w-full flex flex-col pt-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">⏳ Focus Coach</h1>
        <span className="text-xs text-white/40 uppercase tracking-widest">Deep Work Companion</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pomodoro Timer Widget */}
        <div className={`lg:col-span-2 p-8 ${CLASSES.card} flex flex-col items-center justify-center space-y-6 min-h-[300px]`}>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {(["focus", "short", "long"] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  mode === m
                    ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.3)]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {m === "focus" ? "Focus" : m === "short" ? "Short Break" : "Long Break"}
              </button>
            ))}
          </div>

          <div className="text-7xl font-mono tracking-wider font-bold text-white/95">
            {formatTime(secondsLeft)}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-[0_0_16px_rgba(var(--brand-500-rgb),0.3)]"
            >
              {isActive ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => handleModeChange(mode)}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Ambient Soundscapes */}
        <div className={`p-6 ${CLASSES.card} space-y-4`}>
          <h3 className={`font-bold ${TEXT.base}`}>Ambient Loops</h3>
          <p className="text-xs text-white/40">Layer subtle audio to block environmental noise.</p>
          
          <div className="space-y-2">
            {[
              { id: "lofi", name: "Chill Lofi Beats 🎧" },
              { id: "rain", name: "Soft Rain Loops 🌧️" },
              { id: "wind", name: "Forest Wind 🍃" },
            ].map((sound) => {
              const active = soundLoop === sound.id;
              return (
                <button
                  key={sound.id}
                  onClick={() => handleSoundToggle(sound.id as typeof soundLoop)}
                  className={`w-full p-4 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    active
                      ? "bg-brand-500/10 border-brand-500/40 text-brand-300 shadow-[0_0_8px_rgba(var(--brand-500-rgb),0.1)]"
                      : "bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  <span>{sound.name}</span>
                  {active && <span className="text-[10px] uppercase font-bold text-brand-400">Playing</span>}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
