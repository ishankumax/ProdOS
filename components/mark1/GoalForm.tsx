"use client";

import { useRef, useState, useTransition } from "react";
import { createGoalAction } from "@/app/dashboard/actions";
import type { GoalType } from "@/types/goals";

const TYPES: { value: GoalType; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function GoalForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<GoalType>("daily");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("type", type); // inject state-controlled type

    startTransition(async () => {
      const result = await createGoalAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <div className="space-y-2">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-stretch p-3 rounded-2xl bg-white/[0.02] border border-white/5 focus-within:border-brand-500/40 focus-within:bg-white/[0.04] transition-all"
      >
        <div className="flex-1">
          <input
            name="title"
            type="text"
            required
            placeholder="Next execution target..."
            maxLength={120}
            className="w-full bg-transparent border-none px-3 py-2 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type selector - Ghost style */}
          <div className="flex gap-0.5 p-1 rounded-xl bg-white/5">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                  type === t.value
                    ? "bg-brand-500 text-white shadow-lg"
                    : "text-white/20 hover:text-white hover:bg-white/5 uppercase"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-5 bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-[9px] font-black rounded-xl transition-all disabled:opacity-50 whitespace-nowrap tracking-wider"
          >
            {isPending ? "SYNCING..." : "COMMIT"}
          </button>
        </div>
      </form>

      {error && (
        <p className="px-4 text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>
      )}
    </div>
  );
}
