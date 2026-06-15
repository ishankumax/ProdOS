"use client";

import React, { useState } from "react";
import { useEditMode } from "@/providers/edit-mode-provider";
import { Domain } from "@/types/domain";
import { KpiDefinition, KpiLog } from "@/types/kpi";
import { defineKpi } from "@/features/kpis/actions/defineKpi";
import { logKpiValue } from "@/features/kpis/actions/logKpiValue";
import { cn } from "@/lib/utils";

interface RightColumnProps {
  domains: Domain[];
  kpiDefinitions: KpiDefinition[];
  kpiLogs: KpiLog[];
  onRefresh?: () => void;
}

export default function RightColumn({ domains, kpiDefinitions, kpiLogs, onRefresh }: RightColumnProps) {
  const { isEditMode } = useEditMode();
  const [newKpiName, setNewKpiName] = useState("");
  const [newKpiUnit, setNewKpiUnit] = useState("");
  const [newKpiType, setNewKpiType] = useState<"input" | "output" | "outcome">("input");
  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // For quick log logging
  const [logValueKpiId, setLogValueKpiId] = useState("");
  const [logValue, setLogValue] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  const handleDefineKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiName.trim() || !newKpiUnit.trim() || !selectedDomainId) return;

    setIsAdding(true);
    const response = await defineKpi({
      domainId: selectedDomainId,
      name: newKpiName.trim(),
      metricType: newKpiType,
      unit: newKpiUnit.trim(),
    });

    setIsAdding(false);
    if (response.success) {
      setNewKpiName("");
      setNewKpiUnit("");
      setSelectedDomainId("");
      if (onRefresh) onRefresh();
    } else {
      alert(response.error?.message || "Failed to define KPI");
    }
  };

  const handleLogKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logValueKpiId || !logValue.trim()) return;

    setIsLogging(true);
    const response = await logKpiValue({
      kpiDefinitionId: logValueKpiId,
      value: Number(logValue),
      logDate: todayStr,
    });

    setIsLogging(false);
    if (response.success) {
      setLogValue("");
      setLogValueKpiId("");
      if (onRefresh) onRefresh();
    } else {
      alert(response.error?.message || "Failed to log KPI value");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Domain Performance Card */}
      <div className={cn(
        "prod-card transition-all duration-300",
        isEditMode ? "border-dashed border-white/20" : "border-white/10"
      )}>
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            DOMAIN PERFORMANCE
          </h2>
          <span className="prod-badge">OS CARDS</span>
        </div>

        {domains.length === 0 ? (
          <div className="text-center py-6 text-white/30 text-xs font-mono">
            No domains configured.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {domains.map((domain) => {
              // Count total KPIs defined in this domain
              const domainKpis = kpiDefinitions.filter((k) => k.domainId === domain.id);

              return (
                <div
                  key={domain.id}
                  className="border border-white/5 rounded p-3 bg-white/[0.01] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: domain.colorHex }}
                      />
                      <span className="text-xs font-bold text-white tracking-tight truncate">
                        {domain.name}
                      </span>
                    </div>
                    <p className="text-[9px] font-mono text-white/40 mt-1 uppercase tracking-wider">
                      {domain.priority} PRIORITY
                    </p>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-white/50">
                    <span>KPIs: {domainKpis.length}</span>
                    <span className="text-brand-400 capitalize">{domain.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Define KPI Form in Edit Mode */}
        {isEditMode && domains.length > 0 && (
          <form onSubmit={handleDefineKpi} className="mt-4 pt-3 border-t border-white/5 space-y-2">
            <h3 className="font-mono text-[9px] font-bold text-white/30 uppercase tracking-widest">
              [+] DEFINE CUSTOM KPI METRIC
            </h3>
            <div className="flex flex-col gap-2">
              <select
                value={selectedDomainId}
                onChange={(e) => setSelectedDomainId(e.target.value)}
                disabled={isAdding}
                className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
              >
                <option value="" className="bg-surface-raised">Select Domain...</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id} className="bg-surface-raised">{d.name}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Metric name (e.g. Sales)"
                  value={newKpiName}
                  onChange={(e) => setNewKpiName(e.target.value)}
                  disabled={isAdding}
                  className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. USD)"
                  value={newKpiUnit}
                  onChange={(e) => setNewKpiUnit(e.target.value)}
                  disabled={isAdding}
                  className="w-full rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={newKpiType}
                  onChange={(e: any) => setNewKpiType(e.target.value)}
                  disabled={isAdding}
                  className="flex-1 rounded-[2px] bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[10px] text-white outline-none focus:border-brand-500/30 transition-all"
                >
                  <option value="input" className="bg-surface-raised">Input Metric</option>
                  <option value="output" className="bg-surface-raised">Output Metric</option>
                  <option value="outcome" className="bg-surface-raised">Outcome Metric</option>
                </select>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-3 py-1 bg-brand-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-[2px] hover:bg-brand-400 active:scale-95"
                >
                  DEFINE
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Growth Engine Card */}
      <div className="prod-card border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            GROWTH TELEMETRY ENGINE
          </h2>
          <span className="prod-badge">METRICS</span>
        </div>

        {kpiDefinitions.length === 0 ? (
          <div className="text-center py-6 text-white/30 text-xs font-mono">
            No KPI metrics defined. Define one in Edit Mode.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Log Quick KPI Value Form */}
            <form onSubmit={handleLogKpi} className="flex gap-2 mb-3 bg-white/[0.02] border border-white/5 p-2 rounded">
              <select
                value={logValueKpiId}
                onChange={(e) => setLogValueKpiId(e.target.value)}
                disabled={isLogging}
                className="flex-1 rounded-[2px] bg-transparent border border-white/10 px-2 py-1 font-mono text-[9px] text-white outline-none focus:border-brand-500/30 transition-all"
              >
                <option value="" className="bg-surface-raised">Log value for...</option>
                {kpiDefinitions.map((k) => (
                  <option key={k.id} value={k.id} className="bg-surface-raised">{k.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Value"
                value={logValue}
                onChange={(e) => setLogValue(e.target.value)}
                disabled={isLogging}
                className="w-16 rounded-[2px] bg-transparent border border-white/10 px-2 py-1 font-mono text-[9px] text-white outline-none focus:border-brand-500/30 transition-all"
              />
              <button
                type="submit"
                disabled={isLogging}
                className="px-2 py-1 bg-brand-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-[2px] hover:bg-brand-400"
              >
                LOG
              </button>
            </form>

            {/* List defined KPIs */}
            {["input", "output", "outcome"].map((type) => {
              const typedKpis = kpiDefinitions.filter((k) => k.metricType === type);
              if (typedKpis.length === 0) return null;

              return (
                <div key={type} className="space-y-1.5">
                  <h3 className="font-mono text-[9px] font-bold text-white/30 uppercase tracking-widest">
                    {type} METRICS
                  </h3>
                  {typedKpis.map((k) => {
                    // Get latest log value if any
                    const logs = kpiLogs.filter((l) => l.kpiDefinitionId === k.id);
                    const latestLog = logs[0]; // ordered desc
                    return (
                      <div key={k.id} className="flex justify-between items-center text-xs font-mono border-b border-white/[0.03] pb-1.5">
                        <span className="text-white/80">{k.name}</span>
                        <span className="text-brand-400">
                          {latestLog ? `${latestLog.value} ${k.unit}` : `0 ${k.unit}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Intelligence Hub / Feed */}
      <div className="prod-card border-white/10">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white/50">
            INTELLIGENCE HUB
          </h2>
          <span className="prod-badge">ADVISORY</span>
        </div>

        <div className="space-y-3 font-mono text-[10px] tracking-tight">
          <div className="border-l-2 border-emerald-500 pl-2 py-0.5">
            <span className="text-emerald-400 font-bold">✓ GOOD GOING:</span>
            <p className="text-white/60 mt-0.5">Daily task lists are kept clean. Velocity is holding optimal status.</p>
          </div>

          <div className="border-l-2 border-amber-500 pl-2 py-0.5">
            <span className="text-amber-400 font-bold">⚠ ATTENTION REQUIRED:</span>
            <p className="text-white/60 mt-0.5">No yearly strategy goals have breached expected deadlines.</p>
          </div>

          <div className="border-l-2 border-brand-500 pl-2 py-0.5">
            <span className="text-brand-400 font-bold">» PREDICTIVE ADVISORY:</span>
            <p className="text-white/60 mt-0.5">Add yearly metrics to domains to enable deep growth telemetry calculations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
