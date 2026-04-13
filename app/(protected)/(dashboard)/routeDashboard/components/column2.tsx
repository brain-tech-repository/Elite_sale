"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RouteExpense } from "../types";
// import { formatCurrency } from "@/lib/firmate-currency";
import { formatNumber } from "@/lib/format-number";

export const routeExpenseColumns: ColumnDef<RouteExpense>[] = [
  {
    accessorKey: "route",
    header: "Route",
  },
  {
    accessorKey: "totalExpense",
    header: "Total Expense",
    cell: ({ row }) => (
      <span className="">{formatNumber(row.original.totalExpense)}</span>
    ),
  },
];
