// "use client"

// import { Table } from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectItem,
//   SelectContent,
// } from "@/components/ui/select"

// import {
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
// } from "@tabler/icons-react"

// interface DataTablePaginationProps<TData> {
//   table: Table<TData>
// }

// export function DataTablePagination<TData>({
//   table,
// }: DataTablePaginationProps<TData>) {
//   return (
//     <div className="flex items-center justify-between px-4 ">

//       <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
//         {table.getFilteredSelectedRowModel().rows.length} of{" "}
//         {table.getFilteredRowModel().rows.length} row(s) selected.
//       </div>

//       <div className="flex w-full items-center gap-8 lg:w-fit">

//         <div className="hidden items-center gap-2 lg:flex">

//           <Label className="text-sm font-medium">
//             Rows per page
//           </Label>

//           <Select
//             value={`${table.getState().pagination.pageSize}`}
//             onValueChange={(value) =>
//               table.setPageSize(Number(value))
//             }
//           >
//             <SelectTrigger size="sm" className="w-20">
//               <SelectValue />
//             </SelectTrigger>

//             <SelectContent side="top">
//               {[10, 20, 30, 40, 50].map((pageSize) => (
//                 <SelectItem
//                   key={pageSize}
//                   value={`${pageSize}`}
//                 >
//                   {pageSize}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//         </div>

//         <div className="flex w-fit items-center justify-center text-sm font-medium">
//           Page {table.getState().pagination.pageIndex + 1} of{" "}
//           {table.getPageCount()}
//         </div>

//         <div className="ml-auto flex items-center gap-2 lg:ml-0">

//           <Button
//             variant="outline"
//             className="hidden h-8 w-8 p-0 lg:flex"
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <IconChevronsLeft />
//           </Button>

//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <IconChevronLeft />
//           </Button>

//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             <IconChevronRight />
//           </Button>

//           <Button
//             variant="outline"
//             size="icon"
//             className="hidden lg:flex"
//             onClick={() =>
//               table.setPageIndex(table.getPageCount() - 1)
//             }
//             disabled={!table.getCanNextPage()}
//           >
//             <IconChevronsRight />
//           </Button>

//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type Props = {
  pagination: {
    current_page: number;
    total_pages: number;
  };
  onNext: () => void;
  onPrev: () => void;
};

export function DataTablePagination({ pagination, onNext, onPrev }: Props) {
  return (
    <div className="flex items-center justify-end gap-1 px-6">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        disabled={pagination.current_page === 1}
      >
        <IconChevronLeft />
      </Button>

      <span className="text-sm font-medium">
        Page {pagination.current_page} of {pagination.total_pages}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={pagination.current_page === pagination.total_pages}
      >
        <IconChevronRight />
      </Button>
    </div>
  );
}
