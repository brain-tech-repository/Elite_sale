"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ChevronRight, ChevronLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  description?: string;
  data?: any[]; // 🔥 make generic
  showYearSelector?: boolean;
  year?: string;
  setYear?: (year: string) => void;
  height?: number | string; // 👈 add this
  xKey?: string; // 👈 dynamic
  yKey?: string; // 👈 dynamic
}

// const fallbackData = [
//   { month: "Jan", desktop: 120 },
//   { month: "Mar", desktop: 250 },
//   { month: "May", desktop: 180 },
//   { month: "Jul", desktop: 310 },
//   { month: "Sep", desktop: 220 },
//   { month: "Nov", desktop: 270 },
// ];

const years = Array.from({ length: 2030 - 2001 + 1 }, (_, i) =>
  (2001 + i).toString(),
);

export function RainbowGlowGradientLineChart({
  title = "Sales Trends",
  description = "Monthly Sales",
  data = [],
  showYearSelector = false,
  year,
  setYear,
  height = 320, // 👈 default height
  xKey = "month", // 👈 default
  yKey = "desktop", // 👈 default
}: Props) {
  const ITEMS_PER_PAGE = 15;
  const [page, setPage] = React.useState(0);

  const start = page * ITEMS_PER_PAGE;
  const visibleYears = years.slice(start, start + ITEMS_PER_PAGE);

  // const chartData = data && data.length > 0 ? data : fallbackData;
  const chartData = data ?? [];

  // const firstLabel = chartData[0]?.month;

  // const isNumeric = !isNaN(Number(firstLabel));

  // const customTicks = isNumeric ? ["1", "11", "21", "31"] : undefined;

  return (
    <Card className="shadow-xm py-3 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className=" text-sm">{title}</CardTitle>
        {/* <CardDescription>
            {description} {showYearSelector && year}
          </CardDescription> */}

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
              <div className="flex justify-between ">
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

      <CardContent
        className="w-full lg:px-0 px-0"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* UPDATED X-AXIS */}
            <XAxis
              // dataKey="month"
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              interval={1} // Guarantees the first and last items (e.g., 1 and 31) render
              minTickGap={20} // Forces Recharts to space ticks out mathematically (e.g., 1, 5, 10, 15)
              tickMargin={10} // Adds a little breathing room below the line
              tick={{ fontSize: 12 }}
            />
            {/* 3. Pass the custom ticks and force interval to 0 */}
            {/* <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              ticks={customTicks}
              interval={isNumeric ? 0 : "preserveStartEnd"}
            /> */}
            <YAxis
              width={55}
              tickCount={7}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => {
                if (value >= 1_000_000_000) {
                  return `${Math.round(value / 1_000_000_000)}B`;
                }
                if (value >= 1_000_000) {
                  return `${Math.round(value / 1_000_000)}M`;
                }
                if (value >= 1_000) {
                  return `${Math.round(value / 1_000)}K`;
                }
                return value.toString();
              }}
            />

            <Tooltip formatter={(value: number) => [`${value}`, "Sales"]} />

            <Legend />

            <Line
              type="monotone"
              dataKey={yKey}
              name="Sales"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
