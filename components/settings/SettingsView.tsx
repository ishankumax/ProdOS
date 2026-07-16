"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { CLASSES } from "@/lib/theme";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_COLORS = [
  { name: "Rose", id: "rose", color: "#f43f5e" },
  { name: "Lavender", id: "default", color: "#10b981" }, // Lavender/Mint green maps to default
  { name: "Mint", id: "green", color: "#16a34a" },
  { name: "Peach", id: "amber", color: "#f59e0b" },
  { name: "Sky", id: "vscode-dark-modern", color: "#0078d4" },
  { name: "Gold", id: "vscode-hc-light", color: "#eab308" },
];

const TYPOGRAPHY_FONTS = ["Inter", "Nunito", "Outfit", "Quicksand", "Comfortaa"];

export default function SettingsView({ isOpen, onClose }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"personalization" | "notifications" | "privacy" | "data">("personalization");
  const [font, setFont] = useState("Inter");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [startOfWeek, setStartOfWeek] = useState("Sunday");
  const [reminders, setReminders] = useState(true);
  const [soundChimes, setSoundChimes] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  if (!isOpen) return null;

  const handleFontChange = (selectedFont: string) => {
    setFont(selectedFont);
    document.body.style.fontFamily = selectedFont + ", sans-serif";
  };

  const handleExportBackup = () => {
    const data = {
      habits: localStorage.getItem("prod_os_habits"),
      tasks: localStorage.getItem("prod_os_tasks_v2"),
      journal: localStorage.getItem("prod_os_journal_v2"),
      settings: { font, timeFormat, startOfWeek, reminders, soundChimes, zenMode },
    };
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `prod-os-backup-${Date.now()}.json`;
    link.href = url;
    link.click();
  };

  const handleDangerDelete = () => {
    if (deleteConfirmation.trim() === "DELETE") {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className={`w-full max-w-2xl h-[480px] p-0 ${CLASSES.panel} border-white/[0.08] relative mx-4 flex overflow-hidden`}>
        
        {/* Left tabs menu */}
        <div className="w-1/3 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-2">
          <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase mb-4 block">Settings</span>
          <button
            onClick={() => setActiveTab("personalization")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "personalization" ? "bg-brand-500/10 text-brand-400" : "text-white/50 hover:bg-white/[0.03]"
            }`}
          >
            <i className="fi fi-sr-palette" /> Personalization
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "notifications" ? "bg-brand-500/10 text-brand-400" : "text-white/50 hover:bg-white/[0.03]"
            }`}
          >
            <i className="fi fi-sr-bell" /> Notifications
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "privacy" ? "bg-brand-500/10 text-brand-400" : "text-white/50 hover:bg-white/[0.03]"
            }`}
          >
            <i className="fi fi-sr-eye-crossed" /> Privacy
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "data" ? "bg-brand-500/10 text-brand-400" : "text-white/50 hover:bg-white/[0.03]"
            }`}
          >
            <i className="fi fi-sr-database" /> Data Management
          </button>

          <button
            onClick={onClose}
            className="mt-auto w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

        {/* Right Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "personalization" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Accent Colors</h3>
                <div className="flex gap-2.5">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setTheme(c.id)}
                      className={`w-6 h-6 rounded-full border border-black/30 relative flex items-center justify-center transition-all ${
                        theme === c.id ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-[#0d0d1a]" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">Typography Fonts</h3>
                <div className="grid grid-cols-2 gap-2">
                  {TYPOGRAPHY_FONTS.map((f) => (
                    <button
                      key={f}
                      onClick={() => handleFontChange(f)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                        font === f
                          ? "bg-brand-500/10 border-brand-500/30 text-brand-300 font-semibold"
                          : "bg-white/[0.01] border-white/5 text-white/50 hover:border-white/10"
                      }`}
                      style={{ fontFamily: f + ", sans-serif" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">Time &amp; Date Layout</h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-white/40 block mb-1">Time Format</label>
                    <select
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                    >
                      <option value="12h">12-Hour Mode</option>
                      <option value="24h">24-Hour Mode</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-white/40 block mb-1">First Day of Week</label>
                    <select
                      value={startOfWeek}
                      onChange={(e) => setStartOfWeek(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
                    >
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div>
                  <h4 className="text-xs font-semibold text-white">Daily Zen Chimes</h4>
                  <p className="text-[10px] text-white/40">Enable soft audio loops and alarms</p>
                </div>
                <input
                  type="checkbox"
                  checked={soundChimes}
                  onChange={(e) => setSoundChimes(e.target.checked)}
                  className="rounded text-brand-500 bg-white/5 border-white/10"
                />
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div>
                  <h4 className="text-xs font-semibold text-white">System Reminders</h4>
                  <p className="text-[10px] text-white/40">Reminders for posture, journal and hydration</p>
                </div>
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={(e) => setReminders(e.target.checked)}
                  className="rounded text-brand-500 bg-white/5 border-white/10"
                />
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div>
                  <h4 className="text-xs font-semibold text-white">Privacy Blur (Zen Mode)</h4>
                  <p className="text-[10px] text-white/40">Automatically blur sensitive balances until hover</p>
                </div>
                <input
                  type="checkbox"
                  checked={zenMode}
                  onChange={(e) => {
                    setZenMode(e.target.checked);
                    localStorage.setItem("prod_os_zen_mode_privacy", e.target.checked ? "true" : "false");
                  }}
                  className="rounded text-brand-500 bg-white/5 border-white/10"
                />
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-white mb-1">Export JSON Backup</h4>
                <p className="text-[10px] text-white/40 mb-3">Download your local workspace data, tasks and settings.</p>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 bg-brand-500/20 border border-brand-500/30 hover:bg-brand-500/30 text-brand-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <i className="fi fi-sr-download" /> Export Backup
                </button>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h4 className="text-xs font-semibold text-red-400 mb-1">Danger Zone</h4>
                <p className="text-[10px] text-white/40 mb-3">Wipe all user settings, lists, and local storage data completely.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="flex-1 bg-white/[0.03] border border-red-500/20 focus:border-red-500/40 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 outline-none"
                  />
                  <button
                    onClick={handleDangerDelete}
                    disabled={deleteConfirmation !== "DELETE"}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    Wipe Workspace
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
