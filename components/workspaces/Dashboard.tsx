"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditMode } from "@/contexts/EditModeContext";
import { useAuth } from "@/contexts/AuthContext";

import TodoList from "../widgets/TodoList";
import HabitTracker from "../widgets/HabitTracker";
import DailyPlanner from "../widgets/DailyPlanner";
import DigitalJournal from "../widgets/DigitalJournal";
import MicroTrackers from "../widgets/MicroTrackers";

// Custom sortable widget wrapper with size context menu
function SortableWidget({
  id,
  children,
  disabled,
  size,
  onSizeChange,
}: {
  id: string;
  children: React.ReactNode;
  disabled: boolean;
  size: "small" | "medium" | "large";
  onSizeChange: (size: "small" | "medium" | "large") => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });
  const [showMenu, setShowMenu] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  const colSpanClass =
    size === "large"
      ? "col-span-1 lg:col-span-2"
      : size === "medium"
      ? "col-span-1"
      : "col-span-1 max-h-[280px] overflow-hidden";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative h-full flex flex-col ${colSpanClass} ${isDragging ? "opacity-50" : ""}`}
    >
      {/* Drag & Context Size Trigger */}
      {!disabled && (
        <div className="absolute top-2 right-2 z-[100] flex gap-1.5">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-7 h-7 rounded-full bg-[#16162a] border border-white/10 shadow-lg flex items-center justify-center text-white/50 hover:text-white"
            title="Resize Widget"
          >
            <i className="fi fi-sr-settings-sliders text-[9px]" />
          </button>

          <div
            {...attributes}
            {...listeners}
            className="w-7 h-7 rounded-full bg-[#16162a] border border-white/10 shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing text-white/50 hover:text-white"
            title="Drag to move"
          >
            <i className="fi fi-sr-apps-sort text-[9px]" />
          </div>
        </div>
      )}

      {showMenu && !disabled && (
        <div className="absolute right-12 top-2 z-[110] bg-[#0d0d1a] border border-white/15 rounded-lg p-1 shadow-2xl flex flex-col gap-0.5">
          {(["small", "medium", "large"] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => {
                onSizeChange(sz);
                setShowMenu(false);
              }}
              className={`text-[9px] uppercase font-bold px-2 py-1 rounded text-left transition-colors ${
                size === sz ? "bg-brand-500/20 text-brand-400" : "text-white/60 hover:bg-white/5"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 w-full h-full relative">
        {children}
      </div>
    </div>
  );
}

const AVAILABLE_WIDGETS: Record<string, React.ReactNode> = {
  todo: <TodoList />,
  habits: <HabitTracker />,
  planner: <DailyPlanner />,
  journal: <DigitalJournal />,
  trackers: <div className="col-span-1 lg:col-span-2"><MicroTrackers /></div>,
};

export default function Dashboard() {
  const { isEditing } = useEditMode();
  const { user } = useAuth();
  
  const userId = user?.email || "anonymous";
  const storageKey = `prod-os-home-layout-${userId}`;
  const sizeKey = `prod-os-home-sizes-${userId}`;

  const [activeWidgets, setActiveWidgets] = useState<string[]>(["todo", "habits", "planner", "journal", "trackers"]);
  const [widgetSizes, setWidgetSizes] = useState<Record<string, "small" | "medium" | "large">>({
    todo: "medium",
    habits: "medium",
    planner: "medium",
    journal: "medium",
    trackers: "large",
  });

  const [showPicker, setShowPicker] = useState(false);

  // Load layout & sizes from user-scoped persistence
  useEffect(() => {
    const savedLayout = localStorage.getItem(storageKey);
    if (savedLayout) {
      try {
        setActiveWidgets(JSON.parse(savedLayout));
      } catch (e) {
        console.error(e);
      }
    }
    const savedSizes = localStorage.getItem(sizeKey);
    if (savedSizes) {
      try {
        setWidgetSizes(JSON.parse(savedSizes));
      } catch (e) {
        console.error(e);
      }
    }
  }, [storageKey, sizeKey]);

  const saveLayout = (layout: string[]) => {
    setActiveWidgets(layout);
    localStorage.setItem(storageKey, JSON.stringify(layout));
  };

  const saveSize = (id: string, sz: "small" | "medium" | "large") => {
    const updated = { ...widgetSizes, [id]: sz };
    setWidgetSizes(updated);
    localStorage.setItem(sizeKey, JSON.stringify(updated));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = activeWidgets.indexOf(active.id as string);
      const newIndex = activeWidgets.indexOf(over.id as string);
      saveLayout(arrayMove(activeWidgets, oldIndex, newIndex));
    }
  }

  const toggleWidget = (id: string) => {
    if (activeWidgets.includes(id)) {
      saveLayout(activeWidgets.filter((w) => w !== id));
    } else {
      saveLayout([...activeWidgets, id]);
    }
  };

  return (
    <div className="h-full w-full flex flex-col pt-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">🌸 ProdOS Home</h1>
        {isEditing && (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.25)] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <i className="fi fi-sr-add text-[10px]" />
            Widget Library
          </button>
        )}
      </div>

      {showPicker && isEditing && (
        <div className="mb-6 p-4 bg-[#12121c]/90 border border-white/5 rounded-2xl flex flex-wrap gap-2.5 z-40 relative">
          {[
            { id: "todo", name: "Todo List 📋" },
            { id: "habits", name: "Habit Tracker 🔄" },
            { id: "planner", name: "Daily Planner 📅" },
            { id: "journal", name: "Digital Journal 📖" },
            { id: "trackers", name: "Micro Trackers 💧" },
          ].map((w) => {
            const active = activeWidgets.includes(w.id);
            return (
              <button
                key={w.id}
                onClick={() => toggleWidget(w.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  active
                    ? "bg-brand-500/25 border-brand-500/40 text-brand-300"
                    : "bg-white/[0.02] border-white/10 text-white/50 hover:border-white/20"
                }`}
              >
                {w.name} {active ? "✓" : "+"}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1 overflow-auto pr-4 pb-32 custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeWidgets} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
              {activeWidgets.map((id) => (
                <SortableWidget
                  key={id}
                  id={id}
                  disabled={!isEditing}
                  size={widgetSizes[id] || "medium"}
                  onSizeChange={(sz) => saveSize(id, sz)}
                >
                  {AVAILABLE_WIDGETS[id]}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
