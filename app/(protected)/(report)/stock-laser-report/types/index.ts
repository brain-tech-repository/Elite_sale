import { z } from "zod";

export const salesFilterSchema = z.object({
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
  warehouse: z.string().optional(),
  brand_id: z.string().optional(),
  material_type: z.string().optional(), // Changed from material_group
  material: z.string().optional(),
});

export type SalesFilterFormValues = z.infer<typeof salesFilterSchema>;

export type SalesFilterPayload = {
  fromdate?: string;
  todate?: string;
  warehouse_id?: string;
  brand_id?: string;
  material_type_id?: string;
  material_id?: string; // Changed to optional to prevent strict mapping errors
  page?: number;
  length?: number;
};

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
