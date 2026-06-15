"use client";

import React, { useState } from "react";
import { useEditMode } from "@/providers/edit-mode-provider";
import { GoalHierarchyNode } from "@/features/goals/queries/getGoalsHierarchy";
import { Domain } from "@/types/domain";
import { cn } from "@/lib/utils";

interface LeftColumnProps {
  goals: GoalHierarchyNode[];
  domains: Domain[];
  onRefresh?: () => void;
}

export default function LeftColumn({ goals, domains, onRefresh }: LeftColumnProps) {
  const { isEditMode } = useEditMode();
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});

  const toggleGoalExpand = (id: string) => {
    setExpandedGoals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Dynamic domain contributions based on filtered goals
  const totalGoalsCount = goals.length;
  const domainContributions = domains
    .map((d) => {
      const count = goals.filter((g) => g.domainId === d.id).length;
      const percentage = totalGoalsCount > 0 ? Math.round((count / totalGoalsCount) * 100) : 0;
      return {
        ...d,
        count,
        percentage,
      };
    })
    .filter((d) => d.count > 0);

  // If the percentages don't add up to 100 exactly due to rounding, adjust the largest one
  const totalPercentage = domainContributions.reduce((sum, d) => sum + d.percentage, 0);
  if (totalPercentage > 0 && totalPercentage !== 100 && domainContributions.length > 0) {
    const diff = 100 - totalPercentage;
    let maxIdx = 0;
    for (let i = 1; i < domainContributions.length; i++) {
      if (domainContributions[i].percentage > domainContributions[maxIdx].percentage) {
        maxIdx = i;
      }
    }
    domainContributions[maxIdx].percentage += diff;
  }

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
          {domainContributions.length === 0 ? (
            <div className="text-center py-4 text-white/30 text-xs font-mono">
              No active goals to distribute.
            </div>
          ) : (
            <>
              <div>
                <div className="flex justify-between text-xs font-mono text-white/60 mb-1.5">
                  <span>Overall Impact</span>
                  <span>100%</span>
                </div>
                {/* Horizontal Distribution Stack Bar */}
                <div className="w-full h-3 rounded bg-white/5 flex overflow-hidden">
                  {domainContributions.map((d) => (
                    <div
                      key={d.id}
                      className="h-full hover:opacity-85 cursor-help transition-all duration-300"
                      style={{ width: `${d.percentage}%`, backgroundColor: d.colorHex }}
                      title={`${d.name}: ${d.percentage}% (${d.count} goal${d.count > 1 ? "s" : ""})`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center font-mono text-[9px] uppercase tracking-wider font-bold">
                {domainContributions.map((d) => (
                  <div
                    key={d.id}
                    className="border border-white/5 rounded px-2 py-1 flex items-center gap-1.5"
                    style={{ backgroundColor: `${d.colorHex}10`, color: d.colorHex }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.colorHex }} />
                    {d.name.slice(0, 3)}: {d.percentage}%
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
