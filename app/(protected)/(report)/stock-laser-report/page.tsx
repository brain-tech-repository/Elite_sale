"use client";

import { useState } from "react";
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

  const { data: reportResponse, isFetching } =
    useStockLedgerReport(globalFilters);
  const allData = reportResponse?.data || [];

  const handleExportAll = () => {
    const dateStr = globalFilters.fromdate || "report";
    exportToCSV(allData, `stock_report_${dateStr}`);
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
              data={allData}
              headerTitle={"Stock Ledger Table"}
              isFetching={isFetching}
              onFilter={handleFilterChange}
              onExport={handleExportAll}
              onRowClick={handleRowClick}
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
