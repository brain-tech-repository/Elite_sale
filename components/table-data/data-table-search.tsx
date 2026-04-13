"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

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

import {
  GripVertical,
  SlidersHorizontal,
  Columns,
  Filter,
  Download,
} from "lucide-react";

interface DataTableSearchProps<TData> {
  onFilter?: (filters: any) => void;
  table: Table<TData>;
  title?: string;
  onExport?: () => void; // ✅ optional

  FilterComponent?: React.ComponentType<{
    onFilter: (filters: any) => void;
    // ✅ ADD THIS
  }>;
}

function SortableColumnItem({ column }: any) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: column.id });

  return (
    <DropdownMenuCheckboxItem
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      checked={column.getIsVisible()}
      onCheckedChange={(value) => column.toggleVisibility(!!value)}
      className="flex items-center justify-between capitalize"
    >
      <span>{column.id}</span>

      <span
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="ml-2 cursor-grab"
      >
        <GripVertical size={14} />
      </span>
    </DropdownMenuCheckboxItem>
  );
}

export function DataTableSearch<TData>({
  table,
  title,
  onFilter,
  onExport,
  FilterComponent,
}: DataTableSearchProps<TData>) {
  const sensors = useSensors(useSensor(PointerSensor));
  const columnOrder = table.getState().columnOrder;

  const [openFilter, setOpenFilter] = React.useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = columnOrder.indexOf(active.id);
    const newIndex = columnOrder.indexOf(over.id);

    table.setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
  };

  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    );

  return (
    <div className="flex flex-col gap-2 px-4 lg:px-6">
      {/* 🔝 HEADER ROW */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* ✅ TITLE (ONLY IF PASSED) */}
        {title && (
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-100 to-gray-300" />
            <h1 className="font-bold text-gray-900 text-lg dark:text-gray-100">
              {title}
            </h1>
          </div>
        )}

        {/* ✅ RIGHT SIDE → ALWAYS SHOW SEARCH + COLUMN */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          <div className="flex items-center gap-2">
            {/* ✅ ONLY SHOW IF PASSED */}

            {/* {FilterComponent && <FilterComponent onFilter={onFilter!} />} */}
          </div>
          {/* 🔍 SEARCH (ALWAYS) */}
          <Input
            placeholder="Search..."
            value={
              (table.getColumn("header")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("header")?.setFilterValue(event.target.value)
            }
            className="w-[200px]"
          />
          {onExport && (
            <>
              <Button
                type="button"
                // className="shadow-xm bg-[#022235] cursor-pointer text-white"
                onClick={onExport}
                size="sm"
                variant="outline"
              >
                <Download size={16} />
              </Button>
            </>
          )}

          {/* 🧪 FILTER (ONLY IF PROVIDED) */}
          {FilterComponent && (
            <>
              <Button
                type="button"
                className="shadow-xm bg-[#022235] cursor-pointer"
                onClick={() => setOpenFilter((prev) => !prev)}
              >
                <Filter size={16} />
              </Button>
            </>
          )}

          {/* ⚙️ COLUMN MANAGER (ALWAYS) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-0">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={columnOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {columns.map((column) => (
                    <SortableColumnItem key={column.id} column={column} />
                  ))}
                </SortableContext>
              </DndContext>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 🔽 FILTER PANEL */}
      {openFilter && FilterComponent && (
        <div className="border rounded-md p-3 bg-muted/30 w-full">
          <FilterComponent
            onFilter={(filters) => {
              onFilter?.(filters);
              setOpenFilter(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
