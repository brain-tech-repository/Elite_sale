"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

const chartData = [
  { month: "1", desktop: 3 },
  { month: "10", desktop: 1 },
  { month: "10", desktop: 2 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RainbowGlowGradientLineCharts() {
  return (
    <Card className="shadow-xm">
      <CardHeader>
        <CardTitle>
          Rainbow Line Chart
          <Badge
            variant="outline"
            className="text-red-500 bg-red-500/10 border-none ml-2"
          >
            <TrendingDown className="h-4 w-4" />
            <span>-5.2%</span>
          </Badge>
        </CardTitle>

        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent>
        {/* 👇 fixed height container */}
        <div className="h-[100px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />

                <YAxis tickLine={false} axisLine width={30} />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="desktop"
                  type="monotone"
                  stroke="#3b82f6"
                  dot={false}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
