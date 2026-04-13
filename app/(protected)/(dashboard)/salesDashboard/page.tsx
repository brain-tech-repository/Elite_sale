"use client";
import React from "react";
/* UI COMPONENTS */
import DataTableHeader from "@/components/table-data/data-table-header";
import DataTableSubHeader from "@/components/table-data/data-table-sub-header";
import { CommonDataTable } from "@/components/table-data/custom-table";
import { Card } from "@/components/ui/card";
import { RoundedPieChart } from "@/components/ui/rounded-pie-chart";
import { RainbowGlowGradientLineChart } from "@/components/ui/rainbow-glow-gradient-line";
import { AnimatedHighlightedAreaChart } from "@/components/ui/animated-highlighted-chart";
/* SKELETON */
import {
  BarGraphSkeleton,
  ChartSkeleton,
  PieChartSkeleton,
  TableSkeleton,
} from "@/components/ui/dashboard-skeleton";
/* LOCAL */
import MyForm from "./components/filter";
import { SectionCards } from "./components/section-cards";
import { performanceColumns } from "./components/columns";
/* API */
import {
  useBrandPerformance,
  useCustomerSegmentPerformance,
  useDashboardSummary,
  useDistributorChart,
  useMaterialGroupPerformance,
  useMonthlySalesTrend,
  useRegionPerformance,
  useYearlySalesTrend,
} from "./useSales";

import { GaugePieChartCard } from "@/components/ui/PieChartWithNeedle";
import { AdvancedBarChart1 } from "@/components/ui/advancebar1";

