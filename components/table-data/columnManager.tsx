"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface ColumnManagerProps {
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
  columnsMap: Record<string, string>; // id -> label
}

function SortableItem({ id, label }: { id: string; label: string }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between px-3 py-2 border-b bg-white"
    >
      <span>{label}</span>

      <span
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </span>
    </div>
  );
}

export function ColumnManager({
  columnOrder,
  setColumnOrder,
  columnsMap,
}: ColumnManagerProps) {
  const [open, setOpen] = React.useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setColumnOrder((prev) => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 border rounded-md bg-white"
      >
        Columns ▼
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-2 w-56 border rounded-md shadow bg-white z-50">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columnOrder}
              strategy={verticalListSortingStrategy}
            >
              {columnOrder.map((colId) => (
                <SortableItem
                  key={colId}
                  id={colId}
                  label={columnsMap[colId] || colId}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
