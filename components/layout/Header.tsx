import { WorkspaceType } from "./Sidebar";

interface HeaderProps {
  activeWorkspace: WorkspaceType;
}

export default function Header({ activeWorkspace }: HeaderProps) {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0d0d14]/80 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-xl font-bold tracking-tight text-white uppercase">{activeWorkspace}</h1>
      
      {/* Daily Progress Bar */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Today</span>
        <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }} />
        </div>
        <span className="text-xs font-mono text-white/60">45%</span>
      </div>
    </header>
  );
}
