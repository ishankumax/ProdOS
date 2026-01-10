"use client";

import { useState } from "react";
import Sidebar, { WorkspaceType } from "./Sidebar";
import Header from "./Header";

interface ShellProps {
  children: React.ReactNode;
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

export default function Shell({ children, activeWorkspace, onWorkspaceChange }: ShellProps) {
  return (
    <div className="flex h-screen bg-[#0d0d14] text-white overflow-hidden">
      {/* 1. Left Sidebar (Workspace Switcher) */}
      <Sidebar activeWorkspace={activeWorkspace} onWorkspaceChange={onWorkspaceChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* 2. Header (Shared) */}
        <Header activeWorkspace={activeWorkspace} />

        {/* Workspace Content Layer */}
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>

        {/* 3. Floating Bottom-Right Control */}
        <div className="absolute bottom-8 right-8">
          <button className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-md">
            {activeWorkspace === "Financial Dashboard" ? (
              <span className="text-xl">🧮</span> // Calculator
            ) : (
              <span className="text-xl">⏱️</span> // Pomodoro Timer
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
