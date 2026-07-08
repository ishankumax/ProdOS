"use client";

export type WorkspaceType = "Personal Life" | "Skill Check" | "InTheBox" | "Financial Dashboard";

interface BottomNavbarProps {
  activeWorkspace: WorkspaceType;
  onWorkspaceChange: (w: WorkspaceType) => void;
}

const WORKSPACES: { name: WorkspaceType; iconClass: string }[] = [
  { name: "Personal Life", iconClass: "fi fi-sr-user" },
  { name: "Skill Check", iconClass: "fi fi-sr-laptop" },
  { name: "Financial Dashboard", iconClass: "fi fi-sr-chart-histogram" },
  { name: "InTheBox", iconClass: "fi fi-sr-box" },
];

export default function BottomNavbar({ activeWorkspace, onWorkspaceChange }: BottomNavbarProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#0d0d14]/80 border border-white/10 rounded-full backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 pointer-events-auto">
      {WORKSPACES.map((ws) => {
        const isActive = activeWorkspace === ws.name;
        return (
          <button
            key={ws.name}
            onClick={() => onWorkspaceChange(ws.name)}
            title={ws.name}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative group ${
              isActive
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <i className={`${ws.iconClass} text-sm flex items-center`}></i>
            
            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#161622] border border-white/10 text-white text-[10px] rounded font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-xl">
              {ws.name}
            </span>
          </button>
        );
      })}
      
      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <button 
        title="New Workspace"
        className="w-10 h-10 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 hover:border-white/40 transition-all duration-300 relative group"
      >
        <i className="fi fi-sr-plus flex items-center text-xs"></i>
        
        {/* Tooltip */}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#161622] border border-white/10 text-white text-[10px] rounded font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-xl">
          New Workspace
        </span>
      </button>
    </div>
  );
}
