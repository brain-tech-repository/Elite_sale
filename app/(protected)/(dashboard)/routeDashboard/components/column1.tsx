"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RouteSalesCollection } from "../types"; // ✅ FIX
import { formatNumber } from "@/lib/format-number";

export const routeSalesCollectionColumns: ColumnDef<RouteSalesCollection>[] = [
  {
    accessorKey: "route",
    header: "Route",
  },
  {
    accessorKey: "totalSales",
    header: "Total Sales",
    cell: ({ row }) => (
      <span className="">{formatNumber(row.original.totalSales)}</span>
    ),
  },
  {
    accessorKey: "totalCollection",
    header: "Total Collection",
    cell: ({ row }) => (
      <span className="">{formatNumber(row.original.totalCollection)}</span>
    ),
  },
  {
    accessorKey: "totalReturn",
    header: "Return",
    cell: ({ row }) => (
      <span className="">{formatNumber(row.original.totalReturn)}</span>
    ),
  },
  {
    accessorKey: "totalExchange",
    header: "Exchange",
    cell: ({ row }) => (
      <span className="">{formatNumber(row.original.totalExchange)}</span>
    ),
  },
];
