import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { DashboardFilters, DashboardStatsResponse } from "./types";
import { ColumnDef } from "@tanstack/react-table";

// Define the type for the expected filter payload

export function useDashboardStats(filters?: DashboardFilters) {
  return useQuery({
    // Add `filters` to the queryKey so React Query refetches automatically when dates change
    queryKey: ["dashboard-stats", filters],
    queryFn: async () => {
      // Pass the filters as the POST body payload
      const { data } = await api.post<DashboardStatsResponse>(
        "get_count_data",
        filters || {},
      );

      // ✅ safety check
      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch dashboard data");
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// 1. The Hook
export function usePendingRouteInvoices(
  filters?: DashboardFilters,
  enabled: boolean = false,
) {
  return useQuery({
    queryKey: ["pending-route-invoices-details", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post(
        "get_total_efris_pending_route_invoice",
        payload,
      );

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch details");
      }

      return data.Result || [];
    },
    enabled: enabled, // Only runs when the modal is open
  });
}

// 2. The Table Columns

// Add to usEfris.ts

export function useSyncStockAdjustment(
  filters?: any,
  enabled: boolean = false,
) {
  return useQuery({
    queryKey: ["get_total_stock_adjustment", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post(
        "get_total_stock_adjustment", // Ensure this matches your actual endpoint
        payload,
      );

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch details");
      }

      return data.Result || [];
    },
    enabled: enabled,
  });
}

export function usePendingStockAdjustment(
  filters?: any,
  enabled: boolean = false,
) {
  return useQuery({
    queryKey: ["get_total_stock_adjustment_pending", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post(
        "get_total_stock_adjustment_pending", // Updated API endpoint
        payload,
      );

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch details");
      }

      return data.Result || [];
    },
    enabled: enabled,
  });
}

export function useSyncRouteInvoices(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["get_total_efris_sync_route_invoice", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post(
        "get_total_efris_Sync_Route_Invoice",
        payload,
      );

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch sync route invoices");
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function usePendingGRN(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["pending-grn", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_total_pending_grn", payload);

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch sync route invoices");
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function useSyncGRN(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["sync-grn", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_total_sync_grn", payload);

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch sync GRN");
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function usePendingRouteReturn(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["pending-route-return", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_pending_route_return", payload);

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch pending route return");
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function usePendingOrderReturn(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["pending-order-return", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_pending_order_return", payload);

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch pending order return");
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function useSyncOrderReturn(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["sync-order-return", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_sync_order_return", payload);

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch sync order return");
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function usePendingSalesInvoice(
  filters?: any,
  enabled: boolean = false,
) {
  return useQuery({
    queryKey: ["pending-sales-invoice", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_pending_sales_invoice", payload);

      if (data.Status !== 1) {
        throw new Error(
          data.Message || "Failed to fetch pending sales invoice",
        );
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function useSyncSalesInvoice(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["sync-sales-invoice", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_sync_sales_invoice", payload);

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch sync sales invoice");
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function usePendingCounterSales(
  filters?: any,
  enabled: boolean = false,
) {
  return useQuery({
    queryKey: ["pending-counter-sales", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_pending_counter_sales", payload);

      if (data.Status !== 1) {
        throw new Error(
          data.Message || "Failed to fetch pending counter sales",
        );
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function useSyncCounterSales(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["sync-counter-sales", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_sync_counter_sales", payload);

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch sync counter sales");
      }

      return data.Result || [];
    },
    enabled,
  });
}

export function useSyncRouteReturn(filters?: any, enabled: boolean = false) {
  return useQuery({
    queryKey: ["sync-route-return", filters],
    queryFn: async () => {
      const payload = {
        startDate: filters?.startDate || "",
        endDate: filters?.endDate || "",
      };

      const { data } = await api.post("/get_sync_route_return", payload);

      if (data.Status !== 1) {
        throw new Error(data.Message || "Failed to fetch sync route return");
      }

      return data.Result || [];
    },
    enabled,
  });
}
