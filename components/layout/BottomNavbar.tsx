"use client";

import { useState } from "react";

export type WorkspaceType = "Personal Life" | "Skill Check" | "InTheBox" | "Financial Dashboard";

interface BottomNavbarProps {
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

const WORKSPACES: { name: WorkspaceType; iconClass: string }[] = [
  { name: "Personal Life", iconClass: "fi fi-sr-home" },
  { name: "Skill Check", iconClass: "fi fi-sr-laptop" },
  { name: "Financial Dashboard", iconClass: "fi fi-sr-chart-histogram" },
  { name: "InTheBox", iconClass: "fi fi-sr-box" },
];

export default function BottomNavbar({ activeWorkspace, onWorkspaceChange }: BottomNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Collapsed: all icons visible, icon-only pill */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "opacity-0 scale-90 pointer-events-none absolute" : "opacity-100 scale-100"
        }`}
      >
        <div className="flex items-center gap-1 px-2 py-2 bg-[#0d0d14]/80 border border-white/10 rounded-full backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer">
          {WORKSPACES.map((ws) => {
            const isActive = activeWorkspace === ws.name;
            return (
              <button
                key={ws.name}
                onClick={() => onWorkspaceChange(ws.name)}
                title={ws.name}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/40"
                    : "text-white/40 hover:text-white hover:bg-white/8"
                }`}
              >
                <i className={`${ws.iconClass} text-sm flex items-center`}></i>
              </button>
            );
          })}

          <div className="w-px h-5 bg-white/10 mx-0.5" />

          <button
            title="New Workspace"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-dashed border-white/20 text-white/30 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200"
          >
            <i className="fi fi-sr-plus flex items-center text-xs"></i>
          </button>
        </div>
      </div>

      {/* Expanded: icons + names */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out ${
          isExpanded
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 p-1.5 bg-[#0d0d14]/90 border border-white/10 rounded-2xl backdrop-blur-lg shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
          {WORKSPACES.map((ws) => {
            const isActive = activeWorkspace === ws.name;
            return (
              <button
                key={ws.name}
                onClick={() => onWorkspaceChange(ws.name)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-white/50 hover:text-white hover:bg-white/8"
                }`}
              >
                <i className={`${ws.iconClass} text-sm flex items-center`}></i>
                <span className="text-xs font-medium whitespace-nowrap">{ws.name}</span>
              </button>
            );
          })}

          <div className="w-px h-6 bg-white/10 mx-0.5" />

          <button
            title="New Workspace"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all duration-200 border border-dashed border-white/15 hover:border-white/30"
          >
            <i className="fi fi-sr-plus flex items-center text-xs"></i>
            <span className="text-xs font-medium whitespace-nowrap">New</span>
          </button>
        </div>
      </div>
    </div>
  );
}
