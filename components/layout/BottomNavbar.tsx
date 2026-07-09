"use client";

import { ICONS, WORKSPACE_ICONS } from "@/lib/theme";

export type WorkspaceType = "Personal Life" | "Skill Check" | "InTheBox" | "Financial Dashboard";

interface BottomNavbarProps {
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

const WORKSPACES: { name: WorkspaceType; iconClass: string }[] = [
  { name: "Personal Life",       iconClass: WORKSPACE_ICONS["Personal Life"]       },
  { name: "Skill Check",         iconClass: WORKSPACE_ICONS["Skill Check"]         },
  { name: "Financial Dashboard", iconClass: WORKSPACE_ICONS["Financial Dashboard"] },
  { name: "InTheBox",            iconClass: WORKSPACE_ICONS["InTheBox"]            },
];

export default function BottomNavbar({ activeWorkspace, onWorkspaceChange }: BottomNavbarProps) {
  return (
    <div className="group flex items-center gap-1 p-1.5 bg-[#0d0d14]/85 border border-white/[0.09] rounded-full backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300">
      {WORKSPACES.map((ws) => {
        const isActive = activeWorkspace === ws.name;
        return (
          <button
            key={ws.name}
            onClick={() => onWorkspaceChange(ws.name)}
            title={ws.name}
            className={`flex items-center gap-0 group-hover:gap-2 h-9 rounded-full px-2.5 transition-all duration-300 ease-in-out overflow-hidden ${
              isActive
                ? "bg-brand-500 text-white shadow-md shadow-[var(--accent-shadow)]"
                : "text-white/40 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            <i className={`${ws.iconClass} text-sm flex items-center flex-shrink-0`} />
            <span className="text-xs font-medium whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[120px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
              {ws.name}
            </span>
          </button>
        );
      })}

      {/* Divider */}
      <div className="w-px h-5 bg-white/[0.09] mx-0.5 flex-shrink-0" />

      {/* New Workspace */}
      <button
        title="New Workspace"
        className="flex items-center gap-0 group-hover:gap-2 h-9 rounded-full px-2.5 border border-dashed border-white/20 text-white/30 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 ease-in-out overflow-hidden"
      >
        <i className={`${ICONS.add} flex items-center text-xs flex-shrink-0`} />
        <span className="text-xs font-medium whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[48px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
          New
        </span>
      </button>
    </div>
  );
}
