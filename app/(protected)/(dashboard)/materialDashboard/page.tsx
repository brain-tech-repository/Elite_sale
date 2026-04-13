"use client";
import DataTableHeader from "@/components/table-data/data-table-header";
import MyForm from "./components/filter";
import { SectionCards } from "./components/section-cards";
import { RainbowGlowGradientLineChart } from "@/components/ui/rainbow-glow-gradient-line";
import DataTableSubHeader from "@/components/table-data/data-table-sub-header";
import { CommonDataTable } from "@/components/table-data/custom-table";
import { CommonDataTables } from "@/components/table-data/common-tables";
import { salesColumns } from "./components/columns";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { AnimatedHighlightedAreaChart } from "@/components/ui/animated-highlighted-chart";
import {
  useActiveSkus,
  useInactiveSkus,
  useMaterialPerformance,
  useTopMaterialByValue,
  useTopMaterialByVolume,
  useValueGrowthChart,
  useVolumeGrowthChart,
} from "./useMaterial";
import { SalesFilterPayload } from "./types";
import { skuColumns } from "./components/columns1";
import { ChartSkeleton } from "@/components/ui/dashboard-skeleton";
import GradientBarChart from "@/components/ui/BarChart";

export default function Salesdashboa() {
  const [filters, setFilters] = React.useState<SalesFilterPayload>({});
  const [tableFilters, setTableFilters] = useState({
    page: 1,
    length: 10,
  });

  useEffect(() => {
    setTableFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    setAllData([]);
  }, [filters]);

  /* =========================
      API CALLS
  ========================= */
  const { data: materialRes, isFetching: materialFetching } =
    useMaterialPerformance(filters, tableFilters.page, tableFilters.length);

  const materialData = materialRes?.tableData ?? [];
  const pagination = materialRes?.pagination;

  const { data: activeSkus = [], isFetching: activeFetching } =
    useActiveSkus(filters);
  const { data: inactiveSkus = [], isFetching: inactiveFetching } =
    useInactiveSkus(filters);

  const {
    data: volumeGrowth = { daily: [], monthly: [], yearly: [] },
    isLoading: volumeLoading,
  } = useVolumeGrowthChart(filters);
  const {
    data: valueGrowth = { daily: [], monthly: [], yearly: [] },
    isLoading: valueLoading,
  } = useValueGrowthChart(filters);
  const { data: topVolume = [], isLoading: volumesLoading } =
    useTopMaterialByVolume(filters);
  const { data: topValue = [], isLoading: valuesLoading } =
    useTopMaterialByValue(filters);

  /* =========================
      DATA ACCUMULATION
  ========================= */
  const [allData, setAllData] = useState<any[]>([]);

  useEffect(() => {
    if (!materialData) return;
    setAllData((prev) => {
      if (tableFilters.page === 1) return materialData;
      return [...prev, ...materialData];
    });
  }, [materialData, tableFilters.page]);

  const handleNext = () => {
    if (pagination?.current_page < pagination?.total_pages) {
      setTableFilters((prev) => ({
        ...prev,
        page: pagination.current_page + 1,
      }));
    }
  };

  const handlePrev = () => {
    if (pagination?.current_page > 1) {
      setTableFilters((prev) => ({
        ...prev,
        page: pagination.current_page - 1,
      }));
    }
  };

  /* =========================
      DERIVED LOADING STATES
  ========================= */
  const page = tableFilters.page ?? 1;
  // This triggers the inline pulse skeleton for the main table
  const isMainTableInitialLoading = materialFetching && page === 1;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="py-6 px-6">
          <DataTableHeader title="Material Dashboard" />
        </div>

        <div className="lg:px-6 px-1 pb-4">
          <Card className="shadow-xm">
            <MyForm onFilter={setFilters} />
          </Card>
        </div>

        <div className="lg:px-6 px-1 pb-6">
          <SectionCards filters={filters} />
        </div>

        <div className="lg:px-6 px-1 pb-8">
          <section className="grid gap-2 mt-4 grid-cols-1 lg:grid-cols-2">
            <div className="lg:col-span-1 space-y-2">
              <DataTableSubHeader title="Top Material By Volume" />
              {volumesLoading ? (
                <ChartSkeleton />
              ) : (
                <GradientBarChart
                  data={topVolume}
                  xKey="label"
                  yKey="y"
                  truncateLabel={(val) =>
                    val.length > 25 ? val.slice(0, 25) + "..." : val
                  }
                />
              )}
            </div>
            <div className="lg:col-span-1 space-y-2">
              <DataTableSubHeader title="Top Material By Value" />
              {valuesLoading ? (
                <ChartSkeleton />
              ) : (
                <GradientBarChart
                  data={topValue}
                  xKey="label"
                  yKey="y"
                  truncateLabel={(val) =>
                    val.length > 25 ? val.slice(0, 25) + "..." : val
                  }
                />
              )}
            </div>
          </section>
        </div>

        {/* MAIN PERFORMANCE TABLE: Skeletons removed in favor of inline loaders */}
        <section className="px-2 lg:px-6 pb-12">
          <CommonDataTables
            headerTitle="Material Performance"
            columns={salesColumns}
            data={allData}
            pagination={pagination}
            // ✅ UPDATED: Trigger inline pulse skeleton
            isFetching={isMainTableInitialLoading}
            isFetchingMore={materialFetching && page > 1}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </section>

        <div className="lg:px-6 px-1 pb-10">
          <DataTableSubHeader title="Material Volume Growth" />
          <section className="grid gap-2 mt-4 grid-cols-1 lg:grid-cols-3">
            {volumeLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <RainbowGlowGradientLineChart
                  data={volumeGrowth.daily}
                  xKey="label"
                  yKey="y"
                  title="Daily"
                />
                <AnimatedHighlightedAreaChart
                  data={volumeGrowth.monthly}
                  xKey="label"
                  yKey="y"
                  title="Monthly"
                />
                <RainbowGlowGradientLineChart
                  data={volumeGrowth.yearly}
                  xKey="label"
                  yKey="y"
                  title="Yearly"
                />
              </>
            )}
          </section>
        </div>

        <div className="lg:px-6 px-1 pb-10">
          <DataTableSubHeader title="Material Value Growth" />
          <section className="grid gap-2 mt-4 grid-cols-1 lg:grid-cols-3">
            {valueLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <RainbowGlowGradientLineChart
                  data={valueGrowth.daily}
                  xKey="label"
                  yKey="y"
                  title="Daily"
                />
                <AnimatedHighlightedAreaChart
                  data={valueGrowth.monthly}
                  xKey="label"
                  yKey="y"
                  title="Monthly"
                />
                <RainbowGlowGradientLineChart
                  data={valueGrowth.yearly}
                  xKey="label"
                  yKey="y"
                  title="Yearly"
                />
              </>
            )}
          </section>
        </div>

        {/* ACTIVE / INACTIVE SKUs: Skeletons removed in favor of internal pulse loaders */}
        <section className="grid gap-2 mt-4 grid-cols-1 lg:grid-cols-2 lg:px-6 px-1 pb-10">
          <div className="lg:col-span-1 space-y-2">
            <DataTableSubHeader title="Active SKUs (Last 2 Weeks)" />
            <CommonDataTable
              columns={skuColumns}
              data={activeSkus}
              pageSize={5}
              // ✅ UPDATED: Pass fetching state directly to table rows
              isFetching={activeFetching}
            />
          </div>
          <div className="lg:col-span-1 space-y-2">
            <DataTableSubHeader title="Inactive SKUs (Last 2 Weeks)" />
            <CommonDataTable
              columns={skuColumns}
              data={inactiveSkus}
              pageSize={5}
              // ✅ UPDATED: Pass fetching state directly to table rows
              isFetching={inactiveFetching}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
