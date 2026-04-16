"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import InfiniteScroll from "react-infinite-scroll-component";
import { DataTableSearch } from "./data-table-search";
import { DataTableColumns } from "./data-table-columns";
import { DataTablePagination } from "./data-table-pagination";
import DataTableHeader from "./table-header";
import { ColumnManager } from "./columnManager";
import { Card } from "../ui/card";
import MyForm1 from "../../app/(protected)/(dashboard)/customerDashboard/components/filter1"; // ✅ adjust path

interface CommonTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  headerTitle?: string;
  onFilter?: (filters: any) => void;
  isFetching?: boolean; //
  pagination?: any;
  onNext?: () => void;
  onPrev?: () => void;
  isFetchingMore?: boolean;
  tableHeight?: number | string;
  onExport?: () => void; // ✅ add here
  height?: number | string; // ✅ ADD THIS
  onRowClick?: (rowData: TData) => void;
  FilterComponent?: React.ComponentType<{
    onFilter: (filters: any) => void;
  }>;
}

export function CommonDataTables<TData, TValue>({
  headerTitle,
  onFilter,
  isFetching,
  columns,
  data,
  pagination,
  onNext,
  onPrev,
  isFetchingMore,
  FilterComponent,
  onExport, // ✅ ADD THIS
  onRowClick,
  height,
  tableHeight = 300,
}: CommonTableProps<TData, TValue>) {
  // ✅ Ensure stable column IDs
  const columnIds = React.useMemo(
    () =>
      columns.map(
        (col, index) =>
          (col.id as string) ||
          (("accessorKey" in col && col.accessorKey) as string) ||
          `col_${index}`,
      ),
    [columns],
  );

  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);

  // ✅ Load from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("table-column-order");

    if (saved) {
      setColumnOrder(JSON.parse(saved));
    } else {
      setColumnOrder(columnIds);
    }
  }, [columnIds]);
  // ✅ Load from localStorage
  React.useEffect(() => {
    if (columnOrder.length) {
      localStorage.setItem("table-column-order", JSON.stringify(columnOrder));
    }
  }, [columnOrder]);
  const columnsMap = React.useMemo(() => {
    const map: Record<string, string> = {};

    columns.forEach((col, index) => {
      const id =
        ("id" in col && col.id) ||
        ("accessorKey" in col && col.accessorKey) ||
        `col_${index}`;

      const label = typeof col.header === "string" ? col.header : id;

      map[id as string] = label as string;
    });

    return map;
  }, [columns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const hasMore = pagination?.current_page < pagination?.total_pages;

  return (
    <Card className="w-full flex flex-col gap-2 pt-2 my-0 pb-0 mb-0">
      <DataTableSearch
        table={table}
        onFilter={onFilter}
        title={headerTitle}
        FilterComponent={FilterComponent}
        onExport={onExport}
      />

      <div className="rounded-lg border">
        <InfiniteScroll
          dataLength={data.length}
          next={onNext!}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-4">
              <div className="h-7 w-7 border-5 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          }
          endMessage={
            !isFetchingMore && !hasMore ? (
              <p className="text-center py-3 text-gray-500 text-sm">
                No more data
              </p>
            ) : null
          }
          // height={tableHeight}
          height={height || 300}
        >
          <DataTableColumns
            table={table}
            columnsLength={columns.length}
            isFetching={isFetching || (isFetchingMore && data.length === 0)}
            onRowClick={onRowClick}
          />
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <td key={header.id} className="p-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </InfiniteScroll>
      </div>

      {/* {pagination && onNext && onPrev && (
        <DataTablePagination
          pagination={pagination}
          onNext={onNext}
          onPrev={onPrev}
        />
      )} */}
    </Card>
  );
}
