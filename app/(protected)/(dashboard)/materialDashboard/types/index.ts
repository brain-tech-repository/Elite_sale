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

export type SalesFilterPayload = {
  [key: string]: string | number | Date | null | undefined;
  fromdate?: string;
  todate?: string;

  region_id?: string;
  warehouse_id?: string;
  sales_area_id?: string;
  route_id?: string;

  page?: number;
  length?: number;
};

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
/*                            GENERIC API RESPONSE                            */
/* ========================================================================== */

export interface ApiResponse<T = any> {
  status: boolean;
  message?: string;
  data: T;
}

/* ========================================================================== */
/* ========================================================================== */

export interface SelectOption {
  value: string;
  label: string;
}

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

export type MaterialPerformanceResponse = {
  list: any[];
  pagination: {
    current_page: number;
    total_pages: number;
    next_page_url?: string | null;
  };
};
