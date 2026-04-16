"use client";

import { useState } from "react";
import { SalesFilterPayload } from "./types";
import { CommonDataTables } from "@/components/table-data/common-tables";
import MyForm from "./components/filter";
import { Card } from "@/components/ui/card";
import DataTableHeader from "@/components/table-data/data-table-header";
import { performanceColumns } from "./components/columns";
import { useStockLedgerReport } from "./useCustomers"; // ✅ Import hook

export default function CustomerDashboard() {
  const [globalFilters, setGlobalFilters] = useState<SalesFilterPayload>({
    fromdate: "",
    todate: "",
    warehouse_id: "",
    brand_id: "",
    material_type_id: "",
    material_id: "",
  });

  const [showTable, setShowTable] = useState(false);

  /* =========================
      API INTEGRATION
  ========================= */
  const {
    data: reportResponse,
    isFetching,
    refetch,
  } = useStockLedgerReport(globalFilters);

  const allData = reportResponse?.data || [];

  const handleExport = () => {
    if (allData.length === 0) return;

    const headers = Object.keys(allData[0]).join(",");
    const rows = allData
      .map((row: any) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `stock_report_${globalFilters.fromdate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =========================
      HANDLERS
  ========================= */
  const handleFilterChange = (f: SalesFilterPayload) => {
    setGlobalFilters(f);
    setShowTable(true);
    // TanStack Query will automatically refetch because globalFilters (the queryKey) changed
  };

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
              headerTitle={
                reportResponse?.total_closing_value
                  ? `Stock Ledger Table (Total Closing: ${reportResponse.total_closing_value})`
                  : "Stock Ledger Table"
              }
              pagination={undefined}
              onNext={() => {}}
              onPrev={() => {}}
              isFetching={isFetching} // ✅ Shows loading state during API calls
              isFetchingMore={false}
              onFilter={handleFilterChange}
              onExport={handleExport}
            />
          )}
        </section>
      </div>
    </div>
  );
}
