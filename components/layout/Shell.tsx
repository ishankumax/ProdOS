"use client";

import BottomNavbar, { WorkspaceType } from "./BottomNavbar";
import Header from "./Header";
import GoalsRail from "./GoalsRail";
import CompletedDrawer from "./CompletedDrawer";
import { useEditMode } from "@/contexts/EditModeContext";

interface ShellProps {
  children: React.ReactNode;
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

export default function Shell({ children, activeWorkspace, onWorkspaceChange }: ShellProps) {
  const { isEditing, toggleEdit } = useEditMode();

  return (
    <div className="flex h-screen bg-[#0d0d14] text-white overflow-hidden relative">
      {/* Edit mode top banner */}
      {isEditing && (
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-2 bg-blue-500/10 border-b border-blue-500/20 backdrop-blur-sm pointer-events-none">
          <i className="fi fi-sr-pencil text-blue-400 text-xs flex items-center"></i>
          <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">
            Edit Mode — Click any <span className="text-white/70 normal-case font-normal">+ Add</span> button to add content
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* 1. Header (Shared) */}
        <Header activeWorkspace={activeWorkspace} />

        {/* Workspace Content Layer */}
        <div className={`flex-1 flex overflow-hidden relative pb-24 transition-all duration-300 ${isEditing ? "pt-9" : ""}`}>
          <GoalsRail />
          <CompletedDrawer />
          
          <main className="flex-1 overflow-auto p-8 relative">
            {children}
          </main>
        </div>

        {/* 2. Floating Bottom Navbar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
          <BottomNavbar activeWorkspace={activeWorkspace} onWorkspaceChange={onWorkspaceChange} />
        </div>

        {/* 3. Floating Bottom-Right Controls */}
        <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Edit Mode Toggle */}
          <button
            onClick={toggleEdit}
            title={isEditing ? "Exit Edit Mode" : "Edit Mode"}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border backdrop-blur-md ${
              isEditing
                ? "bg-blue-500 border-blue-400 text-white shadow-blue-500/40 scale-110"
                : "bg-white/8 border-white/15 text-white/60 hover:text-white hover:bg-white/15 hover:border-white/30"
            }`}
          >
            <i className={`${isEditing ? "fi fi-sr-check" : "fi fi-sr-pencil"} text-sm flex items-center`}></i>
          </button>

          {/* Context Action Button (calculator / timer) */}
          <button
            className="w-11 h-11 bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-md text-white/60 hover:text-white"
            title={activeWorkspace === "Financial Dashboard" ? "Calculator" : "Pomodoro Timer"}
          >
            {activeWorkspace === "Financial Dashboard" ? (
              <i className="fi fi-sr-calculator text-sm text-inherit flex items-center"></i>
            ) : (
              <i className="fi fi-sr-clock text-sm text-inherit flex items-center"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
