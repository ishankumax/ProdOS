"use client";

import { Earning, EarningCategory } from "@/types/finance";
import EditableText from "@/components/ui/EditableText";
import { useState } from "react";

interface EarningsTrackerProps {
  earnings: Earning[];
  onUpdate: (id: string, updates: Partial<Earning>) => Promise<void>;
  onAdd: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const CATEGORIES: EarningCategory[] = ['InTheBox', 'Freelancing', 'Consulting', 'Events', 'Other'];

export default function EarningsTracker({ earnings, onUpdate, onAdd, onDelete }: EarningsTrackerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          Earnings
        </h2>
        <button 
          onClick={() => onAdd()}
          className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors"
        >
          + Add Entry
        </button>
      </div>

      <div className="prod-card overflow-hidden p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Source</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {earnings.map((earning) => (
                <tr key={earning.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <EditableText 
                      value={earning.source} 
                      onSave={(val) => onUpdate(earning.id, { source: val })}
                      className="text-sm font-medium text-white"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={earning.category}
                      onChange={(e) => onUpdate(earning.id, { category: e.target.value as EarningCategory })}
                      className="bg-transparent text-xs text-white/50 border-none outline-none cursor-pointer hover:text-white transition-colors"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-surface">{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <EditableText 
                      value={earning.amount} 
                      type="number"
                      prefix="$"
                      onSave={(val) => onUpdate(earning.id, { amount: parseFloat(val) })}
                      className="text-sm font-mono text-emerald-400"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onUpdate(earning.id, { status: earning.status === 'Paid' ? 'Pending' : 'Paid' })}
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest transition-colors ${
                        earning.status === 'Paid' 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {earning.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDelete(earning.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-rose-400 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {earnings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-white/10 italic">
                    No earnings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
