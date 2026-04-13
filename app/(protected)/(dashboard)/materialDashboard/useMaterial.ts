import api from "@/lib/apiClient";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  SelectOption,
  SalesFilterPayload,
  MasterApiResponse,
  DashboardSummaryResponse,
} from "./types";

/* ========================================================================== */
/* HELPER FUNCTIONS                             */
/* ========================================================================== */

/**
 * Clean and transform filters for URL Search Params
 */
const prepareParams = (filters: any) => {
  return Object.entries(filters || {}).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};

const transformMaterialFilters = (filters?: SalesFilterPayload) => {
  if (!filters) return {};
  return {
    from_date: filters.fromdate,
    to_date: filters.todate,
    warehouse: filters.warehouse_id,
    region: filters.region_id,
    brand: filters.brand_id,
    mat_group: filters.material_type_id,
    mat_list: filters.material_id,
  };
};

const mapOptions = (data: MasterApiResponse): SelectOption[] => {
  if (!data?.Result) return [];
  return data.Result.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
};

const fetchMaster = async (
  endpoint: string,
  params: Record<string, any> = {},
): Promise<MasterApiResponse> => {
  const query = new URLSearchParams(
    transformMaterialFilters(params) as any,
  ).toString();
  const { data } = await api.post(`${endpoint}?${query}`);
  return data;
};

/* ========================================================================== */
/* GENERIC DROPDOWN HOOK                            */
/* ========================================================================== */

const useMasterDropdown = (
  key: string,
  endpoint: string,
  params: Record<string, any>,
  enabled = true,
) => {
  return useQuery<SelectOption[]>({
    queryKey: [key, ...Object.values(params)],
    queryFn: async () => {
      const data = await fetchMaster(endpoint, params);
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
    { material_type_id: materialTypeId, brand_id: brandId, search },
    !!materialTypeId,
  );

/* ========================================================================== */
/* MATERIAL ANALYSIS HOOKS                          */
/* ========================================================================== */

const BASE = "/material_analysis";

/**
 * Material Performance Table Hook
 */
export const useMaterialPerformance = (
  filters?: SalesFilterPayload,
  page: number = 1,
  length: number = 10,
) =>
  useQuery({
    queryKey: ["material-performance", filters, page, length],
    queryFn: async () => {
      const query = new URLSearchParams({
        ...prepareParams(filters),
        page: String(page),
        length: String(length),
      }).toString();

      const { data } = await api.post(
        `${BASE}/fetch_material_performance?${query}`,
      );
      return {
        tableData: data?.data ?? [],
        pagination: data?.pagination ?? {},
      };
    },
    // We use keepPreviousData for pagination, but in the component
    // we manually trigger skeleton when page is 1
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

/**
 * Active SKUs Table Hook
 */
export const useActiveSkus = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["active-skus", filters],
    queryFn: async () => {
      const query = new URLSearchParams(prepareParams(filters)).toString();
      const { data } = await api.post(`${BASE}/fetch_active_skus?${query}`);
      return data?.data || [];
    },
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

/**
 * Inactive SKUs Table Hook
 */
export const useInactiveSkus = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["inactive-skus", filters],
    queryFn: async () => {
      const query = new URLSearchParams(prepareParams(filters)).toString();
      const { data } = await api.post(`${BASE}/fetch_inactive_skus?${query}`);
      return data?.data || [];
    },
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes even if unused
    refetchOnWindowFocus: false,
  });

/**
 * Summary Cards Hook
 */
export const useMaterialSummary = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["material-summary", filters],
    queryFn: async () => {
      const query = new URLSearchParams(prepareParams(filters)).toString();
      const { data } = await api.post(`${BASE}/fetch_summary_cards?${query}`);
      return data?.data;
    },
    refetchOnWindowFocus: false,
  });

/**
 * Volume Growth Chart Hook
 */
export const useVolumeGrowthChart = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["volume-growth", filters],
    queryFn: async () => {
      const query = new URLSearchParams(prepareParams(filters)).toString();
      const { data } = await api.post(
        `${BASE}/fetch_volume_growth_charts?${query}`,
      );
      return data?.data || { daily: [], monthly: [], yearly: [] };
    },
    refetchOnWindowFocus: false,
  });

/**
 * Value Growth Chart Hook
 */
export const useValueGrowthChart = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["value-growth", filters],
    queryFn: async () => {
      const query = new URLSearchParams(prepareParams(filters)).toString();
      const { data } = await api.post(
        `${BASE}/fetch_value_growth_charts?${query}`,
      );
      return data?.data || { daily: [], monthly: [], yearly: [] };
    },
    refetchOnWindowFocus: false,
  });

/**
 * Top Materials By Volume Hook
 */
export const useTopMaterialByVolume = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["top-material-volume", filters],
    queryFn: async () => {
      const query = new URLSearchParams(prepareParams(filters)).toString();
      const { data } = await api.post(
        `${BASE}/fetch_top_material_by_volume?${query}`,
      );
      return data?.data || [];
    },
    refetchOnWindowFocus: false,
  });

/**
 * Top Materials By Value Hook
 */
export const useTopMaterialByValue = (filters?: SalesFilterPayload) =>
  useQuery({
    queryKey: ["top-material-value", filters],
    queryFn: async () => {
      const query = new URLSearchParams(prepareParams(filters)).toString();
      const { data } = await api.post(
        `${BASE}/fetch_top_material_by_value?${query}`,
      );
      return data?.data || [];
    },
    refetchOnWindowFocus: false,
  });
