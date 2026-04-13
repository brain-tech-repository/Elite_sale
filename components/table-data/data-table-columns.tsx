"use client";

import { Table } from "@tanstack/react-table";
import {
  Table as UITable,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { flexRender } from "@tanstack/react-table";

interface DataTableColumnsProps<TData> {
  table: Table<TData>;
  columnsLength: number;
  isFetching?: boolean; // Added isFetching prop
}

export function DataTableColumns<TData>({
  table,
  columnsLength,
  isFetching = false, // Default to false
}: DataTableColumnsProps<TData>) {
  return (
    <UITable>
      {/* HEADER */}
      <TableHeader className="sticky top-0 z-10 bg-muted">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className="border-r last:border-r-0"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {/* BODY */}
      <TableBody>
        {isFetching ? (
          /* --- LOADER START --- */
          Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: columnsLength }).map((_, index) => (
                <TableCell
                  key={index}
                  className="border-r px-4 py-3 last:border-r-0"
                >
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : /* --- LOADER END --- */
        table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="border-r last:border-r-0">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnsLength} className="h-24 text-center">
              No results Found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </UITable>
  );
}
