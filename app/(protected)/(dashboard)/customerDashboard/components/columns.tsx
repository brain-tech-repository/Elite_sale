import { ColumnDef } from "@tanstack/react-table";

const formatNumber = (value: any) => {
  if (!value) return "0";

  const num = parseFloat(String(value).replace(/,/g, ""));
  if (isNaN(num)) return "0";

  return Math.floor(num).toLocaleString("en-IN"); // no decimal
};

export type PerformanceRow = {
  serial_no: number;
  date: string;
  customer_code: string;
  customer_name: string;
  customer_category_name: string;
  last_transaction: string;
  total_collection: string;
  total_invoice_value: string;
  amount: string;
  total_invoice_amount: string;
  per_day: string;
};

export const performanceColumns: ColumnDef<PerformanceRow>[] = [
  {
    accessorKey: "serial_no",
    header: "S. No.",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "customer_code",
    header: "Customer Code",
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "customer_category_name",
    header: "Customer Segment",
  },

  {
    accessorKey: "last_transaction",
    header: "Last Transaction",
    cell: ({ row }) => formatNumber(row.original.last_transaction),
  },
  {
    accessorKey: "total_collection",
    header: "Total Collection",
    cell: ({ row }) => formatNumber(row.original.total_collection),
  },
  {
    accessorKey: "total_invoice_value",
    header: "Total Invoice Value",
    cell: ({ row }) => formatNumber(row.original.total_invoice_value),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatNumber(row.original.amount),
  },
  {
    accessorKey: "total_invoice_amount",
    header: "Total Invoice Amount",
    cell: ({ row }) => formatNumber(row.original.total_invoice_amount),
  },
  {
    accessorKey: "per_day",
    header: "Per Day",
    cell: ({ row }) => formatNumber(row.original.per_day),
  },
];
