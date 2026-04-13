"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DefaultBarChartProps {
  title?: string;
  data?: {
    label?: string | number;
    current?: number;
    previous?: number;
  }[];
  loading?: boolean;
  height?: number | string;

  // ✅ SAME AS LINE CHART
  showYearSelector?: boolean;
  year?: string;
  setYear?: (year: string) => void;
}

const years = Array.from({ length: 2030 - 2001 + 1 }, (_, i) =>
  (2001 + i).toString(),
);

export function DefaultBarChart({
  title = "Bar Chart",
  data = [],
  loading,
  height = 320,
  showYearSelector = true,
  year,
  setYear,
}: DefaultBarChartProps) {
  const ITEMS_PER_PAGE = 15;
  const [page, setPage] = useState(0);

  const visibleYears = years.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );

  if (loading) {
    return (
      <div className="flex h-[260px] items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      {/* ✅ HEADER */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>

        {/* ✅ Year Selector */}
        {showYearSelector && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[100px] text-sm">
                {year}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px]">
              <div className="grid grid-cols-3 gap-2">
                {visibleYears.map((y) => (
                  <Button
                    key={y}
                    variant={year === y ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setYear?.(y)}
                  >
                    {y}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={(page + 1) * ITEMS_PER_PAGE >= years.length}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>

      {/* ✅ CHART */}
      <CardContent
        className="w-full"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={4}
            barCategoryGap="15%"
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            {/* GRID */}
            <CartesianGrid
              stroke="#f3f4f6"
              strokeDasharray="3 3"
              vertical={false}
            />

            {/* AXIS */}
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={40} />

            {/* TOOLTIP */}
            <Tooltip />

            {/* LEGEND */}
            <Legend />

            {/* BARS */}
            <Bar
              dataKey="current"
              fill="var(--chart-1)"
              radius={[8, 8, 0, 0]}
              barSize={18}
            />

            <Bar
              dataKey="previous"
              fill="var(--chart-2)"
              radius={[8, 8, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
