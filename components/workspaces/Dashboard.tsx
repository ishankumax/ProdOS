"use client";

import { useState } from "react";
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

import TasksWidget from "./TasksWidget";
import CalendarWidget from "./CalendarWidget";
import HealthWidget from "./HealthWidget";
import NotesWidget from "./NotesWidget";

// Custom sortable widget wrapper
function SortableWidget({ id, children, disabled }: { id: string; children: React.ReactNode; disabled: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative h-full flex flex-col ${isDragging ? "opacity-50" : ""}`}
    >
      {disabled ? null : (
        <div
          {...attributes}
          {...listeners}
          className="absolute -top-3 -right-3 z-[100] w-8 h-8 rounded-full bg-surface-raised border border-white/10 shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing text-white/40 hover:text-white transition-colors hover:bg-brand-500/20"
          title="Drag to move"
        >
          <i className="fi fi-sr-apps-sort text-[10px]" />
        </div>
      )}
      <div className="flex-1 w-full h-full relative">
        {children}
      </div>
    </div>
  );
}

const AVAILABLE_WIDGETS: Record<string, React.ReactNode> = {
  tasks: <TasksWidget />,
  calendar: <CalendarWidget />,
  health: <HealthWidget />,
  notes: <NotesWidget />,
};

export default function Dashboard() {
  const { isEditing } = useEditMode();
  const [activeWidgets, setActiveWidgets] = useState(["tasks", "calendar", "health", "notes"]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setActiveWidgets((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="h-full w-full flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        {isEditing && (
          <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 shadow-[0_0_12px_rgba(var(--brand-500-rgb),0.25)] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all">
            <i className="fi fi-sr-add text-[10px]" />
            Widget Library
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto pr-4 pb-32 custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeWidgets} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
              {activeWidgets.map((id) => (
                <SortableWidget key={id} id={id} disabled={!isEditing}>
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
