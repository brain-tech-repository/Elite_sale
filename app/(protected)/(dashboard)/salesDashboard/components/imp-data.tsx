// import api from "@/lib/apiClient";
// import { useQuery } from "@tanstack/react-query";

// import {
//   AutoCompleteOption,
//   ChartSalesData,
//   DashboardSummaryResponse,
//   MasterApiResponse,
//   SalesTrendItem,
//   SalesTrendResponse,
//   SelectOption,
// } from "./types";
// import React from "react";

// /* ========================================================================== */
// /*                              HELPER FUNCTIONS                              */
// /* ========================================================================== */

// /**
//  * Convert Master API response to dropdown options
//  */
// const mapOptions = (data: MasterApiResponse): SelectOption[] => {
//   if (!data?.Result) return [];

//   return data.Result.map((item) => ({
//     value: String(item.id),
//     label: item.name,
//   }));
// };

// /**
//  * Convert sales trend API data to chart compatible data
//  */
// const transformChartData = (data: SalesTrendItem[]): ChartSalesData[] => {
//   return data.map((item) => ({
//     month: item.label,
//     desktop: item.y,
//   }));
// };

// /* ========================================================================== */
// /*                                 API CALLS                                  */
// /* ========================================================================== */

// /**
//  * Fetch dashboard summary cards
//  */
// const getDashboardSummaryCards = async (
//   params?: any,
// ): Promise<DashboardSummaryResponse> => {
//   const query = params ? `?${new URLSearchParams(params).toString()}` : "";

//   const { data } = await api.post(`get_dashboard_summary_cards${query}`);

//   return data;
// };

// /**
//  * Fetch yearly sales trend
//  */
// const getYearlySalesTrend = async (
//   year: string,
//   filters?: any,
// ): Promise<SalesTrendResponse> => {
//   const { month, ...restFilters } = filters || {};

//   const params = { year, ...restFilters };

//   const query = new URLSearchParams(params).toString();

//   const { data } = await api.post(`get_yearly_sales_trend?${query}`);

//   return data;
// };

// /**
//  * Fetch monthly sales trend
//  */
// const getMonthlySalesTrend = async (
//   year: string,
//   month?: string | null,
//   filters?: any,
// ): Promise<SalesTrendResponse> => {
//   const params = { year, month, ...filters };

//   const query = new URLSearchParams(params).toString();

//   const { data } = await api.post(`get_monthly_sales_trend?${query}`);

//   return data;
// };
// /**
//  * Generic master API fetcher
//  */
// const fetchMaster = async (
//   endpoint: string,
//   params: Record<string, any> = {},
// ): Promise<MasterApiResponse> => {
//   const filteredParams = Object.fromEntries(
//     Object.entries(params).filter(
//       ([_, value]) => value !== "" && value !== undefined,
//     ),
//   );

//   const query = new URLSearchParams(filteredParams).toString();

//   const { data } = await api.post(`${endpoint}?${query}`);

//   return data;
// };

// /**
//  * Generic performance API fetcher
//  */
// const fetchPerformances = async (endpoint: string, params: any) => {
//   const query = new URLSearchParams(params).toString();

//   const { data } = await api.get(`${endpoint}?${query}`);

//   return data;
// };
// const fetchPerformance = async (endpoint: string, params: any) => {
//   const { data } = await api.post(endpoint, params);
//   return data;
// };

// /* ========================================================================== */
// /*                           GENERIC MASTER DROPDOWN HOOK                     */
// /* ========================================================================== */

// const useMasterDropdown = (
//   key: string,
//   endpoint: string,
//   params: Record<string, any>,
//   enabled = true,
// ) => {
//   return useQuery<SelectOption[]>({
//     queryKey: [key, ...Object.values(params)],

//     queryFn: async () => {
//       const data = await fetchMaster(endpoint, params);
//       return mapOptions(data);
//     },

//     enabled,
//     staleTime: 1000 * 60 * 5,
//   });
// };

// /* ========================================================================== */
// /*                             MASTER DROPDOWN HOOKS                          */
// /* ========================================================================== */

// /**
//  * Regions Dropdown
//  */
// export const useRegions = (search: string) =>
//   useMasterDropdown("regions", "get_regions_list", { search });

