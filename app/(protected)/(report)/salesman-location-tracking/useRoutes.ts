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
