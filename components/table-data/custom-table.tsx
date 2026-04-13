//

"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

interface Props<T> {
  columns: any[];
  data: T[];
  tableWidth?: string; // ✅ ADD THIS
  isFetching?: boolean;
  pageSize?: number;
  pageCount?: number;
  serverMode?: boolean;
  title?: string; // Add this line
  onPaginationChange?: (pagination: any) => void;
}

export function CommonDataTable<T>({
  columns,
  data,
  tableWidth = "100%",
  isFetching = false,
  pageSize = 10,
  pageCount,
  serverMode = false,
  title, // Destructure it here
  onPaginationChange,
}: Props<T>) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    manualPagination: serverMode,
    pageCount: serverMode ? pageCount : undefined,
    onPaginationChange: (updater) => {
      const value =
        typeof updater === "function" ? updater(pagination) : updater;

      setPagination(value);
      onPaginationChange?.(value);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <>
      <div className="w-full rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-sm flex flex-col h-[400px]">
        <div className="w-full overflow-x-auto overflow-y-hidden flex-1">
          <div
            className="h-full overflow-y-auto  rounded-t-xl"
            style={{ minWidth: tableWidth }}
          >
            <table className="w-full border-collapse text-sm ">
              {/* Header */}

              <thead className="sticky top-0 bg-gradient-to-br from-[#ACCBEE] to-[#E7F0FE] text-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`border-gray-200 border-b border-r px-4 py-3 text-left font-semibold last:border-r-0 ${
                          header.index === 0
                            ? "whitespace-nowrap min-w-[100px]"
                            : ""
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {/* Body */}
              <tbody className="bg-gradient-to-t from-primary/5 to-card dark:from-primary/10 dark:to-background">
                {isFetching ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <tr key={i}>
                      {columns.map((_, index) => (
                        <td
                          key={index}
                          className="border-gray-200 border-b border-r px-4 py-3 last:border-r-0"
                        >
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length > 0 ? (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className="transition hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`border-gray-200 border-b border-r px-2 py-3 text-gray-700 last:border-r-0 ${
                            cell.column.getIndex() === 0
                              ? "whitespace-nowrap min-w-[100px]"
                              : ""
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-[245px] text-center text-gray-400 align-middle"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-auto flex items-center justify-between rounded-b-xl border-gray-200 border-t bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3">
          <span className="text-gray-600 text-sm">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-md bg-gradient-to-br from-[#ACCBEE] to-[#E7F0FE] px-4 py-1.5 text-slate-800 text-sm font-medium shadow-sm transition-all duration-300 hover:brightness-95 hover:shadow-md disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-md bg-gradient-to-br from-[#ACCBEE] to-[#E7F0FE] px-4 py-1.5 text-slate-800 text-sm font-medium shadow-sm transition-all duration-300 hover:brightness-95 hover:shadow-md disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
