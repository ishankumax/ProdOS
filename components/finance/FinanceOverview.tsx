"use client";

import { FinanceSummary } from "@/types/finance";
import { cn } from "@/lib/utils";

interface FinanceOverviewProps {
  summary: FinanceSummary;
}

export default function FinanceOverview({ summary }: FinanceOverviewProps) {
  const cards = [
    {
      label: "Total Income",
      value: summary.totalIncome,
      delta: summary.incomeDelta,
      color: "text-emerald-400",
      prefix: "$",
    },
    {
      label: "Expenses",
      value: summary.totalExpenses,
      delta: summary.expenseDelta,
      color: "text-rose-400",
      prefix: "$",
    },
    {
      label: "Monthly Profit",
      value: summary.monthlyProfit,
      delta: summary.profitDelta,
      color: summary.monthlyProfit >= 0 ? "text-brand-400" : "text-rose-400",
      prefix: "$",
    },
    {
      label: "Pending Payments",
      value: summary.pendingPayments,
      color: "text-amber-400",
      prefix: "$",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="prod-card-interactive space-y-3"
        >
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {card.label}
            </p>
            {card.delta !== undefined && (
              <span className={cn(
                "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                card.delta >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {card.delta >= 0 ? "↗" : "↘"} {Math.abs(card.delta)}%
              </span>
            )}
          </div>
          <p className={cn("text-2xl font-bold tracking-tight font-mono", card.color)}>
            {card.prefix}{card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      ))}
    </div>
  );
}
