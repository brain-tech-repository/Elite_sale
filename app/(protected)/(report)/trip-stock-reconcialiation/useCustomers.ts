// import { useQuery } from "@tanstack/react-query";
// // import api from "@/utils/api"; // ✅ Use your custom client
// import { ApiResponse, Warehouse, MaterialType, Brand, Material } from "./types";
// import api from "@/lib/apiClient";
// import { StockLedgerResponse, SalesFilterPayload } from "./types";

// /**
//  * NOTE: Since your `api` client uses a baseURL, we only use the relative paths here.
//  * Paths: /warehouse, /material-type, /brand, /material
//  */

// export const useWarehouses = () => {
//   return useQuery({
//     queryKey: ["warehouses"],
//     queryFn: async () => {
//       const { data } = await api.get<ApiResponse<Warehouse>>("/warehouse");
//       return data.data.map((w) => ({
//         label: w.warehouse_name,
//         value: String(w.id),
//       }));
//     },
//   });
// };

// export const useMaterialTypes = () => {
//   return useQuery({
//     queryKey: ["material-types"],
//     queryFn: async () => {
//       const { data } =
//         await api.get<ApiResponse<MaterialType>>("/material-type");
//       return data.data.map((t) => ({
//         label: t.type,
//         value: String(t.id),
//       }));
//     },
//   });
// };

// // Update the parameter type to include undefined
// export const useBrands = (typeIds: string | undefined) => {
//   return useQuery({
//     queryKey: ["brands", typeIds],
//     enabled: !!typeIds, // Query only runs if typeIds is truthy
//     queryFn: async () => {
//       // TypeScript now knows typeIds is a string here because of enabled check
//       const { data } = await api.post<ApiResponse<Brand>>("/brand", {
//         type: typeIds,
//       });
//       return data.data.map((b) => ({
//         label: b.brand_name || `Brand ${b.id}`,
//         value: String(b.id),
//       }));
//     },
//   });
// };

// export const useMaterials = (brandIds: string | undefined) => {
//   return useQuery({
//     queryKey: ["materials", brandIds],
//     enabled: !!brandIds,
//     queryFn: async () => {
//       const { data } = await api.post<ApiResponse<Material>>("/material", {
//         brand: brandIds,
//       });
//       return data.data.map((m) => ({
//         label: m.material_name,
//         value: String(m.id),
//       }));
//     },
//   });
// };

// import { useInfiniteQuery } from "@tanstack/react-query";

// export const useStockLedgerReport = (payload: SalesFilterPayload) => {
//   return useInfiniteQuery({
//     queryKey: ["stock-ledger", payload],
//     queryFn: async ({ pageParam = 1 }) => {
//       const apiPayload = {
//         warehouse: payload.warehouse_id,
//         material: payload.material_id,
//         brand: payload.brand_id,
//         type: payload.material_type_id,
//         fromdate: payload.fromdate,
//         todate: payload.todate,
//         page: pageParam, // Send current page to API
//         length: 10, // Per page count
//       };

//       const { data } = await api.post<StockLedgerResponse>(
//         "/stock-ledger-report",
//         apiPayload,
//       );
//       return data;
//     },
//     initialPageParam: 1,
//     // Determine if there is another page based on current vs total
//     getNextPageParam: (lastPage) => {
//       const current = lastPage.pagination.current_page;
//       const total = lastPage.pagination.total_pages;
//       return current < total ? current + 1 : undefined;
//     },
//     enabled: !!payload.fromdate && !!payload.todate,
//   });
// };
