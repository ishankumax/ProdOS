"use client";

import { Earning, Expense } from "@/types/finance";

interface FinanceAnalyticsProps {
  earnings: Earning[];
  expenses: Expense[];
}

export default function FinanceAnalytics({ earnings, expenses }: FinanceAnalyticsProps) {
  // Group earnings by category
  const categoryTotals = earnings.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  const totalEarnings = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(var(--brand-500-rgb),0.5)]" />
          Revenue Distribution
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Category Breakdown Bars */}
        <div className="space-y-4">
          {Object.entries(categoryTotals).map(([cat, amount]) => {
            const percentage = totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0;
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>{cat}</span>
                  <span className="text-white/60">${amount.toLocaleString()}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-500 shadow-[0_0_10px_rgba(var(--brand-500-rgb),0.3)] transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          {Object.keys(categoryTotals).length === 0 && (
            <p className="text-xs text-white/10 italic">No revenue data for analysis.</p>
          )}
        </div>

        {/* Minimal Stats */}
        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-center space-y-4">
           <div className="space-y-1">
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Efficiency Ratio</p>
             <p className="text-2xl font-bold text-white">
               {totalEarnings > 0 ? Math.round(((totalEarnings - expenses.reduce((s, e) => s + Number(e.amount), 0)) / totalEarnings) * 100) : 0}%
             </p>
           </div>
           <div className="space-y-1">
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Streams</p>
             <p className="text-2xl font-bold text-white">
               {new Set(earnings.map(e => e.source)).size}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
