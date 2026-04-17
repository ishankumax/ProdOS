"use client";

import { useRef, useState, useTransition } from "react";
import { createHabitAction } from "@/app/dashboard/actions";

export default function HabitForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createHabitAction(formData);
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
      <div className="flex-grow min-w-[200px]">
        <input
          name="name"
          type="text"
          required
          placeholder="New habit... (e.g. Drink Water)"
          maxLength={50}
          className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all border-solid"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary h-11 px-6 text-[10px] font-bold whitespace-nowrap disabled:opacity-50 flex-shrink-0"
      >
        {isPending ? "..." : "ADD HABIT"}
      </button>

      {error && (
        <p className="text-xs text-red-400 mt-1 sm:col-span-full">{error}</p>
      )}
    </form>
  );
}
