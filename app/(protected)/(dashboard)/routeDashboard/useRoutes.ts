import api from "@/lib/apiClient";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApiResponse, SelectOption, SalesFilterPayload } from "./types";

/* ========================================================================== */
/* HELPER FUNCTIONS                             */
/* ========================================================================== */

const mapOptions = (data: ApiResponse<any[]>): SelectOption[] => {
  if (!data?.data) return [];
  return data.data.map((item: any) => ({
    value: String(item.id || ""),
    label:
      item.region_name ??
      item.sub_region_name ??
      item.warehouse_name ??
      item.route_name ??
      "Unknown",
  }));
};

const serializeFilters = (
  filters?: SalesFilterPayload,
): Record<string, string> => {
  if (!filters) return {};
  return Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value instanceof Date ? value.toISOString() : String(value);
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};

const fetchMaster = async (
  endpoint: string,
  params: Record<string, string> = {},
) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${endpoint}?${query}` : endpoint;
  const { data } = await api.get(url);
  return data;
};

/* ========================================================================== */
/* FILTER DROPDOWN HOOKS                           */
/* ========================================================================== */

export const useRegions = () =>
  useQuery<SelectOption[]>({
    queryKey: ["regions"],
    queryFn: async () => {
      const data = await fetchMaster("/route-analysis-dropdowns/regions");
      return mapOptions(data);
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

export const useSubregion = (regionId?: string) =>
  useQuery<SelectOption[]>({
    queryKey: ["sub-region", regionId],
    queryFn: async () => {
      const data = await fetchMaster("/route-analysis-dropdowns/sub-regions", {
        region_id: regionId || "",
      });
      return mapOptions(data);
    },
    enabled: !!regionId,
    refetchOnWindowFocus: false,
  });

export const useWarehouses = (warehouseId?: string) =>
  useQuery<SelectOption[]>({
    queryKey: ["warehouse", warehouseId],
    queryFn: async () => {
      const data = await fetchMaster("/route-analysis-dropdowns/warehouses", {
        warehouse_id: warehouseId || "",
      });
      return mapOptions(data);
    },
    enabled: !!warehouseId,
    refetchOnWindowFocus: false,
  });

export const useRoutes = (salesAreaId?: string) =>
  useQuery<SelectOption[]>({
    queryKey: ["routes", salesAreaId],
    queryFn: async () => {
      const data = await fetchMaster("/route-analysis-dropdowns/routes", {
        sales_area_id: salesAreaId || "",
      });
      return mapOptions(data);
    },
    enabled: !!salesAreaId,
    refetchOnWindowFocus: false,
  });

/* ========================================================================== */
/* DASHBOARD SUMMARY                              */
/* ========================================================================== */

export const useDashboardSummary = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["customer-summary", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(`/route-analysis/summary?${query}`);
      return data;
    },
    refetchOnWindowFocus: false,
  });

export const useGrowthPerformance = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["region-performance", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(
        `/route-analysis/route-completion?${query}`,
      );
      return data?.data || null;
    },
    refetchOnWindowFocus: false,
  });

export const useMonthlyTrend = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["route-monthly-trend", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.post(`/route-analysis/monthly-trend?${query}`);

      const completion = data?.data?.completion || [];
      const success = data?.data?.success || [];
      const incompletion = data?.data?.incompletion || [];

      return completion.map((item: any, index: number) => ({
        name: item.label,
        completion: item.y || 0,
        success: success[index]?.y || 0,
        incompletion: incompletion[index]?.y || 0,
      }));
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

export const useMonthlyCompareDropSizeRevenue = (
  filters?: SalesFilterPayload,
) =>
  useQuery({
    queryKey: ["drop-size-revenue", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(
        `/route-analysis/drop-size-revenue?${query}`,
      );
      return (
        data?.data?.map((item: any) => ({
          month: item.label,
          desktop: item.y,
        })) || []
      );
    },
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

export const useMonthlyCompareDropSizeVolume = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["drop-size-volume", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(
        `/route-analysis/drop-size-volume?${query}`,
      );
      return (
        data?.data?.map((item: any) => ({
          month: item.label,
          desktop: item.y,
        })) || []
      );
    },
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused

    refetchOnWindowFocus: false,
  });

export const useRoutePerformance = (
  filters?: SalesFilterPayload,
  type: "routes" | "salesmen" = "routes",
) =>
  useQuery({
    queryKey: ["route-performance", JSON.stringify(filters), type],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const baseUrl =
        type === "salesmen"
          ? "/route-analysis/performance/salesmen"
          : "/route-analysis/performance/routes";

      const url = query ? `${baseUrl}?${query}` : baseUrl;
      const { data } = await api.get(url);

      return (
        data?.data?.table_data?.map((item: any) => ({
          route: item.name,
          totalSales: item.total_sales ?? 0,
          totalCollection: item.total_collection ?? 0,
          totalReturn: item.total_return ?? 0,
          totalExchange: item.total_exchange ?? 0,
        })) || []
      );
    },
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

export const useRoutePerformanceGraph = (
  filters?: SalesFilterPayload,
  type: "routes" | "salesmen" = "routes",
) =>
  useQuery({
    queryKey: ["route-performance-graph", JSON.stringify(filters), type],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const baseUrl =
        type === "salesmen"
          ? "/route-analysis/performance/salesmen"
          : "/route-analysis/performance/routes";

      const url = query ? `${baseUrl}?${query}` : baseUrl;
      const { data } = await api.get(url);
      return data?.data || {};
    },
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

export const useRouteExpense = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["route-expense", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(
        `/route-analysis/expense-analysis?${query}`,
      );

      return (
        data?.data?.table_data?.map((item: any) => ({
          route: item.route_name,
          totalExpense: item.total_expense ?? 0,
        })) || []
      );
    },
    refetchOnWindowFocus: false,
  });

export const useRouteExpenseGraph = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["route-expense-graph", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const url = query
        ? `/route-analysis/expense-analysis?${query}`
        : `/route-analysis/expense-analysis`;
      const { data } = await api.get(url);
      return data?.data || {};
    },

    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

export const useRouteWiseSales = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["route-sales", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.post(`/route-analysis/wise-sales?${query}`);

      return {
        tableData:
          data?.data?.map((item: any, index: number) => ({
            sno:
              (Number(filters?.page || 1) - 1) * Number(filters?.length || 10) +
              index +
              1,
            route: item.route_name,
            todaySales: item.today_sales ?? 0,
            yesterdaySales: item.yesterday_sales ?? 0,
            weeklySales: item.weekly_sales ?? 0,
            last14DaysSales: item.last_14_days_sales ?? 0,
            monthSales: item.month_sales ?? 0,
            quarterSales: item.quarter_sales ?? 0,
            yearSales: item.year_sales ?? 0,
          })) || [],
        pagination: data?.pagination,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

export const useRouteEfficiency = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["route-efficiency", JSON.stringify(filters)],
    queryFn: async () => {
      const params = serializeFilters(filters);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.post(
        `/route-analysis/efficiency-overview?${query}`,
      );

      return {
        tableData:
          data?.data?.map((item: any, index: number) => ({
            sno:
              (Number(filters?.page || 1) - 1) * Number(filters?.length || 10) +
              index +
              1,
            route: item.route_name,
            warehouse: item.warehouse_name,
            salesman: item.salesman_name,
            totalCustomer: item.total_customer ?? 0,
            totalVisitDays: item.total_visit_days ?? 0,
            plannedVisit: item.planned_visit ?? 0,
            unplanned_visit: item.unplanned_visit ?? 0,
            dropRate: item.drop_rate ?? 0,
            salesValue: item.sales_inv_value ?? 0,
            salesPerDay: item.sales_per_day ?? 0,
            totalCollection: item.total_collection ?? 0,
            collectionPerDay: item.collection_per_day ?? 0,
            pendingCollection: item.pending_collection ?? 0,
          })) || [],
        pagination: data?.pagination,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });
