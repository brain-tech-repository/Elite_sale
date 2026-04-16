"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "../types";
// import { formatNumber } from "@/lib/firmate-currency";
import { formatNumber } from "@/lib/format-number";

export const salesColumns: ColumnDef<Sale>[] = [
  // { accessorKey: "sno", header: "S. No." },
  { accessorKey: "route", header: "Route" },
  { accessorKey: "warehouse", header: "Warehouse" },
  { accessorKey: "salesman", header: "Salesman" },

  { accessorKey: "totalCustomer", header: "Customers" },
  { accessorKey: "totalVisitDays", header: "Visit Days" },
  { accessorKey: "plannedVisit", header: "Planned Visit" },
  { accessorKey: "unplanned_visit", header: "Unplanned Visit" },

  {
    accessorKey: "dropRate",
    header: "Drop %",
    cell: ({ row }) => `${row.original.dropRate}%`,
  },

  {
    accessorKey: "salesValue",
    header: "Sales ",
    cell: ({ row }) => formatNumber(row.original.salesValue),
  },

  {
    accessorKey: "salesPerDay",
    header: "Sales / Day",
    cell: ({ row }) => formatNumber(row.original.salesPerDay),
  },

  {
    accessorKey: "totalCollection",
    header: "Collection",
    cell: ({ row }) => formatNumber(row.original.totalCollection),
  },

  {
    accessorKey: "collectionPerDay",
    header: "Collection / Day",
    cell: ({ row }) => formatNumber(row.original.collectionPerDay),
  },

  {
    accessorKey: "pendingCollection",
    header: "Pending",
    cell: ({ row }) => formatNumber(row.original.pendingCollection),
  },
];
