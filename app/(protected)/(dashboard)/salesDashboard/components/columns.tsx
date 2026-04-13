import { ColumnDef } from "@tanstack/react-table";

export type PerformanceRow = {
  id: number;
  name: string;
  total_sales: number;
  total_collection: number;
  total_return: number;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

export const performanceColumns: ColumnDef<PerformanceRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "total_sales",
    header: "Total Sales",
    cell: ({ row }) => formatNumber(row.original.total_sales),
  },
  {
    accessorKey: "total_collection",
    header: "Collection",
    cell: ({ row }) => formatNumber(row.original.total_collection),
  },
  {
    accessorKey: "total_return",
    header: "Return",
    cell: ({ row }) => formatNumber(row.original.total_return),
  },
];
