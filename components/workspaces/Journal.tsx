"use client";

import { CLASSES } from "@/lib/theme";

export default function Journal() {
  return (
    <div className="h-full w-full flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Journal</h1>
      </div>

      <div className={`flex-1 ${CLASSES.card} flex flex-col items-center justify-center p-8 text-center gap-4`}>
        <i className="fi fi-sr-book-alt text-4xl text-white/20" />
        <div>
          <h2 className="text-lg font-semibold text-white/80">Daily Entries</h2>
          <p className="text-sm text-white/40 mt-1">This module is under construction.</p>
        </div>
      </div>
    </div>
  );
}
