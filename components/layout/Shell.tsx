"use client";

import BottomNavbar, { WorkspaceType } from "./BottomNavbar";
import Header from "./Header";
import GoalsRail from "./GoalsRail";
import CompletedDrawer from "./CompletedDrawer";

interface ShellProps {
  children: React.ReactNode;
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

export default function Shell({ children, activeWorkspace, onWorkspaceChange }: ShellProps) {
  return (
    <div className="flex h-screen bg-[#0d0d14] text-white overflow-hidden relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* 1. Header (Shared) */}
        <Header activeWorkspace={activeWorkspace} />

        {/* Workspace Content Layer */}
        <div className="flex-1 flex overflow-hidden relative pb-20">
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

        {/* 3. Floating Bottom-Right Control */}
        <div className="absolute bottom-8 right-8 z-40">
          <button className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-md">
            {activeWorkspace === "Financial Dashboard" ? (
              <i className="fi fi-sr-calculator text-lg text-white"></i>
            ) : (
              <i className="fi fi-sr-clock text-lg text-white"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
