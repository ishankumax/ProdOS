"use client";

import React, { createContext, useContext } from "react";
import { useJournalData as useJournalDataHook } from "@/hooks/useJournalData";

type JournalContextType = ReturnType<typeof useJournalDataHook>;

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({
  children,
  calendarSelectedDate,
}: {
  children: React.ReactNode;
  calendarSelectedDate?: string | null;
}) {
  const value = useJournalDataHook(calendarSelectedDate);
  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
}
