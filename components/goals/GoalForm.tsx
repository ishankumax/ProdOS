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
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3"
    >
      {/* Title input */}
      <div className="flex-[2] min-w-[200px]">
        <input
          name="title"
          type="text"
          required
          placeholder="e.g. Read for 30 minutes"
          maxLength={120}
          className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all border-solid"
        />
      </div>

      {/* Action group */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Type selector */}
        <div className="flex gap-1 p-1 rounded-lg border border-white/10 bg-white/5 h-10">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`px-3 rounded-md text-[10px] font-bold transition-all duration-150 ${
                type === t.value
                  ? "bg-brand-500 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary h-10 px-4 text-[10px] font-bold whitespace-nowrap disabled:opacity-50"
        >
          {isPending ? "..." : "ADD GOAL"}
        </button>
      </div>

      {/* Inline error */}
      {error && (
        <p className="text-xs text-red-400 mt-1 sm:col-span-full">{error}</p>
      )}
    </form>
  );
}