// /**
//  * Warehouses Dropdown
//  */
// export const useWarehouses = (regionId: string, search: string) =>
//   useMasterDropdown(
//     "warehouses",
//     "get_warehouses_list",
//     { region_id: regionId, search },
//     !!regionId,
//   );

// /**
//  * Material Groups Dropdown
//  */
// export const useMaterialGroups = (search: string) =>
//   useMasterDropdown("material-groups", "get_material_types_list", { search });

// /**
//  * Brands Dropdown
//  */
// export const useBrands = (materialTypeId: string, search: string) =>
//   useMasterDropdown(
//     "brands",
//     "get_brands_list",
//     { material_type_id: materialTypeId, search },
//     !!materialTypeId,
//   );

// /**
//  * Materials Dropdown
//  */
// export const useMaterials = (
//   materialTypeId: string,
//   brandId: string,
//   search: string,
// ) =>
//   useMasterDropdown(
//     "materials",
//     "get_materials_list",
//     {
//       material_type_id: materialTypeId,
//       brand_id: brandId,
//       search,
//     },
//     !!materialTypeId,
//   );

// /* ========================================================================== */
// /*                             TANSTACK QUERY HOOKS                           */
// /* ========================================================================== */

// /**
//  * Dashboard Summary Hook
//  */
// export const useDashboardSummary = (filters?: any) => {
//   return useQuery<DashboardSummaryResponse>({
//     queryKey: ["dashboard-summary"], // ❗ removed filters

//     queryFn: () => getDashboardSummaryCards(filters),

//     enabled: false, // ❗ manual control

//     staleTime: 1000 * 60 * 5,
//   });
// };

// /**
//  * Yearly Sales Trend Hook
//  */
// export const useYearlySalesTrend = (year: string, filters?: any) => {
//   const yearlyFilters = React.useMemo(() => {
//     if (!filters) return {};
//     const { month, ...rest } = filters;
//     return rest;
//   }, [filters]);

//   return useQuery({
//     queryKey: ["yearly-sales-trend"], // ❗ removed dynamic

//     queryFn: () => getYearlySalesTrend(year, yearlyFilters),

//     select: (data) => transformChartData(data.Result),

//     enabled: false, // ❗ manual control
//   });
// };
// /**
//  * Monthly Sales Trend Hook
//  */
// export const useMonthlySalesTrend = (
//   year: string,
//   month?: string | null,
//   filters?: any,
// ) => {
//   return useQuery({
//     queryKey: ["monthly-sales-trend"], // ❗ fixed

//     queryFn: () => getMonthlySalesTrend(year, month, filters),

//     select: (data) => transformChartData(data.Result),

//     enabled: false, // ❗ manual
//   });
// };

// /* ========================================================================== */
// /*                         PERFORMANCE ANALYTICS HOOKS                        */
// /* ========================================================================== */

// /**
//  * Region Performance
//  */
// /* ================= PERFORMANCE HOOKS (UPDATED) ================= */

// // ✅ Region
// export const useRegionPerformance = (filters: any) => {
//   return useQuery({
//     queryKey: ["region-performance"], // ❗ no filters

//     queryFn: async () => {
//       const cleanedParams = Object.fromEntries(
//         Object.entries(filters || {}).filter(
//           ([_, v]) => v !== "" && v !== null && v !== undefined,
//         ),
//       );

//       const res = await fetchPerformance(
//         "get_region_performance",
//         cleanedParams,
//       );

//       return res || {};
//     },

//     enabled: false,
//     // ❗ manual control
//   });
// };

// // ✅ Brand
// export const useBrandPerformance = (filters: any) => {
//   return useQuery({
//     queryKey: ["brand-performance"],
//     queryFn: async () => {
//       const res = await fetchPerformance("get_brand_performance", filters);
//       return res || {};
//     },
//     enabled: false,
//   });
// };

// // ✅ Material
// export const useMaterialGroupPerformance = (filters: any) => {
//   return useQuery({
//     queryKey: ["material-group-performance"],
//     queryFn: async () => {
//       const res = await fetchPerformance(
//         "get_material_group_performance",
//         filters,
//       );
//       return res || {};
//     },
//     enabled: false,
//   });
// };

