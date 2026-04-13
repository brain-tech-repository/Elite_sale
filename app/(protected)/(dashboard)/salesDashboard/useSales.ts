import api from "@/lib/apiClient";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ChartSalesData,
  DashboardSummaryResponse,
  MasterApiResponse,
  SalesTrendItem,
  SalesTrendResponse,
  SelectOption,
} from "./types";
import React from "react";

/* ========================================================================== */
/* HELPER FUNCTIONS                             */
/* ========================================================================== */

const mapOptions = (data: MasterApiResponse): SelectOption[] => {
  if (!data?.Result) return [];
  return data.Result.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
};

const transformChartData = (data: SalesTrendItem[]): ChartSalesData[] => {
  return data.map((item) => ({
    month: item.label,
    desktop: item.y,
  }));
};

/* ========================================================================== */
/* API CALLS                                  */
/* ========================================================================== */

const getDashboardSummaryCards = async (
  params?: any,
): Promise<DashboardSummaryResponse> => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const { data } = await api.post(`get_dashboard_summary_cards${query}`);
  return data;
};

const getYearlySalesTrend = async (
  year: string,
  filters?: any,
): Promise<SalesTrendResponse> => {
  const { month, ...restFilters } = filters || {};
  const query = new URLSearchParams({ year, ...restFilters }).toString();
  const { data } = await api.get(`get_yearly_sales_trend?${query}`);
  return data;
};

const getMonthlySalesTrend = async (
  year: string,
  month?: string | null,
  filters?: any,
): Promise<SalesTrendResponse> => {
  const query = new URLSearchParams({
    year,
    month: month || "",
    ...filters,
  }).toString();
  const { data } = await api.get(`get_monthly_sales_trend?${query}`);
  return data;
};

const fetchPerformance = async (endpoint: string, params: any) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.post(`${endpoint}?${query}`);
  return data;
};

const fetchPerformances = async (endpoint: string, params: any) => {
  const { data } = await api.post(endpoint, params);
  return data;
};

/* ========================================================================== */
/* TANSTACK QUERY HOOKS                            */
/* ========================================================================== */

export const useDashboardSummary = (filters?: any, enabled = true) => {
  return useQuery<DashboardSummaryResponse>({
    queryKey: ["dashboard-summary", JSON.stringify(filters)],
    queryFn: () => getDashboardSummaryCards(filters),
    staleTime: 1000 * 60 * 5,
    enabled,
    refetchOnMount: false, // Prevents refetching just because the tab/component was clicked
    refetchOnWindowFocus: false,
  });
};

export const useYearlySalesTrend = (
  year: string,
  filters?: any,
  enabled = true,
) => {
  const yearlyFilters = React.useMemo(() => {
    if (!filters) return {};
    const { month, ...rest } = filters;
    return rest;
  }, [filters]);

  return useQuery({
    queryKey: ["yearly-sales-trend", year, JSON.stringify(yearlyFilters)],
    queryFn: () => getYearlySalesTrend(year, yearlyFilters),
    select: (data) => transformChartData(data.Result),
    enabled: enabled && !!year,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10, // 10 minutes: Consider data fresh for 10 mins
    gcTime: 1000 * 60 * 15, // 15 minutes: Keep in cache even if unused
  });
};

export const useMonthlySalesTrend = (
  year: string,
  month?: string | null,
  filters?: any,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["monthly-sales-trend", year, month, JSON.stringify(filters)],
    queryFn: () => getMonthlySalesTrend(year, month, filters),
    select: (data) => transformChartData(data.Result),
    enabled: enabled && !!year && !!month,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10, // 10 minutes: Consider data fresh for 10 mins
    gcTime: 1000 * 60 * 15, // 15 minutes: Keep in cache even if unused
  });
};

/* ========================================================================== */
/* PERFORMANCE ANALYTICS HOOKS                        */
/* ========================================================================== */

export const useRegionPerformance = (filters: any, enabled = true) => {
  return useQuery({
    queryKey: ["region-performance", JSON.stringify(filters)],
    queryFn: async () => {
      const cleanedParams = Object.fromEntries(
        Object.entries(filters || {}).filter(
          ([_, v]) => v !== "" && v !== null && v !== undefined,
        ),
      );
      const res = await fetchPerformance(
        "get_region_performance",
        cleanedParams,
      );
      return res?.Result || [];
    },
    enabled: enabled && !!filters,
    // staleTime: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 10, // 10 minutes: Consider data fresh for 10 mins
    gcTime: 1000 * 60 * 15, // 15 minutes: Keep in cache even if unused
  });
};

