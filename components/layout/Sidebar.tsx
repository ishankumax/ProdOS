"use client";

import { useState } from "react";

export type WorkspaceType = "Personal Life" | "Skill Check" | "InTheBox" | "Financial Dashboard";

interface SidebarProps {
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

const WORKSPACES: { name: WorkspaceType; icon: string }[] = [
  { name: "Personal Life", icon: "🌱" },
  { name: "Skill Check", icon: "💻" },
  { name: "Financial Dashboard", icon: "📈" },
  { name: "InTheBox", icon: "📦" },
];

export default function Sidebar({ activeWorkspace, onWorkspaceChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-[#0d0d14] border-r border-white/5 h-full flex flex-col pt-6 transition-all duration-300 relative`}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white z-50 text-xs transition-colors"
      >
        {isCollapsed ? "▶" : "◀"}
      </button>

      <div className={`px-4 mb-8 ${isCollapsed ? "items-center flex flex-col" : ""}`}>
        {!isCollapsed && (
          <h2 className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4 px-2">Workspaces</h2>
        )}
        <nav className={`space-y-2 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          {WORKSPACES.map((ws) => {
            return (
              <button
                key={ws.name}
                onClick={() => onWorkspaceChange(ws.name)}
                title={ws.name}
                className={`text-left rounded-md text-sm transition-all flex items-center ${
                  isCollapsed ? "justify-center w-10 h-10 p-0" : "w-full px-3 py-2 gap-3"
                } ${
                  activeWorkspace === ws.name
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">{ws.icon}</span>
                {!isCollapsed && <span>{ws.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className={`mt-auto mb-6 ${isCollapsed ? "px-2 flex justify-center" : "px-6"}`}>
        <button 
          title="New Workspace"
          className={`flex items-center justify-center border border-white/10 rounded-md text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors ${
            isCollapsed ? "w-10 h-10 p-0" : "w-full gap-2 px-3 py-2"
          }`}
        >
          <span>+</span> {!isCollapsed && "New Workspace"}
        </button>
      </div>
    </aside>
  );
}
