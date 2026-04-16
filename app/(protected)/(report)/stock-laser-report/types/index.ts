import { z } from "zod";

// Base API Response wrapper
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T[];
}

export interface Warehouse {
  id: number;
  warehouse_name: string;
  warehouse_code: string;
}

export interface MaterialType {
  id: number;
  type: string;
}

export interface Brand {
  id: number;
  brand_name: string; // Adjusted based on common patterns
}

export interface Material {
  id: number;
  material_name: string;
  material_code: string;
}

// Form Schema
export const salesFilterSchema = z.object({
  dateRange: z.object(
    {
      from: z.date(),
      to: z.date(),
    },
    {
      message: "Date Range is required",
    },
  ),
  warehouse: z.string().min(1, "Warehouse is required"),
  brand_id: z.string().min(1, "Brand is required"),
  material_type: z.string().min(1, "Material type is required"),
  material: z.string().min(1, "Material is required"),
});

export type SalesFilterFormValues = z.infer<typeof salesFilterSchema>;

export interface SalesFilterPayload {
  fromdate: string;
  todate: string;
  warehouse_id: string;
  brand_id: string;
  material_type_id: string;
  material_id: string;
}

export interface StockLedgerItem {
  material_code: string;
  material_name: string;
  uom: string;
  unit_price: string;
  opening_qty: string;
  receipt_qty: string;
  issued_qty: string;
  closing_qty: string;
  closing_value: string;
  packing_size: number;
  ctn: number;
  dzn: number;
  pcs: number;
}

export interface StockLedgerResponse {
  status: boolean;
  message: string;
  data: StockLedgerItem[];
  total_closing_value: string;
}

// old

export interface SelectOption {
  value: string;
  label: string;
}

export type PerformanceRow = {
  material_code: string;
  material_name: string;
  uom: string;
  unit_price: number | string;
  opening_qty: number | string;
  receipt_qty: number | string;
  issued_qty: number | string;
  closing_qty: number | string;
  closing_value: number | string;
  packing_size: number | string;
  ctn: number | string;
  dzn: number | string;
  pcs: number | string;
};
