"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/components/providers/DataProvider";
import { useEditMode } from "@/contexts/EditModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { ICONS } from "@/lib/theme";
import { SPRING_BOUNCE, pressAnimation } from "@/lib/motion";
import { useClickAway } from "@/hooks/useClickAway";
import { THEME_COLORS } from "@/lib/themeColors";

export type WorkspaceType = string;

interface BottomNavbarProps {
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
  onSettingsOpen?: () => void;
}

const AVAILABLE_ICONS = [
  { name: "Home", class: "fi fi-sr-home" },
  { name: "Laptop", class: "fi fi-sr-laptop" },
  { name: "Finance", class: "fi fi-sr-chart-histogram" },
  { name: "Box", class: "fi fi-sr-box" },
  { name: "Health", class: "fi fi-sr-heart" },
  { name: "Target", class: "fi fi-sr-target" },
  { name: "Book", class: "fi fi-sr-book" },
  { name: "Bookmark", class: "fi fi-sr-bookmark" },
  { name: "Timer", class: "fi fi-sr-stopwatch" },
  { name: "Notes", class: "fi fi-sr-document" },
  { name: "Wallet", class: "fi fi-sr-wallet" },
  { name: "Star", class: "fi fi-sr-star" },
  { name: "Users", class: "fi fi-sr-users" },
  { name: "Globe", class: "fi fi-sr-globe" },
];

