"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

interface RoundedPieChartProps {
  title?: string;
  description?: string;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DuotoneVerticalBarMultipleChart({
  title = "Browser Distribution", // Default title
  description = "January - June 2024", // Default description
}: RoundedPieChartProps) {
  return (
    <Card className="shadow-xm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>January - June 2026</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#default-multiple-pattern-dots)"
            />

            <defs>
              <DottedBackgroundPattern />
            </defs>

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <YAxis tickLine={false} axisLine={false} tickMargin={10} />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" hideLabel />}
            />

            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              shape={<CustomDuotoneBarMultiple />}
              radius={4}
            />

            <Bar
              dataKey="mobile"
              fill="var(--color-mobile)"
              shape={<CustomDuotoneBarMultiple />}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomDuotoneBarMultiple = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string },
) => {
  const { fill, x, y, width, height, dataKey } = props;

  return (
    <>
      <rect
        rx={4}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={`url(#duotone-bar-pattern-${dataKey})`}
      />

      <defs>
        <linearGradient
          id={`duotone-bar-pattern-${dataKey}`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="50%" stopColor={fill} stopOpacity={0.5} />
          <stop offset="50%" stopColor={fill} />
        </linearGradient>
      </defs>
    </>
  );
};

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id="default-multiple-pattern-dots"
      x="0"
      y="0"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <circle
        className="dark:text-muted/40 text-muted"
        cx="2"
        cy="2"
        r="1"
        fill="currentColor"
      />
    </pattern>
  );
};
