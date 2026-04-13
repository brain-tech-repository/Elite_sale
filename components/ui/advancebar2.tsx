"use client";

import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ✅ Config
const chartConfig = {
  Target: { label: "Target", color: "var(--chart-1)" },
  Achievment: { label: "Achievment", color: "var(--chart-2)" },
};

type ChartItem = {
  name: string;
  Target: number;
  Achievment: number;
};

// ✅ dynamic years
const years = Array.from({ length: 2030 - 1991 + 1 }, (_, i) =>
  (1991 + i).toString(),
);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function AdvancedBarChart2({
  data,
  height = 250,
  title = "Target Overview",
  showFilter = false,
  year,
  month,
  sortType,
  setYear,
  setMonth,
  setSortType,
}: {
  data?: ChartItem[];
  height?: number;
  title?: string;
  showFilter?: boolean;
  year?: string;
  month?: string;
  sortType?: string;
  setYear?: (v: string) => void;
  setMonth?: (v: string) => void;
  setSortType?: (v: string) => void;
}) {
  const chartData: ChartItem[] = data || [];

  const [hiddenKeys, setHiddenKeys] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);

  const ITEMS_PER_PAGE = 9;
  const start = page * ITEMS_PER_PAGE;
  const visibleYears = years.slice(start, start + ITEMS_PER_PAGE);

  // ✅ sorting
  let finalData = [...chartData];

  if (sortType === "TARGET") {
    finalData.sort((a, b) => b.Target - a.Target);
  }

  if (sortType === "ACHIEVEMENT") {
    finalData.sort((a, b) => b.Achievment - a.Achievment);
  }

  const formatYAxis = (value: number): string => {
    if (value >= 1_000_000_000) return `${Math.round(value / 1_000_000_000)}B`;
    if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`;
    if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
    return value.toString();
  };

  const handleLegendClick = (dataKey: string) => {
    setHiddenKeys((prev) =>
      prev.includes(dataKey)
        ? prev.filter((key) => key !== dataKey)
        : [...prev, dataKey],
    );
  };

  if (!finalData.length) {
    return (
      <Card className="p-4">
        <CardTitle>{title}</CardTitle>
        <div className="text-center py-10 text-gray-500">No data available</div>
      </Card>
    );
  }

  return (
    <Card className="w-full py-3 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>

        {showFilter && (
          <div className="flex gap-3">
            {/* YEAR */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Year: {year}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[220px]">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {visibleYears.map((y) => (
                    <Button
                      key={y}
                      size="sm"
                      variant={year === y ? "default" : "ghost"}
                      onClick={() => setYear?.(y)}
                    >
                      {y}
                    </Button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={(page + 1) * ITEMS_PER_PAGE >= years.length}
                    onClick={() =>
                      setPage((p) =>
                        (p + 1) * ITEMS_PER_PAGE < years.length ? p + 1 : p,
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* MONTH */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Month: {month}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[220px]">
                <div className="grid grid-cols-3 gap-2">
                  {months.map((m) => (
                    <Button
                      key={m}
                      size="sm"
                      variant={month === m ? "default" : "ghost"}
                      onClick={() => setMonth?.(m)}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* SORT */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {sortType}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[180px]">
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant={sortType === "TARGET" ? "default" : "ghost"}
                    onClick={() => setSortType?.("TARGET")}
                  >
                    Target
                  </Button>

                  <Button
                    size="sm"
                    variant={sortType === "ACHIEVEMENT" ? "default" : "ghost"}
                    onClick={() => setSortType?.("ACHIEVEMENT")}
                  >
                    Achievement
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </CardHeader>

      {/* ================= CHART ================= */}
      <CardContent className="lg:px-0  px-0">
        <div className="w-full">
          <div
            style={{
              width: "100%",
              height,
            }}
          >
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart data={finalData} barGap={4} barCategoryGap="20%">
                <CartesianGrid stroke="#e5e7eb" vertical={false} />

                <XAxis dataKey="name" interval={0} tick={{ fontSize: 11 }} />

                <YAxis width={55} tickFormatter={formatYAxis} />

                <ChartTooltip content={<ChartTooltipContent />} />

                <Legend onClick={(e: any) => handleLegendClick(e.dataKey)} />

                <defs>
                  <linearGradient
                    id="TargetGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#0F2027" />
                    <stop offset="50%" stopColor="#203A43" />
                    <stop offset="100%" stopColor="#2C5364" />
                  </linearGradient>
                </defs>

                {!hiddenKeys.includes("Target") && (
                  <Bar
                    dataKey="Target"
                    fill="url(#TargetGradient)"
                    maxBarSize={40}
                  >
                    {finalData.map((_, i) => (
                      <Cell key={i} />
                    ))}
                  </Bar>
                )}

                {!hiddenKeys.includes("Achievment") && (
                  <Bar
                    dataKey="Achievment"
                    fill="var(--chart-2)"
                    maxBarSize={40}
                  >
                    {finalData.map((_, i) => (
                      <Cell key={i} />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