export default function BottomNavbar({ activeWorkspace, onWorkspaceChange, onSettingsOpen }: BottomNavbarProps) {
  const { workspaces, addWorkspace } = useData();
  const { isEditing } = useEditMode();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("fi fi-sr-home");
  const [error, setError] = useState("");
  
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { theme, setTheme, availableThemes } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [themeSearch, setThemeSearch] = useState("");

  const addModalRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useClickAway(addModalRef, () => setShowAddModal(false));
  useClickAway(profileMenuRef, () => setShowProfileMenu(false));
  useClickAway(themeMenuRef, () => setShowThemeMenu(false));

  const filteredThemes = useMemo(() => {
    if (!themeSearch) return availableThemes;
    return availableThemes.filter(
      (t) =>
        t.name.toLowerCase().includes(themeSearch.toLowerCase()) ||
        t.id.toLowerCase().includes(themeSearch.toLowerCase())
    );
  }, [availableThemes, themeSearch]);

  const handleAuth = async () => {
    if (user) {
      await signOut();
      setShowProfileMenu(false);
    } else {
      await signIn("google");
    }
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newWorkspaceName.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }

    if (workspaces.some((w) => w.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Workspace already exists");
      return;
    }

    addWorkspace(trimmed, selectedIcon);
    onWorkspaceChange(trimmed);
    setNewWorkspaceName("");
    setSelectedIcon("fi fi-sr-home");
    setError("");
    setShowAddModal(false);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            ref={addModalRef}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#0d0d1a]/95 border border-white/[0.09] rounded-2xl backdrop-blur-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50"
          >
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">New Workspace</span>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <i className={`${ICONS.close} text-[10px]`} />
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Workspace Name..."
                  value={newWorkspaceName}
                  onChange={(e) => {
                    setNewWorkspaceName(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-brand-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none transition-all"
                  autoFocus
                />
                {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
              </div>

              <div>
                <span className="text-[9px] font-bold text-white/35 uppercase tracking-wider block mb-2">Select Icon</span>
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto pr-1">
                  {AVAILABLE_ICONS.map((icon) => {
                    const isIconSelected = selectedIcon === icon.class;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setSelectedIcon(icon.class)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all ${
                          isIconSelected
                            ? "bg-brand-500 text-white shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.4)]"
                            : "bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        <i className={icon.class} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white text-xs font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-all shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.25)]"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {showProfileMenu && user && (
          <motion.div
            ref={profileMenuRef}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full right-0 mb-4 w-48 bg-[#0d0d1a]/95 border border-white/[0.09] rounded-2xl backdrop-blur-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 flex flex-col gap-0.5"
          >
            <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
              <p className="text-xs font-semibold text-white truncate">
                {user.name || user.email}
              </p>
              <p className="text-[10px] text-white/40 truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => {
                onSettingsOpen?.();
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-white/[0.04] rounded-lg transition-colors flex items-center gap-2"
            >
              <i className="fi fi-sr-settings" />
              Settings
            </button>
            <button
              onClick={handleAuth}
              className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/[0.04] rounded-lg transition-colors flex items-center gap-2"
            >
              <i className="fi fi-sr-sign-out-alt" />
              Sign out
            </button>
          </motion.div>
        )}

        {showThemeMenu && (
          <motion.div
            ref={themeMenuRef}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full right-12 mb-4 w-64 bg-[#0d0d1a]/95 border border-white/[0.09] rounded-2xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 flex flex-col overflow-hidden"
          >
            <div className="p-3 border-b border-white/[0.08] bg-black/20">
              <div className="relative flex items-center">
                <i className="fi fi-sr-search absolute left-3 text-white/40 text-xs" />
                <input
                  type="text"
                  placeholder="Theme..."
                  value={themeSearch}
                  onChange={(e) => setThemeSearch(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-brand-500/50 transition-colors"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="p-2 overflow-y-auto max-h-[300px] flex flex-col gap-0.5 custom-scrollbar">
              {filteredThemes.map((t) => {
                const colors = THEME_COLORS[t.id] || THEME_COLORS["default"];
                const isSelected = theme === t.id;
                
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors group ${
                      isSelected
                        ? "bg-brand-500/15 text-brand-400 font-semibold"
                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && <i className="fi fi-sr-check text-[10px]" />}
                      <span className={isSelected ? "" : "group-hover:translate-x-1 transition-transform"}>
                        {t.name}
                      </span>
                    </div>
                    
                    {/* Theme Palette Dots */}
                    <div className="flex items-center gap-[2px] bg-white/5 rounded-full p-1 border border-white/5 group-hover:border-white/10 transition-colors">
                      <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: colors?.bg || "#000" }} title="Background" />
                      <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: colors?.accent || "#000" }} title="Accent" />
                      <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: colors?.text || "#fff" }} title="Text" />
                    </div>
                  </button>
                );
              })}
              
              {filteredThemes.length === 0 && (
                <div className="p-4 text-center text-xs text-white/40">
                  No themes found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="group flex items-center gap-1 p-1.5 bg-[#0d0d14]/85 border border-white/[0.09] rounded-full backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        {workspaces.map((ws) => {
          const isActive = activeWorkspace === ws.name;
          return (
            <motion.button
              key={ws.name}
              layout
              onClick={() => onWorkspaceChange(ws.name)}
              whileTap={pressAnimation}
              title={ws.name}
              className={`relative flex items-center gap-2 h-9 rounded-full px-2.5 transition-all duration-300 ease-in-out overflow-hidden z-10 ${
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navbarActiveBg"
                  className="absolute inset-0 bg-brand-500 shadow-md shadow-[var(--accent-shadow)] z-[-1] rounded-full"
                  transition={SPRING_BOUNCE}
                />
              )}
              <i className={`${ws.iconClass} text-sm flex items-center flex-shrink-0`} />
              <span className="text-xs font-medium whitespace-nowrap overflow-hidden max-w-[120px] opacity-100 transition-all duration-300 ease-in-out">
                {ws.name}
              </span>
            </motion.button>
          );
        })}




        <motion.div
          layout
          className="w-px h-5 bg-white/[0.09] mx-0.5 flex-shrink-0"
        />

        <motion.button
          layout
          onClick={() => {
            if (showThemeMenu) {
              setShowThemeMenu(false);
            } else {
              setShowThemeMenu(true);
              setShowAddModal(false);
              setShowProfileMenu(false);
            }
          }}
          whileTap={pressAnimation}
          title="Theme Palette"
          className="flex items-center justify-center w-9 h-9 rounded-full text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-300 ease-in-out"
        >
          <i className="fi fi-sr-palette text-sm" />
        </motion.button>

        <motion.div
          layout
          className="w-px h-5 bg-white/[0.09] mx-0.5 flex-shrink-0"
        />

        <motion.button
          layout
          onClick={() => {
            if (user) {
              if (showProfileMenu) {
                setShowProfileMenu(false);
              } else {
                setShowProfileMenu(true);
                setShowThemeMenu(false);
                setShowAddModal(false);
              }
            } else {
              handleAuth();
            }
          }}
          whileTap={pressAnimation}
          title={user ? "Profile" : "Sign In"}
          className={`flex items-center gap-2 h-9 rounded-full transition-all duration-300 ease-in-out overflow-hidden ${
            user ? "px-1.5" : "px-2.5 text-white/40 hover:text-white hover:bg-white/[0.08]"
          }`}
        >
          {user ? (
            <Image 
              src={user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.email}
              alt="Profile"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full border border-white/20"
              referrerPolicy="no-referrer"
              unoptimized
            />
          ) : (
            <i className="fi fi-sr-user flex items-center text-sm flex-shrink-0" />
          )}
          <span className="text-xs font-medium whitespace-nowrap overflow-hidden max-w-[60px] opacity-100 transition-all duration-300 ease-in-out">
            {user ? "Profile" : "Sign In"}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
