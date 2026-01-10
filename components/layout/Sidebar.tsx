"use client";

import { useState } from "react";

export type WorkspaceType = "Personal Life" | "Skill Check" | "InTheBox" | "Financial Dashboard";

interface SidebarProps {
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

const WORKSPACES: WorkspaceType[] = [
  "Personal Life",
  "Skill Check",
  "Financial Dashboard",
  "InTheBox",
];

export default function Sidebar({ activeWorkspace, onWorkspaceChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0d0d14] border-r border-white/5 h-full flex flex-col pt-6">
      <div className="px-6 mb-8">
        <h2 className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4">Workspaces</h2>
        <nav className="space-y-1">
          {WORKSPACES.map((ws) => (
            <button
              key={ws}
              onClick={() => onWorkspaceChange(ws)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeWorkspace === ws
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {ws}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="px-6 mt-auto mb-6">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-white/10 rounded-md text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
          <span>+</span> New Workspace
        </button>
      </div>
    </aside>
  );
}
