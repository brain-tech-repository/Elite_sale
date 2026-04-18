"use client";

import { ColumnDef } from "@tanstack/react-table";

export type MaterialPerformance = {
  material_code: string;
  material_description: string;
  total_volume: number;
  unit_price: number;
  car: number;
  pcs: number;
  total_value: number;
};

export const salesColumns: ColumnDef<MaterialPerformance>[] = [
  {
    header: "Material Code",
    accessorKey: "material_code",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.material_code}</span>
    ),
  },
  {
    header: "Description",
    accessorKey: "material_description",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.material_description}
      </span>
    ),
  },
  {
    header: "Volume",
    accessorKey: "total_volume",
    cell: ({ row }) => (
      <span>{row.original.total_volume?.toLocaleString()}</span>
    ),
  },
  {
    header: "Unit Price",
    accessorKey: "unit_price",
    cell: ({ row }) => <span>{row.original.unit_price?.toLocaleString()}</span>,
  },
  {
    header: "CAR",
    accessorKey: "car",
    cell: ({ row }) => <span>{row.original.car?.toLocaleString()}</span>,
  },
  {
    header: "PCS",
    accessorKey: "pcs",
    cell: ({ row }) => <span>{row.original.pcs?.toLocaleString()}</span>,
  },
  {
    header: "Total Value",
    accessorKey: "total_value",
    cell: ({ row }) => (
      <span>{row.original.total_value?.toLocaleString()}</span>
    ),
  },
];
