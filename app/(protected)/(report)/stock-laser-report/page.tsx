"use client";

import React, { useMemo, useState } from "react";
import { SalesFilterPayload } from "./types";
import { CommonDataTables } from "@/components/table-data/common-tables";
import MyForm from "./components/filter";
import { Card } from "@/components/ui/card";
import DataTableHeader from "@/components/table-data/data-table-header";
import { performanceColumns } from "./components/columns";
import { useStockLedgerReport } from "./useCustomers";
import { RowDetailsModal } from "./components/RowDetailModal";
import { exportToCSV } from "@/lib/export";

// Import the new extracted component

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
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ SINGLE HOOK CALL: Using the infinite query version
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading, // Initial loading state
    isFetchingNextPage, // Loading more state
  } = useStockLedgerReport(globalFilters);

  // ✅ MEMOIZED DATA: Flatten all pages into one array for the table
  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  // ✅ PAGINATION: Get info from the last fetched page to show stats
  const lastPagination = data?.pages[data.pages.length - 1]?.pagination;

  const handleExportAll = () => {
    if (flatData.length === 0) return;
    const dateStr = globalFilters.fromdate || "report";
    // Exports whatever is currently loaded in the infinite scroll
    exportToCSV(flatData, `stock_report_${dateStr}`);
  };

  const handleFilterChange = (f: SalesFilterPayload) => {
    setGlobalFilters(f);
    setShowTable(true);
  };

  const handleRowClick = (rowData: any) => {
    setSelectedRow(rowData);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <header className="py-6 px-2">
          <DataTableHeader title="Stock Ledger Report" />
        </header>

        <div className="px-2 mb-4">
          <Card className="shadow-xm lg:px-5">
            <MyForm onFilter={handleFilterChange} />
          </Card>
        </div>

        <section className="px-2 pb-12">
          {!showTable ? (
            <div className="text-center py-10 text-gray-500">
              Please apply filters to view data
            </div>
          ) : (
            <CommonDataTables
              columns={performanceColumns}
              data={flatData}
              headerTitle={"Stock Ledger Table"}
              pagination={lastPagination}
              // isFetching={isFetching}
              isFetching={isLoading}
              onFilter={handleFilterChange}
              onExport={handleExportAll}
              onRowClick={handleRowClick}
              onNext={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
            />
          )}
        </section>
      </div>

      {/* Extracted Modal Component */}
      <RowDetailsModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        selectedRow={selectedRow}
      />
    </div>
  );
}