// // ✅ Customer
// export const useCustomerSegmentPerformance = (filters: any) => {
//   return useQuery({
//     queryKey: ["customer-segment-performance"],
//     queryFn: async () => {
//       const res = await fetchPerformance(
//         "get_customer_segment_performance",
//         filters,
//       );
//       return res || {};
//     },
//     enabled: false,
//   });
// };

// export const useRegionLinePerformance = (enabled = true) => {
//   return useQuery({
//     queryKey: ["region-line-performance"],
//     queryFn: () => fetchPerformance("get_region_performance", {}),
//     staleTime: Infinity, // ✅ no refetch
//     refetchOnWindowFocus: false, // ✅ no refetch on tab focus
//     refetchOnMount: false, // no filters
//     enabled,
//   });
// };

// export const useBrandLinePerformance = (enabled = true) => {
//   return useQuery({
//     queryKey: ["brand-line-performance"],
//     queryFn: () => fetchPerformance("get_brand_performance", {}),
//     staleTime: Infinity, // ✅ no refetch
//     refetchOnWindowFocus: false, // ✅ no refetch on tab focus
//     refetchOnMount: false,
//     enabled,
//   });
// };

// export const useMaterialLinePerformance = (enabled = true) => {
//   return useQuery({
//     queryKey: ["material-line-performance"],
//     queryFn: () => fetchPerformance("get_material_group_performance", {}),
//     staleTime: Infinity, // ✅ no refetch
//     refetchOnWindowFocus: false, // ✅ no refetch on tab focus
//     refetchOnMount: false,
//     enabled,
//   });
// };

// export const useCustomerLinePerformance = (enabled = true) => {
//   return useQuery({
//     queryKey: ["customer-line-performance"],
//     queryFn: () => fetchPerformances("get_customer_segment_performance", {}),
//     staleTime: Infinity, // ✅ no refetch
//     refetchOnWindowFocus: false, // ✅ no refetch on tab focus
//     refetchOnMount: false,
//     enabled,
//   });
// };

// /**
//  * Distributor Target vs Achieved Chart
//  */
// export const useDistributorChart = (
//   year?: string,
//   month?: string,
//   enabled = true,
// ) => {
//   return useQuery({
//     queryKey: ["distributor-chart", year, month], // ✅ cache per filter

//     queryFn: async () => {
//       const { data } = await api.post("distributor-chart-data", {
//         params: {
//           year,
//           month,
//         },
//       });

//       const labels = data?.data?.labels || [];
//       const target = data?.data?.datasets?.[0]?.data || [];
//       const achieved = data?.data?.datasets?.[1]?.data || [];

//       return labels.map((name: string, index: number) => ({
//         name,
//         Target: target[index] || 0,
//         Achievment: achieved[index] || 0,
//       }));
//     },

//     // enabled: enabled && !!year && !!month, // ✅ only run when selected
//     refetchOnWindowFocus: false,
//   });
// };

// "use client";
// import React from "react";
// /* UI COMPONENTS */
// import DataTableHeader from "@/components/table-data/data-table-header";
// import DataTableSubHeader from "@/components/table-data/data-table-sub-header";
// import { CommonDataTable } from "@/components/table-data/custom-table";
// import { Card } from "@/components/ui/card";
// import { RoundedPieChart } from "@/components/ui/rounded-pie-chart";
// import { RainbowGlowGradientLineChart } from "@/components/ui/rainbow-glow-gradient-line";
// import { AnimatedHighlightedAreaChart } from "@/components/ui/animated-highlighted-chart";
// /* SKELETON */
// import {
//   ChartSkeleton,
//   TableSkeleton,
// } from "@/components/ui/dashboard-skeleton";
// import { useInView } from "react-intersection-observer";
// /* LOCAL */
// import MyForm from "./components/filter";
// import { SectionCards } from "./components/section-cards";
// import { performanceColumns } from "./components/columns";
// /* API */
// import {
//   useBrandLinePerformance,
//   useBrandPerformance,
//   useCustomerLinePerformance,
//   useCustomerSegmentPerformance,
//   useDashboardSummary,
//   useDistributorChart,
//   useMaterialGroupPerformance,
//   useMaterialLinePerformance,
//   useMonthlySalesTrend,
//   useRegionLinePerformance,
//   useRegionPerformance,
//   useYearlySalesTrend,
// } from "./useSales";

// import { fallbackTableData } from "./components/data/fallback";
// // import { GaugeChart } from "@/components/ui/PieChartWithNeedle";
// import { GaugePieChartCard } from "@/components/ui/PieChartWithNeedle";
// import { AdvancedBarChart } from "@/components/ui/advancebar";
// import { AdvancedBarChart1 } from "@/components/ui/advancebar1";
// export default function Salesdashboa() {
//   const getDefaultFilters = () => {
//     const today = new Date();

//     const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

//     return {
//       from_date: formattedDate,
//       to_date: formattedDate,
//     };
//   };

//   const [filters, setFilters] = React.useState<any>(getDefaultFilters());
//   const [year, setYear] = React.useState("2026");
//   // Ensure this matches the string format your API/chart expects (e.g., "January")
//   const [sortType, setSortType] = React.useState("TARGET");
//   const [selectedMonth, setSelectedMonth] = React.useState<string | null>(
//     "April",
//   );

//   // REGION
//   const { ref: regionRef, inView: regionInView } = useInView({
//     triggerOnce: true,
//   });

//   // BRAND
//   const { ref: brandRef, inView: brandInView } = useInView({
//     triggerOnce: true,
//   });

//   // MATERIAL
//   const { ref: materialRef, inView: materialInView } = useInView({
//     triggerOnce: true,
//   });

//   // CUSTOMER
//   const { ref: customerRef, inView: customerInView } = useInView({
//     triggerOnce: true,
//   });

//   const { ref: distributorRef, inView: distributorInView } = useInView({
//     triggerOnce: true,
//   });

//   /* SALES TREND */

//   /* PERFORMANCE */
//   const summaryQuery = useDashboardSummary(filters);
//   const summaryData = summaryQuery.data;
//   const summaryLoading = summaryQuery.isFetching;

//   const yearlyQuery = useYearlySalesTrend(year, filters);
//   const monthlyQuery = useMonthlySalesTrend(year, selectedMonth, filters);

//   const regionQuery = useRegionPerformance(filters);
//   const brandQuery = useBrandPerformance(filters);
//   const materialQuery = useMaterialGroupPerformance(filters);
//   const customerQuery = useCustomerSegmentPerformance(filters);

//   const yearlyData = yearlyQuery.data ?? [];
//   const monthlyData = monthlyQuery.data ?? [];

//   const regionTable = regionQuery.data?.Result?.table_data ?? [];
//   const regionPie = regionQuery.data?.Result?.pie_chart ?? [];

//   const brandTable = brandQuery.data?.Result?.table_data ?? [];
//   const brandPie = brandQuery.data?.Result?.pie_chart ?? [];

//   const materialTable = materialQuery.data?.Result?.table_data ?? [];
//   const materialPie = materialQuery.data?.Result?.pie_chart ?? [];

//   const customerTable = customerQuery.data?.Result?.table_data ?? [];
//   const customerPie = customerQuery.data?.Result?.pie_chart ?? [];

//   const regionLoading = regionQuery.isFetching;
//   const brandLoading = brandQuery.isFetching;
//   const materialLoading = materialQuery.isFetching;
//   const customerLoading = customerQuery.isFetching;
//   const yearlyLoading = yearlyQuery.isFetching;
//   const monthlyLoading = monthlyQuery.isFetching;
//   const runAllApisSequentially = async () => {
//     await summaryQuery.refetch();
//     await yearlyQuery.refetch();

//     await monthlyQuery.refetch();
//     await regionQuery.refetch(); // 1️⃣
//     await brandQuery.refetch(); // 2️⃣
//     await materialQuery.refetch(); // 3️⃣
//     await customerQuery.refetch(); // 4️⃣
//   };
//   React.useEffect(() => {
//     runAllApisSequentially(); // ✅ first load
//   }, []);
//   const [applyFilter, setApplyFilter] = React.useState(false);

