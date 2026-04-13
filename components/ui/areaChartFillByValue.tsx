"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { TrendingUp } from "lucide-react";

/* ---------------- Data ---------------- */

const chartData = [
  { page: "A", uv: 4000, pv: 2400 },
  { page: "B", uv: 3000, pv: 1398 },
  { page: "C", uv: -1000, pv: 9800 },
  { page: "D", uv: 500, pv: 3908 },
  { page: "E", uv: -2000, pv: 4800 },
  { page: "F", uv: -250, pv: 3800 },
  { page: "G", uv: 3490, pv: 4300 },
];

interface RoundedPieChartProps {
  title?: string;
  description?: string;
}

/* ---------------- Chart Config ---------------- */

const chartConfig = {
  uv: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
  pv: {
    label: "Page Views",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type ActiveProperty = keyof typeof chartConfig;

/* ---------------- Chart ---------------- */

export default function HoverAreaChart({
  title = "Browser Distribution", // Default title
  description = "January - June 2024", // Default description
}: RoundedPieChartProps) {
  const [activeProperty, setActiveProperty] =
    React.useState<ActiveProperty | null>(null);

  return (
    <Card className="shadow-xm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Showing page analytics for last 7 pages
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="page"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <YAxis />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* -------- Gradients -------- */}

            <defs>
              <linearGradient id="stroke-uv" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="100%" stopColor="#155e75" />
              </linearGradient>

              <linearGradient id="grad-uv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#020617" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#155e75" stopOpacity={0.05} />
              </linearGradient>

              <linearGradient id="grad-pv" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pv)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pv)"
                  stopOpacity={0}
                />
              </linearGradient>

              <HatchedPattern config={chartConfig} />
            </defs>

            {/* -------- Areas -------- */}

            <Area
              dataKey="uv"
              type="natural"
              stroke="url(#stroke-uv)" // 🔥 gradient line
              strokeWidth={2}
              fill={
                activeProperty === "uv" ? "url(#pattern-uv)" : "url(#grad-uv)" // 🌫️ lighter area
              }
              onMouseEnter={() => setActiveProperty("uv")}
              onMouseLeave={() => setActiveProperty(null)}
            />
            <Area
              dataKey="pv"
              type="natural"
              stroke="var(--color-pv)"
              strokeWidth={2}
              fill={
                activeProperty === "pv" ? "url(#pattern-pv)" : "url(#grad-pv)"
              }
              onMouseEnter={() => setActiveProperty("pv")}
              onMouseLeave={() => setActiveProperty(null)}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/* ---------------- Pattern Component ---------------- */

const HatchedPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, value.color]),
  );

  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <pattern
          key={key}
          id={`pattern-${key}`}
          x="0"
          y="0"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect width="10" height="10" opacity={0.05} fill={value} />
          <rect width="1" height="10" fill={value} />
        </pattern>
      ))}
    </>
  );
};
