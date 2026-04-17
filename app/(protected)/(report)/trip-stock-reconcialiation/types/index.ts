import { z } from "zod";

/* ---------------------------------- */
/* COMMON API RESPONSE */
/* ---------------------------------- */
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T[];
}

/* ---------------------------------- */
/* TRIP MASTER */
/* ---------------------------------- */
export interface Trip {
  trip_number: string;
  trip_date: string;
  route: string;
  salesman: string;
}

/* ---------------------------------- */
/* FILTER PAYLOAD */
/* ---------------------------------- */
export interface SalesFilterPayload {
  trip_number: string;
  trip_date: string;
  route: string;
  salesman: string;
}

/* ---------------------------------- */
/* SELECT OPTION */
/* ---------------------------------- */
export interface SelectOption {
  value: string;
  label: string;
}

/* ---------------------------------- */
/* AUTO FILL STATIC DATA TYPE */
/* ---------------------------------- */
export interface TripOption extends SelectOption {
  trip_date: string;
  route: string;
  salesman: string;
}

/* ---------------------------------- */
/* TABLE RESPONSE (IF REQUIRED) */
/* ---------------------------------- */
export interface TripReportItem {
  trip_number: string;
  trip_date: string;
  route: string;
  salesman: string;
}

export interface TripReportResponse {
  status: boolean;
  message: string;
  data: TripReportItem[];
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export const salesFilterSchema = z.object({
  trip_number: z.string().min(1, "Trip Number Required"),
  trip_date: z.string(),
  route: z.string(),
  salesman: z.string(),
});

export type SalesFilterFormValues = z.infer<typeof salesFilterSchema>;

export interface SalesFilterPayload {
  trip_number: string;
  trip_date: string;
  route: string;
  salesman: string;
}

export interface PerformanceRow {
  material_code: string;
  material_name: string;
  pcs_in_carton: number;
  unit_price: number;

  loaded_qty: number;
  loaded_ctn: number;
  loaded_dzn: number;
  loaded_pcs: number;
  loaded_value: number;

  sold_qty: number;
  sold_ctn: number;
  sold_dzn: number;
  sold_pcs: number;
  sold_value: number;

  good_qty: number;
  good_ctn: number;
  good_dzn: number;
  good_pcs: number;
  return_value: number;

  bad_qty: number;
  bad_ctn: number;
  bad_dzn: number;
  bad_pcs: number;
  bad_value: number;

  total_customer: number;

  damage_qty: number;
  damage_ctn: number;
  damage_dzn: number;
  damage_pcs: number;
  damage_value: number;

  closing_qty: number;
  closing_ctn: number;
  closing_dzn: number;
  closing_pcs: number;
  closing_value: number;

  net_stock_qty: number;
  net_stock_ctn: number;
  net_stock_dzn: number;
  net_stock_pcs: number;
  net_stock_value: number;
}
