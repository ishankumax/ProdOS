"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  userEmail?: string;
  children: React.ReactNode;
}

export default function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex h-dvh bg-surface overflow-hidden relative">
      {/* --- Unique Animated Toggle Buttons --- */}
      {/* Navigation Toggle (Left) */}
      <div className={cn(
        "fixed top-6 z-50 transition-all duration-300",
        leftOpen ? "left-[190px]" : "left-6"
      )}>
        <button
          onClick={() => setLeftOpen(!leftOpen)}
          className="group flex flex-col gap-1.5 p-2 transition-all hover:opacity-80 focus:outline-none bg-surface/40 backdrop-blur-sm rounded-lg"
          title={leftOpen ? "Collapse Navigation" : "Expand Navigation"}
        >
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", leftOpen ? "w-6" : "w-4")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", leftOpen ? "w-4" : "w-6")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", leftOpen ? "w-2" : "w-5")} />
        </button>
      </div>

      {/* Info Toggle (Right) */}
      <div className={cn(
        "fixed top-6 z-50 transition-all duration-300 hidden xl:block",
        rightOpen ? "right-[208px]" : "right-6"
      )}>
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="group flex flex-col items-start gap-1.5 p-2 transition-all hover:opacity-80 focus:outline-none bg-surface/40 backdrop-blur-sm rounded-lg"
          title={rightOpen ? "Collapse Panel" : "Expand Panel"}
        >
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-4" : "w-6")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-6" : "w-4")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-5" : "w-2")} />
        </button>
      </div>






      {/* 1. Left Sidebar */}
      <aside 
        className={cn(
          "transition-all duration-300 ease-in-out border-r border-white/5 bg-surface z-40",
          leftOpen ? "w-[240px] opacity-100" : "w-0 opacity-0 overflow-hidden border-none"
        )}
      >
        <div className="w-[240px] h-full">
           <Sidebar userEmail={userEmail} />
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
        {/* Mobile Header (Only visible when sidebar is closed or on small screens) */}
        {!leftOpen && (
           <div className="lg:hidden absolute top-4 left-4 z-50">
             <button onClick={() => setLeftOpen(true)} className="p-2 text-white/50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
           </div>
        )}
        
        {children}
      </main>

      {/* 3. Right Panel */}
      <aside 
        className={cn(
          "transition-all duration-300 ease-in-out border-l border-white/5 bg-surface z-40 hidden xl:block",
          rightOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 overflow-hidden border-none"
        )}
      >
        <div className="w-[260px] h-full">
           <RightPanel />
        </div>
      </aside>
    </div>
  );
}
