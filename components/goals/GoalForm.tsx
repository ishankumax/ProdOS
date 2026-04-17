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
      className="flex flex-col sm:flex-row gap-2"
    >
      {/* Title input */}
      <input
        name="title"
        type="text"
        required
        placeholder="e.g. Read for 30 minutes"
        maxLength={120}
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
      />

      {/* Type selector */}
      <div className="flex gap-1 p-1 rounded-lg border border-white/10 bg-white/5">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              type === t.value
                ? "bg-brand-500 text-white"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary py-2.5 px-4 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isPending ? (
          <span className="flex items-center gap-1.5">
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Adding…
          </span>
        ) : (
          "+ Add goal"
        )}
      </button>

      {/* Inline error */}
      {error && (
        <p className="text-xs text-red-400 mt-1 sm:col-span-full">{error}</p>
      )}
    </form>
  );
}
