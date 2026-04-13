// types/api.ts

import * as z from "zod";

/* =========================
   COMMON API RESPONSE
========================= */
export interface EFRISResponse {
  Result: number;
  Status: number;
  Message: string;
}

/* =========================
   DASHBOARD STATS
========================= */
export interface DashboardStats {
  pendingRouteInvoice: number;
  syncRouteInvoice: number;
  totalStockAdjustment: number;
  pendingStockAdjustment: number;
}

export type DashboardStatsResponse = {
  total_pending_efris_invoice: number;
  total_sync_efris_invoice: number;

  total_stock_adjustment: number;
  total_stock_adjustment_pending: number;

  total_pending_grn: number;
  total_sync_grn: number;

  total_pending_route_return: number;
  total_sync_route_return: number;

  total_pending_counter_sales: number;
  total_sync_counter_sales: number;

  total_pending_sales_invoice: number;
  total_sync_sales_invoice: number;

  total_pending_order_return: number;
  total_sync_order_return: number;

  Status: number;
  Message: string;
};

/* =========================
   FILTER TYPES
========================= */
export type DashboardFilters = {
  startDate?: string;
  endDate?: string;
};

/* =========================
   FORM SCHEMA (ZOD)
========================= */
export const dashboardFilterSchema = z.object({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

/* =========================
   FORM VALUES TYPE (AUTO FROM ZOD)
========================= */
export type DashboardFilterFormValues = z.infer<typeof dashboardFilterSchema>;
