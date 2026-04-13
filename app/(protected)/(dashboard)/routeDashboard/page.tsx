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
import GrowthLines from "@/components/growthlines";
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

export default function Salesdashboa() {
  // 🔹 Global filters (Charts & Data reset)
  const [globalFilters, setGlobalFilters] = useState<SalesFilterPayload>({});
  const [performanceType, setPerformanceType] = useState<"routes" | "salesmen">(
    "routes",
  );

  // 🔹 Table Pagination States
  const [tableFilters, setTableFilters] = useState<SalesFilterPayload>({
    page: 1,
    length: 10,
  });

  // 🔹 Local state for appended data
  const [efficiencyData, setEfficiencyData] = useState<any[]>([]);
  const [salesReportData, setSalesReportData] = useState<any[]>([]);

  const currentPage = tableFilters.page ?? 1;

  /* =========================
        CALLBACK HANDLERS
     ========================= */
  const handlePerformanceTypeChange = useCallback(
    (type: "routes" | "salesmen") => {
      setPerformanceType(type);
    },
    [],
  );

  const handleGlobalFilterChange = (filters: SalesFilterPayload) => {
    setGlobalFilters(filters);
    setTableFilters((prev) => ({ ...prev, page: 1 }));
    setEfficiencyData([]);
    setSalesReportData([]);
  };

  const handleLoadMore = () => {
    setTableFilters((prev) => ({
      ...prev,
      page: (prev.page ?? 1) + 1,
    }));
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
    useRoutePerformance(globalFilters, performanceType);
  const { data: expense = [], isLoading: expenseLoading } =
    useRouteExpense(globalFilters);

  // ✅ FIX: Passing globalFilters to these hooks
  const { data: performanceGraph, isLoading: perfGraphLoading } =
    useRoutePerformanceGraph(globalFilters, performanceType);
  const { data: expenseGraph, isLoading: expenseGraphLoading } =
    useRouteExpenseGraph(globalFilters);

  const { data: efficiencyRes, isFetching: efficiencyFetching } =
    useRouteEfficiency({ ...globalFilters, ...tableFilters });
  const { data: salesRes, isFetching: salesFetching } = useRouteWiseSales({
    ...globalFilters,
    ...tableFilters,
  });

  /* =========================
        DATA SYNC EFFECTS
     ========================= */
  useEffect(() => {
    const newData = efficiencyRes?.tableData;
    if (!newData) return;
    if (currentPage === 1) setEfficiencyData(newData);
    else setEfficiencyData((prev) => [...prev, ...newData]);
  }, [efficiencyRes?.tableData, currentPage]);

  useEffect(() => {
    const newData = salesRes?.tableData;
    if (!newData) return;
    if (currentPage === 1) setSalesReportData(newData);
    else setSalesReportData((prev) => [...prev, ...newData]);
  }, [salesRes?.tableData, currentPage]);

  const isEfficiencyInitialLoading = efficiencyFetching && currentPage === 1;
  const isSalesInitialLoading = salesFetching && currentPage === 1;

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
          <GrowthLines data={regionData} isLoading={regionLoading} />

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
            <RainbowGlowGradientLineChart
              title="Drop Size by Volume"
              height={150}
              data={volumeData}
            />
          </div>
        </section>

        {/* PERFORMANCE SECTION */}
        <section className="px-2 mb-6">
          <div className="mb-4">
            <DataTableSubHeader title="Route Performance" />
          </div>

          <Card className="shadow-xs lg:px-2 mb-4">
            <MyForm1 onTypeChange={handlePerformanceTypeChange} />
          </Card>

          <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
            <CommonDataTable
              title="TOP PERFORMER"
              columns={routeSalesCollectionColumns}
              data={performance}
              pageSize={5}
              isFetching={perfLoading}
            />
            {perfGraphLoading ? (
              <ChartSkeleton />
            ) : (
              <RainbowGlowGradientLineChart
                height={280}
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
          <div className="mb-4">
            <DataTableSubHeader title="Route Expense Analysis" />
          </div>

          <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
            <CommonDataTable
              tableWidth="100%"
              title="Expense By Route"
              columns={routeExpenseColumns}
              data={expense}
              pageSize={5}
              isFetching={expenseLoading}
            />
            {expenseGraphLoading ? (
              <ChartSkeleton />
            ) : (
              <RainbowGlowGradientLineChart
                height={280}
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
            pagination={salesRes?.pagination}
            isFetching={isSalesInitialLoading}
            isFetchingMore={salesFetching && currentPage > 1}
            onNext={handleLoadMore}
          />
        </section>
        <section className="px-2 pb-12">
          <DataTableSubHeader title="Route Efficiency Overview" />

          <CommonDataTables
            columns={salesColumns}
            data={efficiencyData}
            pagination={efficiencyRes?.pagination}
            isFetching={isEfficiencyInitialLoading}
            isFetchingMore={efficiencyFetching && currentPage > 1}
            onNext={handleLoadMore}
          />
        </section>
      </div>
    </div>
  );
}
