"use client";

import { useState } from "react";
import { SalesFilterPayload } from "./types";
import { CommonDataTables } from "@/components/table-data/common-tables";
import MyForm from "./components/filter";
import { Card } from "@/components/ui/card";
import DataTableHeader from "@/components/table-data/data-table-header";
import { performanceColumns } from "./components/columns";

export default function CustomerDashboard() {
  /* =========================
      STATE MANAGEMENT
  ========================= */

  const [globalFilters, setGlobalFilters] = useState<SalesFilterPayload>({});
  const [showTable, setShowTable] = useState(false);

  const [allData, setAllData] = useState<any[]>([]);

  /* =========================
      DUMMY DATA
  ========================= */

  const dummyData = [
    {
      material_code: "4000310",
      material_name: "*******DO NOT USE********",
      uom: "Pcs",
      unit_price: 0.01,
      opening_qty: 10,
      receipt_qty: 0,
      issued_qty: 0,
      closing_qty: 10,
      closing_value: 0.1,
      packing_size: 24,
      ctn: 0,
      dzn: 0,
      pcs: 10,
    },
    {
      material_code: "4000000",
      material_name: "MOVIT APPLE SHAMPOO 1 LT",
      uom: "Pcs",
      unit_price: 1910.64,
      opening_qty: 5,
      receipt_qty: 0,
      issued_qty: 0,
      closing_qty: 5,
      closing_value: 9553.2,
      packing_size: 12,
      ctn: 0,
      dzn: 0,
      pcs: 5,
    },
  ];

  const handleExport = () => {
    console.log("Export clicked");

    const csv = [
      Object.keys(allData[0] || {}).join(","),
      ...allData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "stock_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =========================
      HANDLERS
  ========================= */

  const handleFilterChange = (f: SalesFilterPayload) => {
    setGlobalFilters(f);

    // Show table
    setShowTable(true);

    // Load dummy data
    setAllData(dummyData);
  };

  /* =========================
      UI
  ========================= */

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <header className="py-6 px-2">
          <DataTableHeader title="Stock Ledger Report" />
        </header>

        {/* Filter Section */}
        <div className="px-2 mb-4">
          <Card className="shadow-xm lg:px-5">
            <MyForm onFilter={handleFilterChange} />
          </Card>
        </div>

        {/* Table Section */}
        <section className="px-2 pb-12">
          {!showTable ? (
            <div className="text-center py-10 text-gray-500">
              Please apply filters to view data
            </div>
          ) : (
            <CommonDataTables
              columns={performanceColumns}
              data={allData}
              headerTitle="Stock Ledger Table"
              pagination={undefined}
              onNext={() => {}}
              onPrev={() => {}}
              isFetching={false}
              isFetchingMore={false}
              onFilter={handleFilterChange}
              onExport={handleExport} // ✅ CORRECT
            />
          )}
        </section>
      </div>
    </div>
  );
}
