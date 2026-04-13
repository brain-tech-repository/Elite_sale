"use client";
import DataTableHeader from "@/components/table-data/data-table-header";
import { SectionCards } from "./components/section-cards";
import { HighlightedMultipleBarChart } from "@/components/ui/highlighted-double-bar-chart";
import { AdvancedBarChart1 } from "@/components/ui/advancebar1";
import { AdvancedBarChart2 } from "@/components/ui/advancebar2";
type Sale = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "Completed" | "Pending" | "Cancelled";
  date: string;
};
export default function Salesdashboa() {
  const apiData = [
    { name: "11-03-2026", Target: 8000, Achievment: 7000 },
    { name: "12-03-2026", Target: 8250, Achievment: 7200 },
    { name: "13-03-2026", Target: 8600, Achievment: 7500 },
    { name: "14-03-2026", Target: 8900, Achievment: 7800 },
    { name: "15-03-2026", Target: 9200, Achievment: 8100 },
    { name: "16-03-2026", Target: 9500, Achievment: 8400 },
  ];
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          {/* PAGE HEADER */}
          <div className=" py-6 px-6">
            <DataTableHeader title="SAP Dashboard" />
          </div>
          {/* KPI CARDS */}
          <div className="lg:px-6 px-1 pb-6">
            <SectionCards />
          </div>
          {/* SECTION 3 */}
          <div className="lg:px-6 px-1 pb-10">
            <section className="grid gap-6 mt-4 grid-cols-1 lg:grid-cols-2">
              <AdvancedBarChart2
                data={apiData}
                height={250}
                title="Good Receipt Note (GRN)"
              />
              <AdvancedBarChart2
                data={apiData}
                height={250}
                title="Good Receipt Note (GRN)"
              />
              <AdvancedBarChart2
                data={apiData}
                height={250}
                title="Good Receipt Note (GRN)"
              />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
