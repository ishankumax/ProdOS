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
  const [leftOpen, setLeftOpen] = useState(false); // Closed by default on mobile
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <div className="flex h-dvh bg-surface overflow-hidden relative">
      {/* --- Responsive Toggle Buttons --- */}
      {/* Navigation Toggle (Left) */}
      <div className={cn(
        "fixed top-6 z-50 transition-all duration-300",
        leftOpen ? "left-[200px]" : "left-6"
      )}>
        <button
          onClick={() => setLeftOpen(!leftOpen)}
          className="group flex flex-col gap-1.5 p-2 transition-all hover:opacity-80 focus:outline-none bg-surface/40 backdrop-blur-sm rounded-lg border border-white/5"
          title={leftOpen ? "Collapse Navigation" : "Expand Navigation"}
        >
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", leftOpen ? "w-6" : "w-4")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", leftOpen ? "w-4" : "w-6")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", leftOpen ? "w-2" : "w-5")} />
        </button>
      </div>

      {/* Info Toggle (Right) - Visible on XL only */}
      <div className={cn(
        "fixed top-6 z-50 transition-all duration-300 hidden xl:block",
        rightOpen ? "right-[208px]" : "right-6"
      )}>
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="group flex flex-col items-start gap-1.5 p-2 transition-all hover:opacity-80 focus:outline-none bg-surface/40 backdrop-blur-sm rounded-lg border border-white/5"
          title={rightOpen ? "Collapse Panel" : "Expand Panel"}
        >
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-4" : "w-6")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-6" : "w-4")} />
          <div className={cn("h-0.5 bg-brand-400 transition-all duration-300", rightOpen ? "w-5" : "w-2")} />
        </button>
      </div>

      {/* 1. Left Sidebar - Overlay on mobile, side-by-side on large */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 lg:relative transition-all duration-300 ease-in-out border-r border-white/5 bg-surface z-40",
          leftOpen ? "w-[240px] opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full lg:translate-x-0 overflow-hidden border-none"
        )}
      >
        <div className="w-[240px] h-full">
           <Sidebar userEmail={userEmail} />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {leftOpen && (
        <div 
          onClick={() => setLeftOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
        />
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative pt-20 lg:pt-0">
        {children}
      </main>

      {/* 3. Right Panel - Collapsible side-by-side on XL */}
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