export default function Salesdashboa() {
  const getDefaultFilters = () => {
    const today = new Date();
    return {
      from_date: today.toISOString().split("T")[0],
      to_date: today.toISOString().split("T")[0],
    };
  };

  // State
  const [filters, setFilters] = React.useState<any>(getDefaultFilters());
  const [year, setYear] = React.useState("2026");
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(
    "April",
  );

  // For Distributor chart (BOTTOM) ✅ NEW
  const [distYear, setDistYear] = React.useState("2026");
  const [distMonth, setDistMonth] = React.useState<string | null>("April");

  const [sortType, setSortType] = React.useState("TARGET");
  const [loadStep, setLoadStep] = React.useState(0);

  const monthMap: Record<string, string> = {
    Jan: "1",
    Feb: "2",
    Mar: "3",
    Apr: "4",
    May: "5",
    Jun: "6",
    Jul: "7",
    Aug: "8",
    Sep: "9",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const selectedMonthNumber = monthMap[selectedMonth || "Apr"];

  // 1. FILTER HANDLER (Triggers Reset)
  const handleFilter = (data: any) => {
    setLoadStep(-1);
    if (!data) {
      setFilters(getDefaultFilters());
    } else {
      setFilters(data);
    }
    setTimeout(() => setLoadStep(0), 50);
  };

  // ================= API CALLS (Strict Sequential) =================

  const { data: summaryData, isFetching: summaryLoading } = useDashboardSummary(
    filters,
    loadStep >= 0,
  );
  const { data: yearlyData = [], isFetching: yearlyLoading } =
    useYearlySalesTrend(year, filters, loadStep >= 1);
  const { data: monthlyData = [], isFetching: monthlyLoading } =
    useMonthlySalesTrend(year, selectedMonth, filters, loadStep >= 2);
  const selectedDistMonthNumber = monthMap[distMonth || "Apr"];

  const { data: distributorData = [], isFetching: distributorLoading } =
    useDistributorChart(distYear, selectedDistMonthNumber, loadStep >= 3);
  const { data: regionPerformance = {}, isFetching: regionLoading } =
    useRegionPerformance(filters, loadStep >= 4);
  const { data: brandPerformance = {}, isFetching: brandLoading } =
    useBrandPerformance(filters, loadStep >= 5);
  const { data: materialGroupPerformance = {}, isFetching: materialLoading } =
    useMaterialGroupPerformance(filters, loadStep >= 6);
  const { data: customerSegmentPerformance = {}, isFetching: customerLoading } =
    useCustomerSegmentPerformance(filters, loadStep >= 7);

  // ================= SEQUENCE CONTROLLER =================

  // ================= SEQUENCE CONTROLLER =================
  // This block ensures that if data is already in the cache,
  // the waterfall jumps ahead immediately without flashing skeletons.
  React.useEffect(() => {
    // Step 0 -> 1: Dashboard Summary
    if (loadStep === 0 && (summaryData || !summaryLoading)) {
      setLoadStep(1);
    }
    // Step 1 -> 2: Yearly Sales Trend
    if (loadStep === 1 && (yearlyData.length > 0 || !yearlyLoading)) {
      setLoadStep(2);
    }
    // Step 2 -> 3: Monthly Sales Trend
    if (loadStep === 2 && (monthlyData.length > 0 || !monthlyLoading)) {
      setLoadStep(3);
    }
    // Step 3 -> 4: Distributor Chart
    if (loadStep === 3 && (distributorData.length > 0 || !distributorLoading)) {
      setLoadStep(4);
    }
    // Step 4 -> 5: Region Performance
    if (loadStep === 4 && (regionPerformance?.table_data || !regionLoading)) {
      setLoadStep(5);
    }
    // Step 5 -> 6: Brand Performance
    if (loadStep === 5 && (brandPerformance?.table_data || !brandLoading)) {
      setLoadStep(6);
    }
    // Step 6 -> 7: Material Group Performance
    if (
      loadStep === 6 &&
      (materialGroupPerformance?.table_data || !materialLoading)
    ) {
      setLoadStep(7);
    }
  }, [
    loadStep,
    summaryData,
    summaryLoading,
    yearlyData,
    yearlyLoading,
    monthlyData,
    monthlyLoading,
    distributorData,
    distributorLoading,
    regionPerformance,
    regionLoading,
    brandPerformance,
    brandLoading,
    materialGroupPerformance,
    materialLoading,
  ]);

  return (
    <div className="flex flex-1 flex-col lg:px-2 py-4">
      <div className="flex flex-col space-y-4">
        <DataTableHeader title="Sales Dashboard" />

        <Card className="shadow-sm p-4">
          <MyForm onFilter={handleFilter} />
        </Card>

        {/* KPI CARDS */}
        <SectionCards
          data={summaryData}
          isLoading={loadStep < 1 && summaryLoading}
        />

        {/* TOP CHARTS */}
        <section className="grid grid-cols-1 lg:pe-2 lg:grid-cols-[38%_38%_24%] gap-1 items-stretch">
          <div>
            {loadStep < 1 || (yearlyLoading && loadStep === 1) ? (
              <ChartSkeleton />
            ) : (
              <RainbowGlowGradientLineChart
                showYearSelector
                height={220}
                title="Sales By Yearly Trends"
                data={yearlyData}
                year={year}
                setYear={setYear}
              />
            )}
          </div>

          <div>
            {loadStep < 2 || (monthlyLoading && loadStep === 2) ? (
              <ChartSkeleton />
            ) : (
              <AnimatedHighlightedAreaChart
                height={220}
                title="Sales By Monthly Trends"
                data={monthlyData}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                showMonthFilter
              />
            )}
          </div>

          <div>
            <GaugePieChartCard />
          </div>
        </section>

        {/* TARGET OVERVIEW */}
        <section>
          <DataTableSubHeader title="Target Overview" />
          <div className="grid grid-cols-1 gap-1 mt-4">
            {distributorLoading ? (
              <BarGraphSkeleton />
            ) : (
              <AdvancedBarChart1
                height={300}
                data={distributorData}
                showFilter={true}
                title="Distributor Target vs Achieved"
                year={distYear} // ✅ changed
                month={distMonth || "Apr"} // ✅ changed
                sortType={sortType}
                setYear={setDistYear} // ✅ changed
                setMonth={setDistMonth} // ✅ changed
                setSortType={setSortType}
              />
            )}
          </div>
        </section>

        {/* PERFORMANCE SECTIONS */}
        {[
          {
            title: "Region",
            step: 4,
            loading: regionLoading,
            table: regionPerformance?.table_data ?? [],
            pie: regionPerformance?.pie_chart ?? [],
            line: regionPerformance?.line_chart,
          },
          {
            title: "Brand",
            step: 5,
            loading: brandLoading,
            table: brandPerformance?.table_data ?? [],
            pie: brandPerformance?.pie_chart ?? [],
            line: brandPerformance?.line_chart,
          },
          {
            title: "Material Group",
            step: 6,
            loading: materialLoading,
            table: materialGroupPerformance?.table_data ?? [],
            pie: materialGroupPerformance?.pie_chart ?? [],
            line: materialGroupPerformance?.line_chart,
          },
          {
            title: "Customer Segment",
            step: 7,
            loading: customerLoading,
            table: customerSegmentPerformance?.table_data ?? [],
            pie: customerSegmentPerformance?.pie_chart ?? [],
            line: customerSegmentPerformance?.line_chart,
          },
        ].map((sec) => (
          <section key={sec.title}>
            <DataTableSubHeader title={`${sec.title} Performance`} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mt-4">
              {loadStep < sec.step || (sec.loading && loadStep === sec.step) ? (
                <>
                  <TableSkeleton />
                  <PieChartSkeleton />
                  <ChartSkeleton />
                </>
              ) : (
                <>
                  <CommonDataTable
                    columns={performanceColumns}
                    data={sec.table}
                    pageSize={5}
                    title={sec.title}
                  />
                  <RoundedPieChart
                    title={`Sales By ${sec.title} Contribution`}
                    data={sec.pie}
                  />
                  <RainbowGlowGradientLineChart
                    xKey="label"
                    yKey="y"
                    title={`${sec.title} Monthly Sales Trend`}
                    data={sec.line || []}
                  />
                </>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
