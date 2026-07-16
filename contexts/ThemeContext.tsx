"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  availableThemes: { id: string; name: string }[];
};

const AVAILABLE_THEMES = [
  { id: "default", name: "Tech Green" },
  { id: "amber", name: "Amber" },
  { id: "rose", name: "Rose" },
  { id: "mono", name: "Monochrome" },
  { id: "vscode-dark-modern", name: "Dark Modern" },
  { id: "vscode-dark-plus", name: "Dark+" },
  { id: "vscode-dark-vs", name: "Dark (VS)" },
  { id: "vscode-hc-black", name: "High Contrast Black" },
  { id: "vscode-2026-dark", name: "2026 Dark" },
  { id: "vscode-light-modern", name: "Light Modern" },
  { id: "vscode-light-plus", name: "Light+" },
  { id: "vscode-light-vs", name: "Light (VS)" },
  { id: "vscode-hc-light", name: "High Contrast Light" },
  { id: "vscode-2026-light", name: "2026 Light" },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("prod_os_theme") || "default";
    setThemeState(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem("prod_os_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: AVAILABLE_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
