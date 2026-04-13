export type Section = {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
};

export type OrderSummaryResponse = {
  success: boolean;
  message: string;
  data: {
    order: { count: number; total: number };
    approved: { count: number; total: number };
    pending: { count: number; total: number };
    delivery: { count: number; total: number };
    invoice: { count: number; total: number };
  };
};

export type OrderSummaryFilters = {
  order_type?: number;
  from_date?: string;
  to_date?: string;
  specific_selection?: number;
};

export type OrderTableItem = {
  order_number: string;
  order_date: string | null;
  approved_date: string | null;
  customer_name: string;
  order_total: string;
  invoice_total: string;
};

export type OrderTableResponse = {
  success: boolean;
  message: string;
  data: OrderTableItem[];
  headers: string[]; // ✅ ADD THIS
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
};
