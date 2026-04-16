"use client";
import React from "react";
/* UI COMPONENTS */
import DataTableHeader from "@/components/table-data/data-table-header";
import DataTableSubHeader from "@/components/table-data/data-table-sub-header";
import { CommonDataTable } from "@/components/table-data/custom-table";
import { Card } from "@/components/ui/card";
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
import { RoundedPieChart } from "@/components/ui/rounded-pi-charts";

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
  const [distYear, setDistYear] = React.useState("2026");
  const [distMonth, setDistMonth] = React.useState<string | null>("April");
  const [sortType, setSortType] = React.useState("TARGET");
  const [loadStep, setLoadStep] = React.useState(0);

  // Drill-down IDs
  const [selectedMaterialId, setSelectedMaterialId] =
    React.useState<string>("");
  const [selectedRegionId, setSelectedRegionId] = React.useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = React.useState<string>("");
  const [selectedSegmentId, setSelectedSegmentId] = React.useState<string>("");

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

  const handleFilter = (data: any) => {
    setLoadStep(-1);
    if (!data) {
      setFilters(getDefaultFilters());
    } else {
      setFilters(data);
    }
    setTimeout(() => setLoadStep(0), 50);
  };

  // ================= API CALLS =================
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

  const { data: regionPerformance = {}, isFetching: regionFetching } =
    useRegionPerformance(filters, selectedRegionId, loadStep >= 4);
  const { data: brandPerformance = {}, isFetching: brandFetching } =
    useBrandPerformance(filters, selectedBrandId, loadStep >= 5);
  const { data: materialGroupPerformance = {}, isFetching: materialFetching } =
    useMaterialGroupPerformance(filters, selectedMaterialId, loadStep >= 6);
  const {
    data: customerSegmentPerformance = {},
    isFetching: customerFetching,
  } = useCustomerSegmentPerformance(filters, selectedSegmentId, loadStep >= 7);

  // ================= SEQUENCE CONTROLLER =================
  React.useEffect(() => {
    if (loadStep === 0 && (summaryData || !summaryLoading)) setLoadStep(1);
    if (loadStep === 1 && (yearlyData.length > 0 || !yearlyLoading))
      setLoadStep(2);
    if (loadStep === 2 && (monthlyData.length > 0 || !monthlyLoading))
      setLoadStep(3);
    if (loadStep === 3 && (distributorData.length > 0 || !distributorLoading))
      setLoadStep(4);
    if (loadStep === 4 && (regionPerformance?.table_data || !regionFetching))
      setLoadStep(5);
    if (loadStep === 5 && (brandPerformance?.table_data || !brandFetching))
      setLoadStep(6);
    if (
      loadStep === 6 &&
      (materialGroupPerformance?.table_data || !materialFetching)
    )
      setLoadStep(7);
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
    regionFetching,
    brandPerformance,
    brandFetching,
    materialGroupPerformance,
    materialFetching,
  ]);

  // Define sections data for mapping
  const sections = [
    {
      title: "Region",
      step: 4,
      isFetching: regionFetching,
      table: regionPerformance?.table_data ?? [],
      pie: regionPerformance?.pie_chart ?? [],
      line: regionPerformance?.line_chart,
      onRowClick: (row: any) =>
        setSelectedRegionId((prev) =>
          prev === String(row.id) ? "" : String(row.id),
        ),
    },
    {
      title: "Brand",
      step: 5,
      isFetching: brandFetching,
      table: brandPerformance?.table_data ?? [],
      pie: brandPerformance?.pie_chart ?? [],
      line: brandPerformance?.line_chart,
      onRowClick: (row: any) =>
        setSelectedBrandId((prev) =>
          prev === String(row.id) ? "" : String(row.id),
        ),
    },
    {
      title: "Material Group",
      step: 6,
      isFetching: materialFetching,
      table: materialGroupPerformance?.table_data ?? [],
      pie: materialGroupPerformance?.pie_chart ?? [],
      line: materialGroupPerformance?.line_chart,
      onRowClick: (row: any) =>
        setSelectedMaterialId((prev) =>
          prev === String(row.id) ? "" : String(row.id),
        ),
    },
    {
      title: "Customer Segment",
      step: 7,
      isFetching: customerFetching,
      table: customerSegmentPerformance?.table_data ?? [],
      pie: customerSegmentPerformance?.pie_chart ?? [],
      line: customerSegmentPerformance?.line_chart,
      onRowClick: (row: any) =>
        setSelectedSegmentId((prev) =>
          prev === String(row.id) ? "" : String(row.id),
        ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col lg:px-2 py-4">
      <div className="flex flex-col space-y-4">
        <DataTableHeader title="Sales Dashboard" />

        <Card className="shadow-sm p-4">
          <MyForm onFilter={handleFilter} />
        </Card>

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
                year={distYear}
                month={distMonth || "Apr"}
                sortType={sortType}
                setYear={setDistYear}
                setMonth={setDistMonth}
                setSortType={setSortType}
              />
            )}
          </div>
        </section>

        {/* PERFORMANCE SECTIONS */}
        {sections.map((sec) => (
          <section key={sec.title}>
            <DataTableSubHeader title={`${sec.title} Performance`} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mt-4">
              {loadStep < sec.step || sec.isFetching ? (
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
                    onRowClick={sec.onRowClick}
                    height="380px"
                  />
                  <RoundedPieChart
                    title={`Sales By ${sec.title} Contribution`}
                    data={sec.pie}
                    height={250}
                  />
                  <RainbowGlowGradientLineChart
                    xKey="label"
                    yKey="y"
                    title={`${sec.title} Monthly Sales Trend`}
                    data={sec.line || []}
                    height={330}
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
