"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

const chartData = [
  { month: "January", desktop: 186, mobile: 87 },
  { month: "February", desktop: 305, mobile: 163 },
  { month: "March", desktop: 237, mobile: 142 },
  { month: "April", desktop: 73, mobile: 195 },
  { month: "May", desktop: 209, mobile: 118 },
  { month: "June", desktop: 214, mobile: 231 },
];
interface RoundedPieChartProps {
  title?: string;
  description?: string;
}
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function GlowingLineChart({
  title = "Browser Distribution", // Default title
  description = "January - June 2024", // Default description
}: RoundedPieChartProps) {
  return (
    <Card className="shadow-xm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="bump"
              stroke="var(--chart-2)"
              dot={false}
              strokeWidth={2}
              filter="url(#rainbow-line-glow)"
            />
            <Line
              dataKey="mobile"
              type="bump"
              stroke="url(#mobileGradient)" // ✅ use gradient
              dot={false}
              strokeWidth={2}
              filter="url(#rainbow-line-glow)"
            />
            <defs>
              <filter
                id="rainbow-line-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <defs>
              {/* Glow filter (already present) */}
              <filter
                id="rainbow-line-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* ✅ Gradient for mobile line */}
              <linearGradient id="mobileGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0F2027" />
                <stop offset="50%" stopColor="#203A43" />
                <stop offset="100%" stopColor="#2C5364" />
              </linearGradient>
            </defs>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
