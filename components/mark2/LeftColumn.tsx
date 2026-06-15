"use client";

import React, { useState } from "react";
import { useEditMode } from "@/providers/edit-mode-provider";
import { GoalHierarchyNode } from "@/features/goals/queries/getGoalsHierarchy";
import { cn } from "@/lib/utils";

interface LeftColumnProps {
  goals: GoalHierarchyNode[];
  onRefresh?: () => void;
}

export default function LeftColumn({ goals, onRefresh }: LeftColumnProps) {
  const { isEditMode } = useEditMode();
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});

  const toggleGoalExpand = (id: string) => {
    setExpandedGoals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Goal Command Center Card */}
      <div className={cn(
        "prod-card transition-all duration-300",
        isEditMode ? "border-dashed border-white/20" : "border-white/10"
      )}>
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            STRATEGY & ALIGNMENT
          </h2>
          <span className="prod-badge">GOAL COMMAND</span>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-xs font-mono">
            No active goals found.
            {isEditMode && (
              <div className="mt-2 text-brand-400 cursor-pointer hover:underline">
                + Add Strategy Goal
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const isExpanded = expandedGoals[goal.id];
              // Determine status indicator color
              let forecastColor = "text-yellow-500 border-yellow-500/20 bg-yellow-500/5";
              if (goal.progress >= 70) {
                forecastColor = "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
              } else if (goal.progress < 40) {
                forecastColor = "text-rose-500 border-rose-500/20 bg-rose-500/5";
              }

              return (
                <div key={goal.id} className="border border-white/5 rounded p-3 bg-white/[0.01]">
                  {/* Goal Header */}
                  <div
                    onClick={() => toggleGoalExpand(goal.id)}
                    className="flex justify-between items-start cursor-pointer hover:opacity-80"
                  >
                    <div>
                      <h3 className="font-semibold text-sm text-white tracking-tight">{goal.title}</h3>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">
                        Yearly Target: {goal.yearlyTarget} {goal.unit === "custom" ? goal.customUnit : goal.unit}
                      </p>
                    </div>
                    <span className={cn("prod-badge shrink-0", forecastColor)}>
                      {goal.progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-brand-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>

                  {/* Expanded Monthly & Weekly Details */}
                  {isExpanded && goal.monthlyTargets.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-3 pl-2">
                      <h4 className="font-mono text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">
                        MONTHLY MILESTONES
                      </h4>
                      {goal.monthlyTargets.map((m) => (
                        <div key={m.id} className="pl-2 border-l border-white/10 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-mono text-white/70">
                              {new Date(m.month + "T00:00:00").toLocaleString("default", { month: "short", year: "numeric" })}
                            </span>
                            <span className="text-white/40 font-mono text-[10px]">
                              {m.targetValue} target | <span className="text-brand-400">{m.progress}%</span>
                            </span>
                          </div>

                          {/* Weekly Sub-list */}
                          {m.weeklyTargets.length > 0 && (
                            <div className="pl-3 space-y-1.5 border-l border-dashed border-white/5">
                              {m.weeklyTargets.map((w) => (
                                <div key={w.id} className="flex justify-between items-center text-[10px] font-mono text-white/50">
                                  <span>
                                    Wk of {new Date(w.weekStart + "T00:00:00").toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}
                                  </span>
                                  <span>
                                    {w.targetValue} ({w.progress}%)
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Contribution Breakdown Card */}
      <div className="prod-card border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            CONTRIBUTION BY DOMAIN
          </h2>
          <span className="prod-badge">DISTR</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-white/60 mb-1.5">
              <span>Overall Impact</span>
              <span>100%</span>
            </div>
            {/* Horizontal Distribution Stack Bar */}
            <div className="w-full h-3 rounded bg-white/5 flex overflow-hidden">
              <div className="bg-emerald-500 h-full hover:opacity-85 cursor-help" style={{ width: "45%" }} title="ReadNovaStory: 45%" />
              <div className="bg-indigo-500 h-full hover:opacity-85 cursor-help" style={{ width: "30%" }} title="ITB Tech: 30%" />
              <div className="bg-amber-500 h-full hover:opacity-85 cursor-help" style={{ width: "25%" }} title="Investments: 25%" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[9px] uppercase tracking-wider font-bold text-center">
            <div className="border border-white/5 rounded p-1 bg-emerald-500/5 text-emerald-400">
              RNS: 45%
            </div>
            <div className="border border-white/5 rounded p-1 bg-indigo-500/5 text-indigo-400">
              ITB: 30%
            </div>
            <div className="border border-white/5 rounded p-1 bg-amber-500/5 text-amber-400">
              INV: 25%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
