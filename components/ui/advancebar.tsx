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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ✅ Updated config
const chartConfig = {
  completion: { label: "Completion", color: "var(--chart-1)" },
  success: { label: "Success", color: "var(--chart-2)" },
  incompletion: { label: "Incompletion", color: "var(--chart-3)" },
};

export function AdvancedBarChart({ data = [] }: { data: any[] }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const formatYAxis = (value: number): string => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  // ✅ Updated keys
  const [visibleKeys] = React.useState({
    completion: true,
    success: true,
    incompletion: true,
  });

  const [hiddenKeys, setHiddenKeys] = React.useState<string[]>([]);

  const handleLegendClick = (dataKey: string) => {
    setHiddenKeys((prev) =>
      prev.includes(dataKey)
        ? prev.filter((key) => key !== dataKey)
        : [...prev, dataKey],
    );
  };

  return (
    <Card className="w-full py-3 shadow-sm">
      <CardHeader>
        <CardTitle>Monthly Trend of Customers Creation</CardTitle>
      </CardHeader>

      <CardContent className="px-2">
        <ChartContainer config={chartConfig} className="w-full min-h-[350px]">
          <BarChart
            data={data}
            barGap={10}
            barCategoryGap="10%"
            margin={{ top: 20, right: 1, left: 1, bottom: 5 }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Gradient */}
            <defs>
              <linearGradient
                id="completionGradient"
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
            <CartesianGrid stroke="#e5e7eb" />
            {/* X Axis */}
            {/* <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: string, index: number) =>
                index % 10 === 0 ? value : ""
              }
            /> */}
            <XAxis
              dataKey="name"
              tickLine={true}
              axisLine={true} // ✅ show axis line
              interval={1} // 👈 shows every 10th item (01, 11, 21...)
            />
            {/* Y Axis */}
            <YAxis
              tickLine={true}
              axisLine={true}
              width={30}
              tickFormatter={formatYAxis}
            />
            {/* Tooltip */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {/* Legend */}
            <Legend
              verticalAlign="bottom"
              align="center"
              onClick={(e: any) => handleLegendClick(e.dataKey)}
            />
            {/* ✅ Completion */}
            {visibleKeys.completion && (
              <Bar
                dataKey="completion"
                fill="url(#completionGradient)"
                radius={[10, 10, 0, 0]}
                maxBarSize={50}
                hide={hiddenKeys.includes("completion")}
              >
                {data.map((_, i) => (
                  <Cell
                    key={`completion-${i}`}
                    fillOpacity={
                      activeIndex === null || activeIndex === i ? 1 : 0.3
                    }
                    onMouseEnter={() => setActiveIndex(i)}
                  />
                ))}
              </Bar>
            )}
            {/* ✅ Success */}
            {visibleKeys.success && (
              <Bar
                dataKey="success"
                fill="var(--chart-2)"
                radius={[10, 10, 0, 0]}
                maxBarSize={50}
                hide={hiddenKeys.includes("success")}
              >
                {data.map((_, i) => (
                  <Cell
                    key={`success-${i}`}
                    fillOpacity={
                      activeIndex === null || activeIndex === i ? 1 : 0.3
                    }
                    onMouseEnter={() => setActiveIndex(i)}
                  />
                ))}
              </Bar>
            )}
            {/* ✅ Incompletion */}
            {visibleKeys.incompletion && (
              <Bar
                dataKey="incompletion"
                fill="var(--chart-3)"
                radius={[10, 10, 0, 0]}
                maxBarSize={50}
                hide={hiddenKeys.includes("incompletion")}
              >
                {data.map((_, i) => (
                  <Cell
                    key={`incompletion-${i}`}
                    fillOpacity={
                      activeIndex === null || activeIndex === i ? 1 : 0.3
                    }
                    onMouseEnter={() => setActiveIndex(i)}
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
