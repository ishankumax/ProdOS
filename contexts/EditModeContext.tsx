"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface EditModeContextType {
  isEditing: boolean;
  toggleEdit: () => void;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditing: false,
  toggleEdit: () => {},
});

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  return (
    <EditModeContext.Provider value={{ isEditing, toggleEdit }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
