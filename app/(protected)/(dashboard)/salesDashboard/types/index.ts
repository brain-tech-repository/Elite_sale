import { z } from "zod";

/* ========================================================================== */
/*                               FILTER SCHEMA                                */
/* ========================================================================== */

export const salesFilterSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),

  region: z.string().optional(),

  warehouse: z.string().optional(),

  Brand: z.string().optional(),

  material_group: z.string().optional(),

  material: z.string().optional(),
});

export type SalesFilterFormValues = z.infer<typeof salesFilterSchema>;

/* ========================================================================== */
/*                               FILTER PAYLOAD                               */
/* ========================================================================== */

export interface SalesFilterPayload {
  fromdate: string;
  todate: string;

  region_id: string;
  warehouse_id: string;
  brand_id: string;
  material_type_id: string;
  material_id: string;
}

/* ========================================================================== */
/*                           DASHBOARD SUMMARY TYPES                          */
/* ========================================================================== */

export interface DashboardSummaryResult {
  // Sales
  today_sales: number;
  today_sales_percentage: number;
  total_sales: number;
  total_sales_percentage: number;

  // Collections
  today_collection: number;
  today_collection_percentage: number;
  total_collection: number;
  total_collection_percentage: number;

  // Returns
  today_return: number;
  today_return_percentage: number;
  total_return: number;
  total_return_percentage: number;
}

export interface DashboardSummaryResponse {
  API_Status: number;
  Message: string;
  Result: DashboardSummaryResult;
}

/* ========================================================================== */
/*                             SALES TREND TYPES                              */
/* ========================================================================== */

export interface SalesTrendItem {
  label: string;
  y: number;
}

export interface SalesTrendResponse {
  API_Status: number;
  Message: string;
  Result: SalesTrendItem[];
}

/* ========================================================================== */
/*                             CHART DATA TYPES                               */
/* ========================================================================== */

export interface ChartSalesData {
  month: string;
  desktop: number;
}

/* ========================================================================== */
/*                             MASTER API TYPES                               */
/* ========================================================================== */

export interface MasterItem {
  id: number;
  name: string;
}

export interface MasterApiResponse {
  API_Status: number;
  Message: string;
  Result: MasterItem[];
}

/* ========================================================================== */
/*                             UI SELECT TYPES                                */
/* ========================================================================== */

export interface AutoCompleteOption {
  value: number | string;
  label: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
