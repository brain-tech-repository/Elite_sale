"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  data?: { month: string; desktop: number }[];
  selectedMonth?: string | null;
  setSelectedMonth?: (month: string | null) => void;
  height?: number; // 👈 NEW
  showMonthFilter?: boolean; // 👈 NEW
  xKey?: string; // ✅ ADD THIS
  yKey?: string; // ✅ ADD THIS
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function AnimatedHighlightedAreaChart({
  title = "Sales Trends",
  description = "Last 12 Months",
  data = [],
  selectedMonth,
  setSelectedMonth,
  height = 320, // 👈 default height
  xKey,
  yKey,
  showMonthFilter = false, // 👈 default = visible
}: Props) {
  /* FIX: We removed the .slice() logic here. 
     The monthly data for days 01-31 is already handled by your useMonthlySalesTrend hook.
  */
  const chartData = React.useMemo(() => {
    return data;
  }, [data]);

  return (
    <Card className="shadow-xm py-3">
      <CardHeader className="flex flex-row items-start justify-between text-sm">
        <CardTitle>{title}</CardTitle>

        {/* Month Filter UI - UNCHANGED */}
        {showMonthFilter && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[110px]">
                {selectedMonth ? selectedMonth.slice(0, 3) : "Month"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px]">
              <div className="grid grid-cols-3 gap-2">
                {months.map((month) => (
                  <Button
                    key={month}
                    variant={selectedMonth === month ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedMonth?.(month)}
                  >
                    {month.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>

      <CardContent style={{ height }} className="w-full lg:px-0">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No sales data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey || "month"}
                type="category" // ✅ FIX (important)
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                width={50} // 👈 control axis width (increase if labels cut)
                tickCount={8} // 👈 control number of ticks (reduce gap)
                tickLine={false}
                axisLine={false}
                /* Strictly uses k (thousands) for all values */
                tickFormatter={(value: number) => {
                  if (value >= 1_000_000_000) {
                    return `${value / 1_000_000_000}B`;
                  }
                  if (value >= 1_000_000) {
                    return `${value / 1_000_000}M`;
                  }
                  if (value >= 1_000) {
                    return `${value / 1_000}K`;
                  }
                  return value.toString();
                }}
              />

              <Tooltip
                formatter={(value: number) => [
                  new Intl.NumberFormat().format(value),
                  "Sales",
                ]}
              />

              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#38bdf8" // sky-400
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="#38bdf8" // sky-400
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Legend />
              <Area
                type="monotone"
                dataKey={yKey || "desktop"}
                name="Sales"
                stroke="#0ea5e9"
                fill="url(#salesGradient)"
                strokeWidth={2}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
