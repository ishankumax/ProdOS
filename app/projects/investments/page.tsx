"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import EditableText from "@/components/ui/EditableText";
import { cn } from "@/lib/utils";

interface InvestmentCategory {
  id: string;
  name: string;
  invested: number;
  currentValue: number;
  futureExpectation: number;
  notes: string;
}

const DEFAULT_CATEGORIES: InvestmentCategory[] = [
  {
    id: "rns",
    name: "RNS",
    invested: 10000,
    currentValue: 12500,
    futureExpectation: 30000,
    notes: "Seed round venture stake. Quarterly distributions expected.",
  },
  {
    id: "itb",
    name: "ITB",
    invested: 5000,
    currentValue: 4800,
    futureExpectation: 15000,
    notes: "InTheBox fund distribution. Subject to vesting cycles.",
  },
  {
    id: "inv",
    name: "INV",
    invested: 8000,
    currentValue: 9200,
    futureExpectation: 20000,
    notes: "Co-investment in software development studio.",
  },
  {
    id: "sip",
    name: "SIP",
    invested: 3000,
    currentValue: 3150,
    futureExpectation: 12000,
    notes: "Systematic index fund tracker. Auto-debited monthly.",
  },
  {
    id: "stocks",
    name: "Stocks",
    invested: 12000,
    currentValue: 14800,
    futureExpectation: 45000,
    notes: "S&P 500 equities & long-term growth stocks.",
  },
  {
    id: "crypto",
    name: "Crypto",
    invested: 4000,
    currentValue: 5200,
    futureExpectation: 25000,
    notes: "BTC and ETH hardware-wallet cold storage.",
  },
];

