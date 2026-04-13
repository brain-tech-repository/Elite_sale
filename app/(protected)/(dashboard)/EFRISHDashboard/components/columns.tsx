import { ColumnDef } from "@tanstack/react-table";

export const pendingInvoiceColumns: ColumnDef<any>[] = [
  { accessorKey: "invoice_number", header: "Invoice Number" },
  { accessorKey: "invoice_date", header: "Date" },
  { accessorKey: "customer_name", header: "Customer Name" },
  { accessorKey: "net_total_amount", header: "Net Amount" },
  { accessorKey: "total_invoice_value", header: "Total Value" },
  { accessorKey: "status", header: "Status" },
];

export const stockAdjustmentsyncColumns: ColumnDef<any>[] = [
  { accessorKey: "stock_adjustment_number", header: "Adjustment No" },
  { accessorKey: "journal_entry_code", header: "Journal Code" },
  { accessorKey: "stock_adjust_date", header: "Date" },
  { accessorKey: "remark", header: "Remark" },
  {
    accessorKey: "efris_error",
    header: "Error Status",
    cell: ({ row }) => (row.original.efris_error === "1" ? "Error" : "Clean"),
  },
];

export const stockAdjustmentColumns: ColumnDef<any>[] = [
  { accessorKey: "stock_adjustment_number", header: "Adjustment No" },
  { accessorKey: "journal_entry_code", header: "Journal Code" },
  { accessorKey: "stock_adjust_date", header: "Date" },
  { accessorKey: "remark", header: "Remark" },
  {
    accessorKey: "pi_count_no",
    header: "PI Count No",
  },
  {
    accessorKey: "efris_posted",
    header: "EFRIS Status",
    cell: ({ row }) =>
      row.original.efris_posted === "1" ? "Posted" : "Pending",
  },
];

export const syncRouteInvoiceColumns: ColumnDef<any>[] = [
  {
    accessorKey: "invoice_number",
    header: "Invoice No",
  },
  {
    accessorKey: "invoice_date",
    header: "Date",
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
  },
  {
    accessorKey: "total_invoice_value",
    header: "Total",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const pendingGRNColumns = [
  {
    accessorKey: "grn_code",
    header: "GRN Code",
  },
  {
    accessorKey: "journal_entry_code",
    header: "Journal Code",
  },
  {
    accessorKey: "delivery_date",
    header: "Delivery Date",
  },
  {
    accessorKey: "total_grn_value",
    header: "GRN Value",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const syncGRNColumns = [
  {
    accessorKey: "grn_code",
    header: "GRN Code",
  },
  {
    accessorKey: "journal_entry_code",
    header: "Journal Code",
  },
  {
    accessorKey: "delivery_date",
    header: "Delivery Date",
  },
  {
    accessorKey: "total_grn_value",
    header: "GRN Value",
  },
  {
    accessorKey: "vbln",
    header: "VBLN",
  },
  {
    accessorKey: "sync_to_sap",
    header: "SAP Sync",
  },
];

export const routeReturnColumns = [
  { accessorKey: "return_number", header: "Return No" },
  { accessorKey: "invoice_date", header: "Invoice Date" },
  { accessorKey: "total_invoice_value", header: "Invoice Value" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "efris_posted", header: "EFRIS" },
];

export const orderReturnColumns = [
  { accessorKey: "return_order_number", header: "Order No" },
  { accessorKey: "delevary_date", header: "Delivery Date" },
  { accessorKey: "total_order_value", header: "Order Value" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "stock_sync", header: "Stock Sync" },
];

export const salesInvoiceColumns = [
  { accessorKey: "company_invoice_number", header: "Invoice No" },
  { accessorKey: "delivery_date", header: "Delivery Date" },
  { accessorKey: "total_invoice_value", header: "Invoice Value" },
  { accessorKey: "journal_entry_code", header: "Journal Code" },
  { accessorKey: "efris_posted", header: "EFRIS" },
];

export const counterSalesColumns = [
  { accessorKey: "counter_sales_code", header: "Counter Code" },
  { accessorKey: "invoice_date", header: "Invoice Date" },
  { accessorKey: "total_invoice_value", header: "Invoice Value" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "payment_method", header: "Payment" },
];
