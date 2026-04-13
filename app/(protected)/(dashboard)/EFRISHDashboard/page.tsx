"use client";
import DataTableHeader from "@/components/table-data/data-table-header";
import { SectionCards } from "./components/section-cards";
import { AdvancedBarChart1 } from "@/components/ui/advancebar1";

import MyForm from "./components/filter1";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { DashboardFilters } from "./types";
import { useDashboardStats } from "./usEfris";

export default function Salesdashboa() {
  const [filters, setFilters] = useState<DashboardFilters | undefined>(
    undefined,
  );
  const apiData = [
    { name: "11-03-2026", Target: 8000, Achievment: 7000 },
    { name: "12-03-2026", Target: 8250, Achievment: 7200 },
    { name: "13-03-2026", Target: 8600, Achievment: 7500 },
    { name: "14-03-2026", Target: 8900, Achievment: 7800 },
    { name: "15-03-2026", Target: 9200, Achievment: 8100 },
    { name: "16-03-2026", Target: 9500, Achievment: 8400 },
    { name: "12-03-2026", Target: 8250, Achievment: 7200 },
    { name: "13-03-2026", Target: 8600, Achievment: 7500 },
    { name: "14-03-2026", Target: 8900, Achievment: 7800 },
    { name: "15-03-2026", Target: 9200, Achievment: 8100 },
    { name: "16-03-2026", Target: 9500, Achievment: 8400 },
  ];

  const { data, isLoading, isError } = useDashboardStats(filters);
  console.log("card data", data);
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          {/* PAGE HEADER */}
          <div className=" py-6 lg:px-6">
            <DataTableHeader title="EFRIS Dashboard" />
          </div>
          <div className="px-2 mb-4 lg:px-6 py-2">
            <Card className="shadow-xm  py-1">
              <MyForm onFilter={(newFilters) => setFilters(newFilters)} />
            </Card>
          </div>
          {/* KPI CARDS */}
          <div className="lg:px-6 px-1 pb-6 px-2">
            <SectionCards
              data={data}
              isLoading={isLoading}
              isError={isError}
              filters={filters}
            />
          </div>
          {/* SECTION 3 */}
          <div className="lg:px-6 px-1 pb-10">
            <section className="grid gap-6 mt-4 grid-cols-1 lg:grid-cols-1">
              <AdvancedBarChart1
                data={apiData}
                height={250}
                title="Route Invoice"
              />

              <AdvancedBarChart1
                data={apiData}
                height={250}
                title="Stock Adjustment"
              />
              <AdvancedBarChart1
                data={apiData}
                height={250}
                title="Good Receipt Note (GRN)"
              />

              <AdvancedBarChart1
                data={apiData}
                height={250}
                title="Route Return"
              />
              <AdvancedBarChart1
                data={apiData}
                height={250}
                title="Counter Sale"
              />

              <AdvancedBarChart1
                data={apiData}
                height={250}
                title="Sales Invoice"
              />
              <AdvancedBarChart1
                data={apiData}
                height={250}
                title="Order Return"
              />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