export default function InvestmentsPage() {
  const [categories, setCategories] = useState<InvestmentCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [notesText, setNotesText] = useState("");

  // Sync with client-side hydration & local storage
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem("prod_os_investments");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as InvestmentCategory[];
        if (parsed.length > 0) {
          setCategories(parsed);
          setSelectedId(parsed[0].id);
          setNotesText(parsed[0].notes || "");
          return;
        }
      } catch (e) {
        console.error("Failed to parse investments from storage:", e);
      }
    }
    setCategories(DEFAULT_CATEGORIES);
    setSelectedId(DEFAULT_CATEGORIES[0].id);
    setNotesText(DEFAULT_CATEGORIES[0].notes);
  }, []);

  // Sync local notes state when selected category changes
  useEffect(() => {
    const selected = categories.find((c) => c.id === selectedId);
    if (selected) {
      setNotesText(selected.notes || "");
    }
  }, [selectedId, categories]);

  if (!isClient || categories.length === 0) {
    return (
      <DashboardShell userEmail="demo@workspace.ai">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-12 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3 font-mono">
            <span className="w-6 h-6 rounded-full border border-brand-400 border-t-transparent animate-spin" />
            <span className="text-white/40 text-xs tracking-widest uppercase">Initializing Vault Protocol...</span>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const selectedCategory = categories.find((c) => c.id === selectedId) || categories[0];

  // Global calculations
  const totalInvested = categories.reduce((sum, c) => sum + Number(c.invested || 0), 0);
  const totalValue = categories.reduce((sum, c) => sum + Number(c.currentValue || 0), 0);
  const totalProfitLoss = totalValue - totalInvested;
  const netROI = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  const totalFutureExpectation = categories.reduce((sum, c) => sum + Number(c.futureExpectation || 0), 0);

  // Category specific calculations
  const catProfitLoss = Number(selectedCategory.currentValue || 0) - Number(selectedCategory.invested || 0);
  const catROI = Number(selectedCategory.invested || 0) > 0 ? (catProfitLoss / Number(selectedCategory.invested || 0)) * 100 : 0;

  const updateField = (field: keyof InvestmentCategory, value: any) => {
    const nextCategories = categories.map((cat) =>
      cat.id === selectedCategory.id ? { ...cat, [field]: value } : cat
    );
    setCategories(nextCategories);
    localStorage.setItem("prod_os_investments", JSON.stringify(nextCategories));
  };

  const addCategory = () => {
    const names = ["ALPHA", "BETA", "OMEGA", "DELTA", "GAMMA"];
    const randomName = `${names[Math.floor(Math.random() * names.length)]}-${Math.floor(Math.random() * 900 + 100)}`;
    const newCat: InvestmentCategory = {
      id: `custom-${Date.now()}`,
      name: randomName,
      invested: 0,
      currentValue: 0,
      futureExpectation: 0,
      notes: "Investment details.",
    };
    const next = [...categories, newCat];
    setCategories(next);
    setSelectedId(newCat.id);
    localStorage.setItem("prod_os_investments", JSON.stringify(next));
  };

  const deleteCategory = (id: string) => {
    if (categories.length <= 1) return;
    const next = categories.filter((c) => c.id !== id);
    setCategories(next);
    if (selectedId === id) {
      setSelectedId(next[0].id);
    }
    localStorage.setItem("prod_os_investments", JSON.stringify(next));
  };

  // Vertical chart calculations
  const maxChartVal = Math.max(
    selectedCategory.invested || 0,
    selectedCategory.currentValue || 0,
    selectedCategory.futureExpectation || 0,
    1
  );
  const investedPct = ((selectedCategory.invested || 0) / maxChartVal) * 100;
  const currentPct = ((selectedCategory.currentValue || 0) / maxChartVal) * 100;
  const futurePct = ((selectedCategory.futureExpectation || 0) / maxChartVal) * 100;

  return (
    <DashboardShell userEmail="demo@workspace.ai">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Investment OS
            </h1>
            <p className="text-sm text-white/30">Capital allocation and venture performance ledger.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shadow-[0_0_10px_rgba(235,94,40,0.5)]" />
            <span className="text-[10px] font-mono text-brand-400 uppercase tracking-widest font-bold">Ledger Connected</span>
          </div>
        </div>

        {/* Top: Category Tabs */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Ventures / Assets</p>
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/5">
            {categories.map((cat) => {
              const isActive = cat.id === selectedId;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedId(cat.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-mono transition-all cursor-pointer border",
                    isActive
                      ? "bg-brand-500/10 text-brand-400 border-brand-500/20 shadow-[0_0_15px_rgba(235,94,40,0.05)]"
                      : "bg-white/[0.01] text-white/40 border-white/5 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive ? (
                    <EditableText
                      value={cat.name}
                      onSave={async (val) => {
                        if (val.trim()) {
                          updateField("name", val.trim());
                        }
                      }}
                      className="font-bold tracking-tight"
                      inputClassName="bg-transparent text-brand-400 border-b border-brand-500 outline-none w-20 p-0 font-bold font-mono"
                    />
                  ) : (
                    <span className="font-semibold">{cat.name}</span>
                  )}

                  {categories.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(cat.id);
                      }}
                      className="text-[10px] text-white/20 hover:text-rose-400 ml-1 hover:scale-110 transition-all"
                      title={`Delete ${cat.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
            <button
              onClick={addCategory}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-brand-400 border border-brand-500/10 bg-brand-500/5 hover:bg-brand-500/10 transition-all font-mono"
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* Middle: Global Summary Cards */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Global Portfolio Summary</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Total Invested */}
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 hover:bg-white/[0.02] transition-colors">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Total Invested</span>
              <span className="text-xl font-bold font-mono text-white">
                ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            {/* Total Value */}
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 hover:bg-white/[0.02] transition-colors">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Current Value</span>
              <span className="text-xl font-bold font-mono text-white">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            {/* Profit/Loss */}
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 hover:bg-white/[0.02] transition-colors">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Total Profit/Loss</span>
              <span className={cn(
                "text-xl font-bold font-mono",
                totalProfitLoss >= 0 ? "text-emerald-400" : "text-rose-400"
              )}>
                {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            {/* Net ROI */}
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 hover:bg-white/[0.02] transition-colors">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Net ROI</span>
              <span className={cn(
                "text-xl font-bold font-mono",
                netROI >= 0 ? "text-emerald-400" : "text-rose-400"
              )}>
                {netROI >= 0 ? "+" : ""}{netROI.toFixed(2)}%
              </span>
            </div>
            {/* Future Expected */}
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 hover:bg-white/[0.02] transition-colors col-span-2 md:col-span-1">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Future Expected</span>
              <span className="text-xl font-bold font-mono text-brand-400">
                ${totalFutureExpectation.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Category Detail Grid (Inline values edit) */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            Venture Parameters: <span className="text-white font-mono">{selectedCategory.name}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Invested */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-colors">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Capital Invested</span>
              <div className="text-2xl font-bold font-mono text-white flex items-center">
                <EditableText
                  value={selectedCategory.invested}
                  type="number"
                  prefix="$"
                  onSave={async (val) => updateField("invested", parseFloat(val) || 0)}
                  className="text-2xl font-bold font-mono text-white hover:text-brand-400 transition-colors"
                  inputClassName="text-2xl font-bold font-mono text-white bg-white/10 border-b border-brand-500 w-32 p-0 outline-none"
                />
              </div>
            </div>
            {/* Current Value */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-colors">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Current Valuation</span>
              <div className="text-2xl font-bold font-mono text-white flex items-center">
                <EditableText
                  value={selectedCategory.currentValue}
                  type="number"
                  prefix="$"
                  onSave={async (val) => updateField("currentValue", parseFloat(val) || 0)}
                  className="text-2xl font-bold font-mono text-white hover:text-brand-400 transition-colors"
                  inputClassName="text-2xl font-bold font-mono text-white bg-white/10 border-b border-brand-500 w-32 p-0 outline-none"
                />
              </div>
            </div>
            {/* Future Expectation */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-colors">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Future Expectation</span>
              <div className="text-2xl font-bold font-mono text-white flex items-center">
                <EditableText
                  value={selectedCategory.futureExpectation}
                  type="number"
                  prefix="$"
                  onSave={async (val) => updateField("futureExpectation", parseFloat(val) || 0)}
                  className="text-2xl font-bold font-mono text-white hover:text-brand-400 transition-colors"
                  inputClassName="text-2xl font-bold font-mono text-white bg-white/10 border-b border-brand-500 w-32 p-0 outline-none"
                />
              </div>
            </div>
            {/* Profit/Loss */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-colors">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Net Profit / Loss</span>
              <span className={cn(
                "text-2xl font-bold font-mono block py-0.5",
                catProfitLoss >= 0 ? "text-emerald-400" : "text-rose-400"
              )}>
                {catProfitLoss >= 0 ? "+" : ""}${catProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {/* ROI */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-colors">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">ROI Percentage</span>
              <span className={cn(
                "text-2xl font-bold font-mono block py-0.5",
                catROI >= 0 ? "text-emerald-400" : "text-rose-400"
              )}>
                {catROI >= 0 ? "+" : ""}{catROI.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Notes & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notes column */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4 hover:border-white/10 transition-all">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">Notes: {selectedCategory.name}</h3>
              <span className="text-[9px] text-white/20 font-mono">Auto-saves on blur</span>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              onBlur={() => updateField("notes", notesText)}
              className="w-full h-[200px] bg-white/[0.02] border border-white/5 rounded-xl p-4 font-mono text-sm text-white/80 outline-none focus:border-brand-500/30 focus:bg-white/[0.03] transition-all resize-none"
              placeholder="Enter asset metrics details, milestones, or liquidity notes here..."
            />
          </div>

          {/* Simple Charts column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capital Allocation segmented progress bar */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-6 hover:border-white/10 transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Capital Allocation</h3>
                <p className="text-[10px] text-white/30 font-mono mt-1">Portfolio share by asset category.</p>
              </div>
              <div className="space-y-4">
                <div className="h-3.5 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                  {categories.map((cat, idx) => {
                    const percentage = totalInvested > 0 ? (Number(cat.invested || 0) / totalInvested) * 100 : 0;
                    if (percentage <= 0) return null;
                    const colors = [
                      "bg-brand-500",
                      "bg-emerald-500",
                      "bg-teal-500",
                      "bg-sky-500",
                      "bg-indigo-500",
                      "bg-cyan-500",
                      "bg-zinc-500"
                    ];
                    const colorClass = colors[idx % colors.length];
                    return (
                      <div
                        key={cat.id}
                        className={cn("h-full transition-all duration-300", colorClass)}
                        style={{ width: `${percentage}%` }}
                        title={`${cat.name}: ${percentage.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  {categories.map((cat, idx) => {
                    const percentage = totalInvested > 0 ? (Number(cat.invested || 0) / totalInvested) * 100 : 0;
                    const colors = [
                      "bg-brand-500",
                      "bg-emerald-500",
                      "bg-teal-500",
                      "bg-sky-500",
                      "bg-indigo-500",
                      "bg-cyan-500",
                      "bg-zinc-500"
                    ];
                    const colorClass = colors[idx % colors.length];
                    return (
                      <div key={cat.id} className="flex items-center gap-1.5 min-w-0">
                        <span className={cn("w-2 h-2 rounded-sm shrink-0", colorClass)} />
                        <span className="text-white/40 truncate">{cat.name}:</span>
                        <span className="text-white font-bold shrink-0">{percentage.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Growth Projection Comparison vertical bars */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-6 hover:border-white/10 transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Growth Comparison</h3>
                <p className="text-[10px] text-white/30 font-mono mt-1">{selectedCategory.name} performance scale.</p>
              </div>
              <div className="flex items-end justify-around h-32 pt-2 pb-1 relative">
                {/* Horizontal scale line */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

                {/* Invested */}
                <div className="flex flex-col items-center gap-2 group/bar w-12">
                  <span className="text-[9px] font-mono text-white/50 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    ${selectedCategory.invested.toLocaleString()}
                  </span>
                  <div
                    className="w-5 bg-white/10 border border-white/10 rounded-t-sm transition-all duration-700 origin-bottom"
                    style={{ height: `${Math.max(4, investedPct)}px` }}
                  />
                  <span className="text-[8px] font-mono uppercase text-white/30">Invested</span>
                </div>

                {/* Current Value */}
                <div className="flex flex-col items-center gap-2 group/bar w-12">
                  <span className="text-[9px] font-mono text-emerald-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    ${selectedCategory.currentValue.toLocaleString()}
                  </span>
                  <div
                    className={cn(
                      "w-5 rounded-t-sm transition-all duration-700 origin-bottom border",
                      catProfitLoss >= 0 
                        ? "bg-emerald-500/20 border-emerald-500/30" 
                        : "bg-rose-500/20 border-rose-500/30"
                    )}
                    style={{ height: `${Math.max(4, currentPct)}px` }}
                  />
                  <span className="text-[8px] font-mono uppercase text-white/30">Current</span>
                </div>

                {/* Future Expectation */}
                <div className="flex flex-col items-center gap-2 group/bar w-12">
                  <span className="text-[9px] font-mono text-brand-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    ${selectedCategory.futureExpectation.toLocaleString()}
                  </span>
                  <div
                    className="w-5 bg-brand-500/20 border border-brand-500/30 rounded-t-sm transition-all duration-700 origin-bottom"
                    style={{ height: `${Math.max(4, futurePct)}px` }}
                  />
                  <span className="text-[8px] font-mono uppercase text-white/30">Target</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-6 text-center opacity-10 text-[9px] uppercase font-bold tracking-[0.4em] font-mono">
          Capital Allocator Core active
        </div>
      </div>
    </DashboardShell>
  );
}
