"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ProdOsVersion = "Mark 1" | "Mark 2";

interface VersionContextType {
  version: ProdOsVersion;
  setVersion: (version: ProdOsVersion) => void;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export function VersionProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersionState] = useState<ProdOsVersion>("Mark 1");

  useEffect(() => {
    // Read from localStorage on mount
    const savedVersion = localStorage.getItem("prod_os_version") as ProdOsVersion;
    if (savedVersion === "Mark 1" || savedVersion === "Mark 2") {
      setVersionState(savedVersion);
    }
  }, []);

  const setVersion = (newVersion: ProdOsVersion) => {
    setVersionState(newVersion);
    localStorage.setItem("prod_os_version", newVersion);
    // Trigger custom event so any other non-React listeners or modules can sync
    window.dispatchEvent(new CustomEvent("version-change", { detail: newVersion }));
  };

  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
}