export const useBrandPerformance = (filters: any, enabled = true) => {
  return useQuery({
    queryKey: ["brand-performance", JSON.stringify(filters)],
    queryFn: async () => {
      const res = await fetchPerformance("get_brand_performance", filters);
      return res?.Result || [];
    },
    enabled: enabled && !!filters,
    staleTime: 1000 * 60 * 10, // 10 minutes: Consider data fresh for 10 mins
    gcTime: 1000 * 60 * 15, // 15 minutes: Keep in cache even if unused
  });
};

export const useMaterialGroupPerformance = (filters: any, enabled = true) => {
  return useQuery({
    queryKey: ["material-group-performance", JSON.stringify(filters)],
    queryFn: async () => {
      const res = await fetchPerformance(
        "get_material_group_performance",
        filters,
      );
      return res?.Result || [];
    },
    enabled: enabled && !!filters,
    staleTime: 1000 * 60 * 10, // 10 minutes: Consider data fresh for 10 mins
    gcTime: 1000 * 60 * 15, // 15 minutes: Keep in cache even if unused
  });
};

export const useCustomerSegmentPerformance = (filters: any, enabled = true) => {
  return useQuery({
    queryKey: ["customer-segment-performance", JSON.stringify(filters)],
    queryFn: async () => {
      const res = await fetchPerformances(
        "get_customer_segment_performance",
        filters,
      );
      return res?.Result || [];
    },
    enabled: enabled && !!filters,
    staleTime: 1000 * 60 * 10, // 10 minutes: Consider data fresh for 10 mins
    gcTime: 1000 * 60 * 15, // 15 minutes: Keep in cache even if unused
  });
};

/* ========================================================================== */
/* MISC HOOKS                                   */
/* ========================================================================== */

export const useDistributorChart = (
  year?: string,
  month?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["distributor-chart", year, month],
    queryFn: async () => {
      const { data } = await api.post("distributor-chart-data", {
        params: { year, month },
      });
      const labels = data?.data?.labels || [];
      const target = data?.data?.datasets?.[0]?.data || [];
      const achieved = data?.data?.datasets?.[1]?.data || [];

      return labels.map((name: string, index: number) => ({
        name,
        Target: target[index] || 0,
        Achievment: achieved[index] || 0,
      }));
    },
    enabled: enabled && !!year,
    staleTime: 1000 * 60 * 10, // 10 minutes: Consider data fresh for 10 mins
    gcTime: 1000 * 60 * 15, // 15 minutes: Keep in cache even if unused
  });
};

// Generic Master Hook (used by dropdowns)
const useMasterDropdown = (
  key: string,
  endpoint: string,
  params: Record<string, any>,
  enabled = true,
) => {
  return useQuery<SelectOption[]>({
    queryKey: [key, JSON.stringify(params)],
    queryFn: async () => {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== "" && value !== undefined,
        ),
      );
      const query = new URLSearchParams(filteredParams).toString();
      const { data } = await api.post(`${endpoint}?${query}`);
      return mapOptions(data);
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRegions = (search: string) =>
  useMasterDropdown("regions", "get_regions_list", { search });
export const useWarehouses = (regionId: string, search: string) =>
  useMasterDropdown(
    "warehouses",
    "get_warehouses_list",
    { region_id: regionId, search },
    !!regionId,
  );
export const useMaterialGroups = (search: string) =>
  useMasterDropdown("material-groups", "get_material_types_list", { search });
export const useBrands = (materialTypeId: string, search: string) =>
  useMasterDropdown(
    "brands",
    "get_brands_list",
    { material_type_id: materialTypeId, search },
    !!materialTypeId,
  );
export const useMaterials = (
  materialTypeId: string,
  brandId: string,
  search: string,
) =>
  useMasterDropdown(
    "materials",
    "get_materials_list",
    {
      material_type_id: materialTypeId,
      brand_id: brandId,
      search,
    },
    !!materialTypeId, // Only enable if at least the type is selected
  );
