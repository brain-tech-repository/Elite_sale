"use client";

import React, { useMemo, useState } from "react";
import { SalesFilterPayload } from "./types";
import { CommonDataTables } from "@/components/table-data/common-tables";
import MyForm from "./components/filter";
import { Card } from "@/components/ui/card";
import DataTableHeader from "@/components/table-data/data-table-header";
import { performanceColumns } from "./components/columns";
import { RowDetailsModal } from "./components/RowDetailModal";
import { exportToCSV } from "@/lib/export";

export default function CustomerDashboard() {
  const [globalFilters, setGlobalFilters] = useState<SalesFilterPayload>({
    fromdate: "",
    todate: "",
    warehouse_id: "",
    route_id: "",
    trip_id: "",
  });

  const [showTable, setShowTable] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create a local state to hold the static data once filtered
  const [reportData, setReportData] = useState<any[]>([]);

  const handleFilterChange = (f: SalesFilterPayload) => {
    setGlobalFilters(f);

    // --- GENERATE STATIC DATA IMMEDIATELY ---
    // This mimics what your report would look like.
    // You can keep these as hardcoded defaults or pass values from 'f' if needed.
    const staticRows = [
      { s_no: "", particulars: "Stock", amounts: null },
      { s_no: "A", particulars: "Opening Stock (A)", amounts: 275000 },
      {
        s_no: "B",
        particulars: "Additional Stock Received (Refills)",
        amounts: 4020340,
      },
      { s_no: "C", particulars: "Customer Returns", amounts: 713699 },
      {
        s_no: "D",
        particulars: "Total Stock on the Van(A+B+C)",
        amounts: 5009039,
      },
      { s_no: "E", particulars: "Van Returned stock", amounts: 4583319 },
      {
        s_no: "F",
        particulars: "Net Stock(Total Unload - (Damages+ Bad Returns))",
        amounts: 4583319,
      },

      { s_no: "", particulars: "Sales", amounts: null },
      { s_no: "G", particulars: "Estimated Trip sales(D-E)", amounts: 425720 },
      {
        s_no: "H",
        particulars: "Actual Trip Sales (Total Invoice Value)",
        amounts: 425720,
      },
      { s_no: "I", particulars: "Discounts Given", amounts: 0 },
      { s_no: "J", particulars: "Trip Net Sales (H-I)", amounts: 425720 },

      { s_no: "", particulars: "CUSTOMER DEBTS", amounts: null },
      {
        s_no: "K",
        particulars: "Trip Opening Outstanding Balance",
        amounts: 0,
      },
      {
        s_no: "L",
        particulars: "Credit Sales from Current Trip",
        amounts: 16500,
      },
      {
        s_no: "M",
        particulars: "Total Cash Collections in Current Trip",
        amounts: 409220,
      },
      { s_no: "N", particulars: "Collections From Previous Trip", amounts: 0 },
      {
        s_no: "O",
        particulars: "Outstanding/Closing Debts Balance(K + L - N)",
        amounts: 16500,
      },

      { s_no: "", particulars: "Collections & Bankings", amounts: null },
      {
        s_no: "P",
        particulars:
          "Current Trip Cash Sales (Trip Net Sales - Trip Credit Sales)",
        amounts: 425720,
      },
      {
        s_no: "Q",
        particulars: "Total Cash Collections(P+N)",
        amounts: 409220,
      },
      { s_no: "R", particulars: "Cheques", amounts: 0 },
      { s_no: "S", particulars: "Expenses", amounts: 0 },
      { s_no: "T", particulars: "Total Expected Cash Banked", amounts: 409220 },
      { s_no: "U", particulars: "Actual Cash Banked", amounts: 0 },
      { s_no: "V", particulars: "Variance(T-U)", amounts: 409220 },
    ];

    setReportData(staticRows);
    setShowTable(true);
  };

  const handleExportAll = () => {
    if (reportData.length === 0) return;
    exportToCSV(reportData, `stock_report_static`);
  };

  const handleRowClick = (rowData: any) => {
    if (!rowData.s_no) return; // Don't open modal for headers
    setSelectedRow(rowData);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <header className="py-6 px-2">
          <DataTableHeader title="Stock Ledger Report (Static View)" />
        </header>

        <div className="px-2 mb-4">
          <Card className="shadow-xm lg:px-5">
            <MyForm onFilter={handleFilterChange} />
          </Card>
        </div>

        <section className="px-2 pb-12">
          {!showTable ? (
            <div className="text-center py-10 text-gray-500 border rounded-lg border-dashed">
              Please apply filters to view the static report
            </div>
          ) : (
            <CommonDataTables
              columns={performanceColumns}
              data={reportData} // Using local static state
              headerTitle={"Stock Ledger Table"}
              isFetching={false} // No loading state needed for static data
              onFilter={handleFilterChange}
              onExport={handleExportAll}
              onRowClick={handleRowClick}
              height={600} // Increased height to see the full ledger
            />
          )}
        </section>
      </div>

      <RowDetailsModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        selectedRow={selectedRow}
      />
    </div>
  );
}
