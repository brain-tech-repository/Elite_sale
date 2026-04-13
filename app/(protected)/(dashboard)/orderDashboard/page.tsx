"use client";

import DataTableHeader from "@/components/table-data/data-table-header";
import MyForm from "./components/filter";
import { SectionCards } from "./components/section-cards";
import { GaugePieChartCard } from "@/components/ui/PieChartWithNeedle2";
import { Card } from "@/components/ui/card";
import { CommonDataTables } from "@/components/table-data/common-tables";
import { RainbowGlowGradientLineChart } from "@/components/ui/rainbow-glow-gradient-line";

import { useEffect, useState, useMemo } from "react";

import { OrderSummaryFilters } from "./types";
import { useOrderChart, useOrderTable } from "./useOrder";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChartSkeleton,
  TableSkeleton,
} from "@/components/ui/dashboard-skeleton";
import { SectionCardsSkeleton } from "@/components/ui/SectionCardsSkeleton";

/**
 * Helper to generate columns dynamically based on API headers
 */
export const generateColumns = (headers: string[]): ColumnDef<any>[] => {
  return headers.map((header) => ({
    accessorKey: header,
    header: header,
    cell: ({ row }: any) => row.getValue(header) || "-",
  }));
};

export default function Salesdashboa() {
  /* ================= GLOBAL FILTERS ================= */
  const today = new Date().toISOString().split("T")[0];

  const [globalFilters, setGlobalFilters] = useState<OrderSummaryFilters>({
    order_type: 1,
    from_date: today,
    to_date: today,
  });

  /* ================= TABLE FILTERS ================= */
  const [tableFilters, setTableFilters] = useState({
    page: 1,
    per_page: 10,
  });

  const [cardType, setCardType] = useState<string>("order");

  /* ================= MANUAL LOADING ================= */
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  /* ================= API CALLS ================= */
  const { data, isLoading, isFetching } = useOrderTable({
    ...globalFilters,
    ...tableFilters,
    card_type: cardType,
  });

  const { data: chartRes, isLoading: chartLoading } = useOrderChart({
    order_type: globalFilters?.order_type,
    card_type: cardType,
  });

  /* ================= DERIVED STATES ================= */
  const page = tableFilters.page ?? 1;
  const isInitialLoading = isLoading && page === 1;

  // Logic to trigger the inline skeleton rows (Pulse effect)
  const isPageLoading =
    isFilterLoading || isInitialLoading || (isFetching && page === 1);

  const isFetchingMore = isFetching && page > 1;

  /* ================= TABLE DATA STATE ================= */
  const [allData, setAllData] = useState<any[]>([]);
  const [savedHeaders, setSavedHeaders] = useState<string[]>([]);

  const tableData = data?.data;
  const pagination = data?.pagination;
  const volumeChartData = chartRes?.data || [];

  /* ================= STOP FILTER LOADING ================= */
  useEffect(() => {
    if (!isLoading && !isFetching && !chartLoading) {
      setIsFilterLoading(false);
    }
  }, [isLoading, isFetching, chartLoading]);

  /* ================= DATA ACCUMULATION ================= */
  useEffect(() => {
    if (!tableData) return;

    setAllData((prev) => {
      if (page === 1) return tableData;
      return [...prev, ...tableData];
    });
  }, [tableData, page]);

  /* ================= CACHE HEADERS ================= */
  useEffect(() => {
    if (Array.isArray(data?.headers) && data.headers.length > 0) {
      setSavedHeaders(data.headers);
    }
  }, [data?.headers]);

  /* ================= UI HELPERS ================= */
  const SkeletonBox = ({ height }: { height: number }) => (
    <div
      className="w-full bg-gray-200 animate-pulse rounded-xl"
      style={{ height }}
    />
  );

  const mainChartData = [
    { label: "Jan", y: 120 },
    { label: "Feb", y: 200 },
    { label: "Mar", y: 150 },
    { label: "Apr", y: 278 },
    { label: "May", y: 189 },
    { label: "Jun", y: 239 },
  ];

  /* ================= MEMOIZED COLUMNS ================= */
  const dynamicColumns = useMemo(() => {
    return savedHeaders.length > 0 ? generateColumns(savedHeaders) : [];
  }, [savedHeaders]);

  const safeData = Array.isArray(allData) ? allData : [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        {/* ================= HEADER ================= */}
        <div className="py-6 px-6">
          <DataTableHeader title="Orders Dashboard" />
        </div>

        {/* ================= GLOBAL FILTERS ================= */}
        <div className="lg:px-6 px-1 pb-4">
          <Card className="shadow-xm lg:px-5">
            <MyForm
              onApply={(filters) => {
                setIsFilterLoading(true);
                setGlobalFilters(filters);
                setTableFilters({ page: 1, per_page: 10 });
                setCardType("order");
                setAllData([]);
                setSavedHeaders([]); // Reset headers to force fresh column generation
              }}
            />
          </Card>
        </div>

        {/* ================= CHARTS & KPI CARDS ================= */}
        <section className="grid gap-2 lg:px-5 px-1 pb-8 grid-cols-1 lg:grid-cols-[30%_40%_30%]">
          {/* KPI CARDS */}
          {isFilterLoading ? (
            <SectionCardsSkeleton />
          ) : (
            <SectionCards
              filters={globalFilters}
              onCardClick={(type) => {
                setCardType(type);
                setTableFilters((prev) => ({ ...prev, page: 1 }));
                setAllData([]);
              }}
            />
          )}

          {/* MAIN VOLUME CHART */}
          {isPageLoading ? (
            <ChartSkeleton />
          ) : (
            <RainbowGlowGradientLineChart
              height={350}
              title="Drop Size by Volume"
              data={volumeChartData}
              xKey="label"
              yKey="y"
            />
          )}

          {/* SIDE CHARTS */}
          <div className="flex flex-col gap-2">
            {isPageLoading ? (
              <SkeletonBox height={150} />
            ) : (
              <GaugePieChartCard />
            )}

            {isPageLoading ? (
              <SkeletonBox height={150} />
            ) : (
              <RainbowGlowGradientLineChart
                height={150}
                title="Secondary Trend"
                data={mainChartData}
                xKey="label"
                yKey="y"
              />
            )}
          </div>
        </section>

        {/* ================= UPDATED TABLE SECTION ================= */}
        <section className="lg:px-6 px-1 space-y-4 pb-12">
          {dynamicColumns.length > 0 ? (
            <CommonDataTables
              columns={dynamicColumns}
              data={safeData}
              headerTitle={`${cardType.toUpperCase()} Details`}
              pagination={pagination}
              // ✅ Pass isPageLoading to trigger inline row skeletons
              isFetching={isPageLoading}
              isFetchingMore={isFetchingMore}
              onNext={() =>
                setTableFilters((prev) => ({
                  ...prev,
                  page: (prev.page ?? 1) + 1,
                }))
              }
            />
          ) : (
            /* Only show the big TableSkeleton if we don't even 
               have the header structure yet (First Load). 
            */
            isPageLoading && <TableSkeleton />
          )}
        </section>
      </div>
    </div>
  );
}
