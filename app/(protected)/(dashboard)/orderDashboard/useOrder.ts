import api from "@/lib/apiClient";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  OrderSummaryFilters,
  OrderSummaryResponse,
  OrderTableResponse,
} from "./types";

/* ================= TYPES ================= */

export type SelectOption = {
  value: string;
  label: string;
};

/* ================= HELPERS ================= */

const mapOrderTypes = (data: any): SelectOption[] => {
  if (!data?.data) return [];

  return data.data.map((item: any) => ({
    value: String(item.id),
    label: item.name,
  }));
};

const mapSpecificSelection = (data: any): SelectOption[] => {
  if (!data?.data) return [];

  return data.data.map((item: any) => ({
    value: String(item.id),
    label: item.label,
  }));
};

/* ================= HOOKS ================= */

/* ORDER TYPES */
export const useOrderTypes = () =>
  useQuery<SelectOption[]>({
    queryKey: ["order-types"],
    queryFn: async () => {
      const { data } = await api.get("/order-analysis/order-types");
      return mapOrderTypes(data);
    },
    staleTime: 1000 * 60 * 5,
  });

/* SPECIFIC SELECTION */
export const useSpecificSelection = (orderType?: string) =>
  useQuery<SelectOption[]>({
    queryKey: ["specific-selection", orderType],
    queryFn: async () => {
      const { data } = await api.post("/order-analysis/specific-selection", {
        order_type: orderType ? Number(orderType) : undefined,
      });
      return mapSpecificSelection(data);
    },
    enabled: !!orderType,
  });

/* ================= CHART ================= */

type ChartFilters = {
  order_type?: number;
  card_type?: string;
};

export const useOrderChart = (filters?: ChartFilters) =>
  useQuery({
    queryKey: ["order-chart", filters],

    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.order_type !== undefined) {
        params.append("order_type", String(filters.order_type));
      }

      if (filters?.card_type) {
        params.append("card_type", filters.card_type);
      }

      const { data } = await api.get(
        `/order-analysis/chart-data?${params.toString()}`,
      );

      return data;
    },

    enabled: !!filters?.order_type,
    refetchOnWindowFocus: false,
  });

/* ================= SUMMARY ================= */

export const useOrderSummary = (filters?: OrderSummaryFilters) =>
  useQuery({
    queryKey: ["order-summary", filters],

    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.order_type !== undefined) {
        params.append("order_type", String(filters.order_type));
      }

      if (filters?.from_date) {
        params.append("from_date", filters.from_date);
      }

      if (filters?.to_date) {
        params.append("to_date", filters.to_date);
      }

      if (filters?.specific_selection !== undefined) {
        params.append("specific_ids", String(filters.specific_selection));
      }

      const { data } = await api.get(
        `/order-analysis/summary-cards?${params.toString()}`,
      );

      return data as OrderSummaryResponse;
    },

    refetchOnWindowFocus: false,
  });

/* ================= TABLE ================= */

type TableFilters = OrderSummaryFilters & {
  page?: number;
  per_page?: number;
};

export const useOrderTable = (
  filters?: TableFilters & { card_type?: string },
) =>
  useQuery({
    queryKey: ["order-table", filters],

    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.order_type !== undefined) {
        params.append("order_type", String(filters.order_type));
      }

      if (filters?.from_date) {
        params.append("from_date", filters.from_date);
      }

      if (filters?.to_date) {
        params.append("to_date", filters.to_date);
      }

      if (filters?.page !== undefined) {
        params.append("page", String(filters.page));
      }

      if (filters?.per_page !== undefined) {
        params.append("per_page", String(filters.per_page));
      }

      if (filters?.card_type) {
        params.append("card_type", filters.card_type);
      }

      const { data } = await api.get(
        `/order-analysis/table-data?${params.toString()}`,
      );

      return data as OrderTableResponse;
    },
    placeholderData: keepPreviousData, // ✅ correct
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });
