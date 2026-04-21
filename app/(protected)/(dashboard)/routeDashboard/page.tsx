"use client";

import { useEffect, useState, useCallback } from "react";
import DataTableHeader from "@/components/table-data/data-table-header";
import MyForm from "./components/filter";
import MyForm1 from "./components/filter1";
import { SectionCards } from "./components/section-cards";
import { RainbowGlowGradientLineChart } from "@/components/ui/rainbow-glow-gradient-line";
import DataTableSubHeader from "@/components/table-data/data-table-sub-header";
import { CommonDataTable } from "@/components/table-data/custom-table";
import { CommonDataTables } from "@/components/table-data/common-tables";
import { salesColumns } from "./components/columns";
import { Card } from "@/components/ui/card";
// import GrowthLines from "@/components/growthlines";
import { AdvancedBarChart } from "@/components/ui/advancebar";
import {
  ChartSkeleton,
  TableSkeleton,
} from "@/components/ui/dashboard-skeleton";

// Types and Hooks
import { SalesFilterPayload } from "./types";
import {
  useGrowthPerformance,
  useMonthlyCompareDropSizeRevenue,
  useMonthlyCompareDropSizeVolume,
  useMonthlyTrend,
  useRouteEfficiency,
  useRouteExpense,
  useRouteExpenseGraph,
  useRoutePerformance,
  useRoutePerformanceGraph,
  useRouteWiseSales,
} from "./useRoutes";

// Column Definitions
import { routeSalesCollectionColumns } from "./components/column1";
import { routeExpenseColumns } from "./components/column2";
import { routeSalesColumns } from "./components/column3";
import GrowthLines from "@/components/ui/growthlines";
// import GrowthLines from "@/components/growthlines";

export default function Salesdashboa() {
  // 🔹 Global filters (Charts & Data reset)
  const [globalFilters, setGlobalFilters] = useState<SalesFilterPayload>({});
  const [performanceType, setPerformanceType] = useState<"routes" | "salesmen">(
    "routes",
  );

  // 🔹 Table Pagination States
  // Replace: const [tableFilters, setTableFilters] = useState(...)
  const [salesPage, setSalesPage] = useState(1);
  const [efficiencyPage, setEfficiencyPage] = useState(1);
  const PAGE_LENGTH = 10;

  // 🔹 Local state for appended data
  const [efficiencyData, setEfficiencyData] = useState<any[]>([]);
  const [salesReportData, setSalesReportData] = useState<any[]>([]);
  const [selectedPerfRouteId, setSelectedPerfRouteId] = useState<string>("");
  const [selectedExpRouteId, setSelectedExpRouteId] = useState<string>("");

  // const currentPage = tableFilters.page ?? 1;

  /* =========================
        CALLBACK HANDLERS
     ========================= */
  const handlePerformanceTypeChange = useCallback(
    (type: "routes" | "salesmen") => {
      setPerformanceType(type);
    },
    [],
  );

  // Replace: const handleLoadMore = () => { ... }
  const handleLoadMoreSales = () => setSalesPage((prev) => prev + 1);
  const handleLoadMoreEfficiency = () => setEfficiencyPage((prev) => prev + 1);

  // Inside handleGlobalFilterChange, reset both:
  const handleGlobalFilterChange = (filters: SalesFilterPayload) => {
    setGlobalFilters(filters);
    setSalesPage(1); // Reset specific page
    setEfficiencyPage(1); // Reset specific page
    setEfficiencyData([]);
    setSalesReportData([]);
  };

  /* =========================
          API FETCHING
     ========================= */
  // Chart & Summary Data (Now all passing globalFilters)
  const { data: regionData, isLoading: regionLoading } =
    useGrowthPerformance(globalFilters);
  const { data: monthlyTrend = [], isLoading: trendLoading } =
    useMonthlyTrend(globalFilters);
  const { data: revenueData = [] } =
    useMonthlyCompareDropSizeRevenue(globalFilters);
  const { data: volumeData = [] } =
    useMonthlyCompareDropSizeVolume(globalFilters);

  const { data: performance = [], isLoading: perfLoading } =
    useRoutePerformance(globalFilters, performanceType, selectedPerfRouteId);

  const { data: performanceGraph, isFetching: perfGraphFetching } =
    useRoutePerformanceGraph(
      globalFilters,
      performanceType,
      selectedPerfRouteId,
    );

  // Expense
  const { data: expense = [], isLoading: expenseLoading } = useRouteExpense(
    globalFilters,
    selectedExpRouteId,
  );

  const { data: expenseGraph, isFetching: expenseGraphFetching } =
    useRouteExpenseGraph(globalFilters, selectedExpRouteId);

  // Efficiency Hook
  const { data: efficiencyRes, isFetching: efficiencyFetching } =
    useRouteEfficiency({
      ...globalFilters,
      page: efficiencyPage,
      length: PAGE_LENGTH,
    });

  // Sales Report Hook
  const { data: salesRes, isFetching: salesFetching } = useRouteWiseSales({
    ...globalFilters,
    page: salesPage,
    length: PAGE_LENGTH,
  });

  /* =========================
        DATA SYNC EFFECTS
     ========================= */
  // Efficiency Effect
  useEffect(() => {
    const newData = efficiencyRes?.tableData;
    if (!newData) return;
    if (efficiencyPage === 1) setEfficiencyData(newData);
    else setEfficiencyData((prev) => [...prev, ...newData]);
  }, [efficiencyRes?.tableData, efficiencyPage]); // Use efficiencyPage

  // Sales Effect
  useEffect(() => {
    const newData = salesRes?.tableData;
    if (!newData) return;
    if (salesPage === 1) setSalesReportData(newData);
    else setSalesReportData((prev) => [...prev, ...newData]);
  }, [salesRes?.tableData, salesPage]); // Use salesPage
  const isEfficiencyInitialLoading = efficiencyFetching && efficiencyPage === 1;
  const isSalesInitialLoading = salesFetching && salesPage === 1;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <header className="py-4 px-2">
          <DataTableHeader title="Route Dashboard" />
        </header>
        <div className="px-2">
          <Card className="shadow-xs lg:px-4 mb-4">
            <MyForm onFilter={handleGlobalFilterChange} />
          </Card>
        </div>
        <section className="px-2 mb-6">
          <SectionCards filters={globalFilters} />
        </section>
        {/* TOP CHARTS */}
        <section className="grid px-2 lg:pe-6 mb-6 gap-2 grid-cols-1 lg:grid-cols-[20%_40%_40%]">
          {/* <GrowthLines data={regionData} isLoading={regionLoading} /> */}
          <GrowthLines
            isLoading={regionLoading}
            items={[
              {
                label: "Completion Rat",
                value: Number(
                  (regionData?.completion_rate || "0").replace(/,/g, ""),
                ),
              },

              {
                label: "Success Rate",
                value: Number(
                  (regionData?.success_rate || "0").replace(/,/g, ""),
                ),
              },
              {
                label: "Incompletion Rate",
                value: Number(
                  (regionData?.incompletion_rate || "0").replace(/,/g, ""),
                ),
              },
              {
                label: "Closure Rate",
                value: Number(
                  (regionData?.success_rate || "0").replace(/,/g, ""),
                ),
              },
            ]}
          />

          {trendLoading ? (
            <ChartSkeleton />
          ) : (
            <AdvancedBarChart data={monthlyTrend} />
          )}

          <div className="flex flex-col gap-2">
            <RainbowGlowGradientLineChart
              title="Drop Size by Revenue"
              height={150}
              data={revenueData}
            />
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${volumeData.length * 35}px` }}>
                <RainbowGlowGradientLineChart
                  title="Drop Size by Volume"
                  height={150}
                  data={volumeData}
                />
              </div>
            </div>
          </div>
        </section>
        {/* PERFORMANCE SECTION */}{" "}
        <section className="px-2 mb-6">
          <DataTableSubHeader title="Route Performance" />{" "}
          <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 mt-4">
            <CommonDataTable
              title="TOP PERFORMER"
              columns={routeSalesCollectionColumns}
              data={performance}
              isFetching={perfLoading}
              height="300px"
              onRowClick={(row: any) => {
                const id = String(row.id);
                setSelectedPerfRouteId((prev) => (prev === id ? "" : id));
              }}
            />
            {perfGraphFetching ? (
              <ChartSkeleton />
            ) : (
              <RainbowGlowGradientLineChart
                height={250}
                title={`Monthly ${performanceType === "routes" ? "Route" : "Salesmen"} Performance`}
                data={performanceGraph?.chart_data || []}
                xKey="label"
                yKey="y"
              />
            )}
          </div>
        </section>
        {/* EXPENSE SECTION */}
        <section className="px-2 mb-6">
          <DataTableSubHeader title="Route Expense Analysis" />
          <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 mt-4">
            <CommonDataTable
              title="Expense By Route"
              columns={routeExpenseColumns}
              data={expense}
              isFetching={expenseLoading}
              height="300px"
              onRowClick={(row: any) => {
                const id = String(row.id);
                setSelectedExpRouteId((prev) => (prev === id ? "" : id));
              }}
            />
            {expenseGraphFetching ? (
              <ChartSkeleton />
            ) : (
              <RainbowGlowGradientLineChart
                height={230}
                title="Monthly Expense Trends"
                data={expenseGraph?.chart_data || []}
                xKey="label"
                yKey="y"
              />
            )}
          </div>
        </section>
        {/* TABLES */}
        <section className="px-2 mb-6">
          <DataTableSubHeader title="Route Wise Sales Report" />

          <CommonDataTables
            columns={routeSalesColumns}
            data={salesReportData}
            isFetching={salesFetching && salesPage === 1}
            isFetchingMore={salesFetching && salesPage > 1}
            onNext={handleLoadMoreSales} // Use Sales handler
            pagination={salesRes?.pagination}
          />
        </section>
        <section className="px-2 pb-12">
          <DataTableSubHeader title="Route Efficiency Overview" />

          <CommonDataTables
            columns={salesColumns}
            data={efficiencyData}
            isFetching={efficiencyFetching && efficiencyPage === 1}
            isFetchingMore={efficiencyFetching && efficiencyPage > 1}
            onNext={handleLoadMoreEfficiency} // Use Efficiency handler
            pagination={efficiencyRes?.pagination}
          />
        </section>
      </div>
    </div>
  );
}
