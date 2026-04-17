"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import DataTableHeader from "@/components/table-data/data-table-header";
import { CommonDataTables } from "@/components/table-data/common-tables";
import { exportToCSV } from "@/lib/export";

import MyForm from "./components/filter";
import { performanceColumns } from "./components/columns";
import { PerformanceRow, SalesFilterPayload } from "./types";

export default function CustomerDashboard() {
  const [showTable, setShowTable] = useState(false);

  const [globalFilters, setGlobalFilters] = useState<SalesFilterPayload>({
    trip_number: "",
    trip_date: "",
    route: "",
    salesman: "",
  });

  const staticData: PerformanceRow[] = [
    {
      material_code: "4000006",
      material_name: "MOVIT AVOCADO 70GM",
      pcs_in_carton: 144,
      unit_price: 1806,

      loaded_qty: 210,
      loaded_ctn: 1,
      loaded_dzn: 5,
      loaded_pcs: 6,
      loaded_value: 379171,

      sold_qty: 0,
      sold_ctn: 0,
      sold_dzn: 0,
      sold_pcs: 0,
      sold_value: 0,

      good_qty: 0,
      good_ctn: 0,
      good_dzn: 0,
      good_pcs: 0,
      return_value: 0,

      bad_qty: 0,
      bad_ctn: 0,
      bad_dzn: 0,
      bad_pcs: 0,
      bad_value: 0,

      total_customer: 0,

      damage_qty: 0,
      damage_ctn: 0,
      damage_dzn: 0,
      damage_pcs: 0,
      damage_value: 0,

      closing_qty: 210,
      closing_ctn: 1,
      closing_dzn: 5,
      closing_pcs: 6,
      closing_value: 379171,

      net_stock_qty: 210,
      net_stock_ctn: 1,
      net_stock_dzn: 5,
      net_stock_pcs: 6,
      net_stock_value: 379171,
    },
  ];

  const handleFilterChange = (filters: SalesFilterPayload) => {
    setGlobalFilters(filters);
    setShowTable(true);
  };

  const handleExport = () => {
    exportToCSV(staticData, globalFilters.trip_number || "trip_report");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <header className="py-6 px-2">
          <DataTableHeader title="Trip Closing Report" />
        </header>

        <div className="px-2 mb-4">
          <Card className="lg:px-5">
            <MyForm onFilter={handleFilterChange} />
          </Card>
        </div>

        <section className="px-2 pb-12">
          {!showTable ? (
            <div className="text-center py-10 text-gray-500">
              Please Select Trip Number
            </div>
          ) : (
            <CommonDataTables
              columns={performanceColumns}
              data={staticData}
              headerTitle="Trip Stock Report"
              isFetching={false}
              onExport={handleExport}
            />
          )}
        </section>
      </div>
    </div>
  );
}
