"use client";

import React, { createContext, useContext, useState } from "react";

type Mode = "execution" | "configuration";

interface EditModeContextType {
  mode: Mode;
  isEditMode: boolean;
  toggleMode: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("execution");

  const toggleMode = () => {
    setMode((prev) => (prev === "execution" ? "configuration" : "execution"));
  };

  return (
    <EditModeContext.Provider value={{ mode, isEditMode: mode === "configuration", toggleMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) throw new Error("useEditMode must be used within EditModeProvider");
  return context;
}
