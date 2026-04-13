"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RouteSales } from "../types";
import { formatNumber } from "@/lib/format-number";

export const routeSalesColumns: ColumnDef<RouteSales>[] = [
  {
    accessorKey: "route",
    header: "Route",
  },

  {
    accessorKey: "todaySales",
    header: "Today Sales",
    cell: ({ row }) => formatNumber(row.original.todaySales),
  },

  {
    accessorKey: "yesterdaySales",
    header: "Yesterday Sales",
    cell: ({ row }) => formatNumber(row.original.yesterdaySales),
  },

  {
    accessorKey: "weeklySales",
    header: "Weekly Sales",
    cell: ({ row }) => formatNumber(row.original.weeklySales),
  },

  {
    accessorKey: "last14DaysSales",
    header: "Last 14 Days",
    cell: ({ row }) => formatNumber(row.original.last14DaysSales),
  },

  {
    accessorKey: "monthSales",
    header: "Month",
    cell: ({ row }) => formatNumber(row.original.monthSales),
  },

  {
    accessorKey: "quarterSales",
    header: "Quarter",
    cell: ({ row }) => formatNumber(row.original.quarterSales),
  },

  {
    accessorKey: "yearSales",
    header: "Year",
    cell: ({ row }) => formatNumber(row.original.yearSales),
  },
];
