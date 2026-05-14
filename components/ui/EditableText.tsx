"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string | number;
  onSave: (newValue: string) => Promise<void>;
  className?: string;
  inputClassName?: string;
  type?: "text" | "number";
  prefix?: string;
}

export default function EditableText({
  value,
  onSave,
  className,
  inputClassName,
  type = "text",
  prefix = "",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value.toString());
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update internal state if external value changes
  useEffect(() => {
    setCurrentValue(value.toString());
  }, [value]);

  const handleBlur = async () => {
    if (currentValue !== value.toString()) {
      setIsSaving(true);
      await onSave(currentValue);
      setIsSaving(false);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setCurrentValue(value.toString());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center">
        {prefix && <span className="mr-1 opacity-50">{prefix}</span>}
        <input
          ref={inputRef}
          type={type}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className={cn(
            "bg-white/10 border-b border-brand-500 outline-none px-1 py-0.5 rounded-sm transition-all focus:bg-white/20",
            isSaving && "opacity-50 cursor-wait",
            inputClassName
          )}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group relative cursor-pointer hover:bg-white/5 px-1 -mx-1 rounded transition-all inline-flex items-center min-w-[20px]",
        className
      )}
    >
      {prefix && <span className="mr-1 opacity-50">{prefix}</span>}
      <span className="truncate">{value}</span>
      <span className="opacity-0 group-hover:opacity-40 ml-2 text-white transition-opacity">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </span>
    </div>
  );
}