//   // const { data: regionLineData } = useRegionLinePerformance(regionInView);
//   // const { data: brandLineData } = useBrandLinePerformance(brandInView);
//   // const { data: materialLineData } = useMaterialLinePerformance(materialInView);
//   // const { data: customerLineData } = useCustomerLinePerformance(customerInView);

//   const regionLine = regionQuery?.data?.Result?.line_chart ?? [];
//   const brandLine = brandQuery.data?.Result?.line_chart ?? [];
//   const materialLine = materialQuery.data?.Result?.line_chart ?? [];
//   const customerLine = customerQuery.data?.Result?.line_chart ?? [];
//   const monthMap: Record<string, string> = {
//     Jan: "1",
//     Feb: "2",
//     Mar: "3",
//     Apr: "4",
//     May: "5",
//     Jun: "6",
//     Jul: "7",
//     Aug: "8",
//     Sep: "9",
//     Oct: "10",
//     Nov: "11",
//     Dec: "12",
//   };

//   const selectedMonthNumber = monthMap[selectedMonth || "Apr"];

//   const { data: distributorData = [], isLoading: distributorLoading } =
//     useDistributorChart(year, selectedMonthNumber);

//   return (
//     <div className="flex flex-1 flex-col  lg:px-2 py-4">
//       <div className="flex flex-col space-y-4">
//         {/* HEADER */}
//         <DataTableHeader title="Sales Dashboard" />
//         {/* FILTER */}
//         <Card className="shadow-sm p-4">
//           <MyForm
//             onFilter={(data) => {
//               if (!data) {
//                 setFilters(getDefaultFilters());
//               } else {
//                 setFilters(data);
//               }
//               setApplyFilter(true); // trigger
//             }}
//           />
//         </Card>
//         {/* KPI CARDS */}
//         <SectionCards
//           filters={filters}
//           data={summaryData}
//           loading={summaryLoading}
//         />
//         {/* TOP CHARTS */}
//         <section className="grid grid-cols-1 lg:pe-2  lg:grid-cols-[38%_38%_24%] gap-1 items-stretch">
//           {yearlyLoading ? (
//             <ChartSkeleton />
//           ) : (
//             <div>
//               <RainbowGlowGradientLineChart
//                 showYearSelector={true}
//                 height={220}
//                 title="Sales By Yearly Trends"
//                 description={`Sales overview for ${year}`}
//                 data={yearlyData}
//                 year={year}
//                 setYear={setYear}
//               />
//             </div>
//           )}

//           {monthlyLoading ? (
//             <ChartSkeleton />
//           ) : (
//             <div>
//               <AnimatedHighlightedAreaChart
//                 height={220}
//                 title="Sales By Monthly Trends"
//                 data={monthlyData}
//                 selectedMonth={selectedMonth}
//                 setSelectedMonth={setSelectedMonth}
//                 showMonthFilter={true} // ✅ ENABLE
//               />
//             </div>
//           )}

//           <div>
//             <GaugePieChartCard />
//           </div>
//         </section>
//         <section ref={distributorRef}>
//           <DataTableSubHeader title="Target Overview" />

//           <div className="grid grid-cols-1 lg:grid-cols-1 gap-1 mt-4">
//             <>
//               {!distributorInView || distributorLoading ? (
//                 <ChartSkeleton />
//               ) : (
//                 <AdvancedBarChart1
//                   height={300}
//                   data={distributorData || []} // ✅ API data
//                   showFilter={true}
//                   title="Distributor Target vs Achieved"
//                   year={year}
//                   month={selectedMonth || "Apr"}
//                   sortType={sortType}
//                   setYear={setYear}
//                   setMonth={setSelectedMonth}
//                   setSortType={setSortType}
//                 />
//               )}
//             </>
//           </div>
//         </section>
//         {/* REGION */}
//         <section ref={regionRef}>
//           <DataTableSubHeader title="Region Performance" />

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mt-4">
//             <>
//               {/* ================= TABLE ================= */}
//               {!regionInView || regionLoading ? (
//                 <TableSkeleton />
//               ) : (
//                 <CommonDataTable
//                   columns={performanceColumns}
//                   data={regionTable}
//                   pageSize={5}
//                   title="Region Performance"
//                 />
//               )}

