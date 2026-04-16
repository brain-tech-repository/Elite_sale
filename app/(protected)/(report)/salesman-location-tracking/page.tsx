"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DataTableHeader from "@/components/table-data/data-table-header";
import MyForm from "./components/filter";
import { SectionCards } from "./components/section-cards";
import { Card } from "@/components/ui/card";
import { SalesFilterPayload } from "./types";

// 🔥 Dynamically import map (IMPORTANT for Next.js)
const LeafletMap = dynamic(() => import("./components/LeafletMap"), {
  ssr: false,
});

export default function Salesdashboa() {
  const [globalFilters, setGlobalFilters] = useState<SalesFilterPayload>({});

  const [tableFilters, setTableFilters] = useState<SalesFilterPayload>({
    page: 1,
    length: 10,
  });

  const handleGlobalFilterChange = (filters: SalesFilterPayload) => {
    setGlobalFilters(filters);
    setTableFilters((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <header className="py-4 px-2">
          <DataTableHeader title="Salesman Location Tracking" />
        </header>

        <div className="px-2">
          <Card className="shadow-xs lg:px-4 mb-4">
            <MyForm onFilter={handleGlobalFilterChange} />
          </Card>
        </div>

        <section className="px-2 mb-6">
          <SectionCards filters={globalFilters} />
        </section>

        {/* ✅ MAP SECTION */}
        <section className="px-2 mb-6">
          <Card className="p-4">
            <h2 className="mb-4 font-semibold">Location Map</h2>
            <LeafletMap />
          </Card>
        </section>
      </div>
    </div>
  );
}
