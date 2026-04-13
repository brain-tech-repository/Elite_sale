"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Sale = {
  id: string
  customer: string
  product: string
  amount: number
  status: "Completed" | "Pending" | "Cancelled"
  date: string
}

export const salesColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "amount",
    header: "Amount (₹)",
    cell: ({ row }) => (
      <span className="font-medium text-emerald-600">
        ₹{row.original.amount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <span
          className={`px-2 py-1 text-xs rounded-md font-medium ${
            status === "Completed"
              ? "bg-emerald-100 text-emerald-700"
              : status === "Pending"
              ? "bg-pink-100 text-pink-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
]