//               {/* ================= PIE ================= */}
//               {!regionInView || regionLoading ? (
//                 <ChartSkeleton />
//               ) : (
//                 <RoundedPieChart
//                   title="Sales By Region Contribution"
//                   data={regionPie}
//                 />
//               )}

//               {/* ================= LINE ================= */}
//               {!regionInView ? (
//                 <ChartSkeleton />
//               ) : regionQuery ? (
//                 <RainbowGlowGradientLineChart
//                   xKey="label"
//                   yKey="y"
//                   title="Region Monthly Sales Trend"
//                   data={regionLine}
//                 />
//               ) : (
//                 <ChartSkeleton />
//               )}
//             </>
//           </div>
//         </section>
//         {/* BRAND */}
//         <section ref={brandRef}>
//           <DataTableSubHeader title="Brand Performance " />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mt-4">
//             <>
//               {/* ================= TABLE ================= */}
//               {!brandInView || brandLoading ? (
//                 <TableSkeleton />
//               ) : (
//                 <CommonDataTable
//                   columns={performanceColumns}
//                   data={brandTable}
//                   pageSize={5}
//                   title="Brand Performance"
//                 />
//               )}

//               {/* ================= PIE ================= */}
//               {!brandInView || brandLoading ? (
//                 <ChartSkeleton />
//               ) : (
//                 <RoundedPieChart
//                   title="Sales By Brand Contribution"
//                   data={brandPie}
//                 />
//               )}

//               {/* ================= LINE ================= */}
//               {!brandInView ? (
//                 <ChartSkeleton />
//               ) : brandQuery ? (
//                 <RainbowGlowGradientLineChart
//                   xKey="label"
//                   yKey="y"
//                   title="Brand Monthly Sales Trend"
//                   data={brandLine}
//                 />
//               ) : (
//                 <ChartSkeleton />
//               )}
//             </>
//           </div>
//         </section>
//         {/* MATERIAL */}
//         <section ref={materialRef}>
//           <DataTableSubHeader title="Material Group" />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mt-4">
//             <>
//               {/* ================= TABLE ================= */}
//               {!materialInView || materialLoading ? (
//                 <TableSkeleton />
//               ) : (
//                 <CommonDataTable
//                   columns={performanceColumns}
//                   data={materialTable}
//                   pageSize={5}
//                   title="Material Group"
//                 />
//               )}

//               {/* ================= PIE ================= */}
//               {!materialInView || materialLoading ? (
//                 <ChartSkeleton />
//               ) : (
//                 <RoundedPieChart
//                   title="Sales By Material Group Contribution"
//                   data={materialPie}
//                 />
//               )}

//               {/* ================= LINE ================= */}
//               {!materialInView ? (
//                 <ChartSkeleton />
//               ) : materialQuery ? (
//                 <RainbowGlowGradientLineChart
//                   xKey="label"
//                   yKey="y"
//                   title="Material Group Monthly Sales Trend"
//                   data={materialLine}
//                 />
//               ) : (
//                 <ChartSkeleton />
//               )}
//             </>
//           </div>
//         </section>
//         {/* CUSTOMER */}
//         <section ref={customerRef}>
//           <DataTableSubHeader title="Customer Segment Performance" />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mt-4">
//             <>
//               {/* ================= TABLE ================= */}
//               {!customerInView || customerLoading ? (
//                 <TableSkeleton />
//               ) : (
//                 <CommonDataTable
//                   columns={performanceColumns}
//                   data={customerTable}
//                   pageSize={5}
//                   title="Customer Segment"
//                 />
//               )}

//               {/* ================= PIE ================= */}
//               {!customerInView || customerLoading ? (
//                 <ChartSkeleton />
//               ) : (
//                 <RoundedPieChart
//                   title="Sales By Customer Segment Contribution"
//                   data={customerPie}
//                 />
//               )}

//               {/* ================= LINE ================= */}
//               {!customerInView ? (
//                 <ChartSkeleton />
//               ) : customerQuery ? (
//                 <RainbowGlowGradientLineChart
//                   xKey="label"
//                   yKey="y"
//                   title="Customer Segment Monthly Sales Trend"
//                   data={customerLine}
//                 />
//               ) : (
//                 <ChartSkeleton />
//               )}
//             </>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
