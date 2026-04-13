"use client";

import { useEffect, useState } from "react";
import DataTableHeader from "@/components/table-data/data-table-header";
import MyForm from "./components/filter";
import { SectionCards } from "./components/section-cards";
import { GaugePieChartCard } from "@/components/ui/PieChartWithNeedle";
import DataTableSubHeader from "@/components/table-data/data-table-sub-header";
import { Card, CardContent } from "@/components/ui/card";
import { GlowingBarVerticalChart } from "@/components/ui/glowing-bar-vertical-chart";
import { RainbowGlowGradientLineChart } from "@/components/ui/rainbow-glow-gradient-line";
import {
  useMonthlyTrend,
  useRegionPerformance,
  useTopCustomersTable,
} from "./useCustomers";
import { SalesFilterPayload } from "./types";
import { CommonDataTables } from "@/components/table-data/common-tables";
import datas from "./components/data.json";
import { performanceColumns } from "./components/columns";
import MyForm1 from "./components/filter1";
import {
  ChartSkeleton,
  TableSkeleton,
} from "@/components/ui/dashboard-skeleton";
import { SectionCardsSkeleton } from "@/components/ui/SectionCardsSkeleton";

export default function CustomerDashboard() {
  /* =========================
     STATE MANAGEMENT
  ========================= */

  // 🔹 Global filters → used for charts + table
  const [globalFilters, setGlobalFilters] = useState<SalesFilterPayload>({});

  // 🔹 Table-specific filters → pagination + table form
  const [tableFilters, setTableFilters] = useState<SalesFilterPayload>({
    page: 1,
    length: 10,
  });

  // 🔹 Year selector for charts
  const [year, setYear] = useState("2026");

  /* =========================
     CHART API CALLS
  ========================= */

  // Monthly trend (depends on global filters)
  const { data: monthlyTrend = [], isLoading: monthlyLoading } =
    useMonthlyTrend(globalFilters);

  // Region performance (depends on global filters)
  const { data, isLoading: regionLoading } =
    useRegionPerformance(globalFilters);

  // Extract chart data safely
  const chartData = data?.chartData || [];

  const regions = data?.regions || [];

  /* =========================
     MERGE FILTERS FOR TABLE API
  ========================= */

  // 🔥 Combine global + table filters
  // → Ensures table respects both filter types
  const mergedTableFilters = {
    ...globalFilters,
    ...tableFilters,
  };

  /* =========================
     TABLE API CALL
  ========================= */

  const {
    data: tableDataRes,
    isLoading,
    isError,
    isFetching,
  } = useTopCustomersTable(mergedTableFilters);

  // Extract table data safely
  const [allData, setAllData] = useState<any[]>([]);

  useEffect(() => {
    if (tableDataRes?.tableData) {
      setAllData((prev) =>
        tableFilters.page === 1
          ? tableDataRes.tableData
          : [...prev, ...tableDataRes.tableData],
      );
    }
  }, [tableDataRes]);
  // Extract pagination info from API
  const pagination = tableDataRes?.pagination;

  /* =========================
     PAGINATION HANDLERS (SERVER SIDE)
  ========================= */

  // 👉 Move to next page
  const handleNext = () => {
    if (pagination?.current_page < pagination?.total_pages) {
      setTableFilters((prev) => ({
        ...prev,
        page: pagination.current_page + 1,
      }));
    }
  };

  // 👉 Move to previous page
  const handlePrev = () => {
    if (pagination?.current_page > 1) {
      setTableFilters((prev) => ({
        ...prev,
        page: pagination.current_page - 1,
      }));
    }
  };

  const page = tableFilters.page ?? 1;
  const isInitialLoading = isFetching && allData.length === 0;
  const isFetchingMore = isLoading && page > 1;

  // Inside CustomerDashboard component...

  // 1. isFetching comes from TanStack Query
  // 2. allData.length === 0 happens during initial load OR when you call setAllData([]) in onFilter
  const isInitialOrFilterLoading = isFetching && allData.length === 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        {/* 1. PAGE HEADER SECTION: Standardized padding */}
        <header className="py-6 px-2">
          <DataTableHeader title="Customers Dashboard" />
        </header>

        {/* 2. TOP FILTER SECTION: Consistent bottom margin to separate from KPI */}
        <div className="px-2 mb-4">
          <Card className="shadow-xm lg:px-5">
            <MyForm
              onFilter={(f) => {
                setGlobalFilters(f);
                setTableFilters((prev) => ({
                  ...prev,
                  page: 1,
                }));
                setAllData([]); // ✅ CLEAR OLD DATA
              }}
            />
          </Card>
        </div>

        {/* 3. KPI & TREND SECTION: Uses 'gap-6' for inner grid spacing and 'mb-6' for section separation */}
        <section className="grid gap-1 px-3 mb-6 grid-cols-1  lg:grid-cols-[28%_44%_28%] gap-1 items-stretch">
          {monthlyLoading ? (
            <SectionCardsSkeleton />
          ) : (
            <SectionCards filters={globalFilters} />
          )}

          {monthlyLoading ? (
            <ChartSkeleton />
          ) : (
            <RainbowGlowGradientLineChart
              xKey="label"
              yKey="y"
              height={300}
              title="Monthly Trend of Customers Creation"
              data={monthlyTrend}
              year={"2026"}
              setYear={setYear}
            />
          )}

          <div className="flex flex-col gap-1">
            <Card className="shadow-xm md:px-8 py-1">
              <CardContent className="flex items-center justify-between text-center py-0">
                <div className="text-md">
                  <div className="text-green-600 font-semibold text-sm">
                    12%
                  </div>
                  <span className="font-medium text-sm text-muted-foreground">
                    Customer Satisfaction
                  </span>
                </div>
                <div className="text-sm">
                  <p>
                    <span className="font-small">Current:</span>{" "}
                    <span className="text-green-600 font-semibold">83.33%</span>
                  </p>
                  <p>
                    <span className="font-small">Last:</span>{" "}
                    <span className="text-red-500 font-semibold">75.00%</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {monthlyLoading ? <ChartSkeleton /> : <GaugePieChartCard />}
          </div>
        </section>

        {/* 4. REGION CHART SECTION: Standardized SubHeader spacing */}
        <section className="px-2 mb-6">
          <div className="mb-4">
            <DataTableSubHeader title="Customers By Region" />
          </div>

          {regionLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="grid grid-cols-1">
              <div className="h-full">
                <GlowingBarVerticalChart data={chartData} regions={regions} />
              </div>
            </div>
          )}
        </section>

        {/* 5. TABLE FILTER SECTION: Consistent with section above */}
        <section className="px-2 mb-6">
          <div className="mb-4">
            <DataTableSubHeader title="Filter Records" />
          </div>
        </section>

        {/* 6. DATA TABLE SECTION: Bottom padding to finish the page */}
        <section className="px-2 pb-12">
          {/* <Card className="shadow-xm"> */}

          <CommonDataTables
            columns={performanceColumns}
            data={allData}
            headerTitle="Top Customers"
            pagination={pagination}
            onNext={handleNext}
            onPrev={handlePrev}
            FilterComponent={MyForm1}
            // isFetchingMore={isFetching}
            isFetching={isInitialOrFilterLoading} // Skeleton ke liye
            isFetchingMore={isFetching}
            onFilter={(filters) => {
              setAllData([]); // ✅ CLEAR HERE ALSO
              setTableFilters((prev) => ({
                ...prev,
                ...filters,
                page: 1,
              }));
            }}
          />

          {/* </Card> */}
        </section>
      </div>
    </div>
  );
}
