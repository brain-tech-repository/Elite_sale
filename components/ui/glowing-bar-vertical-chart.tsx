"use client";

import { TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React from "react";

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

export const description = "A bar chart";

/* ---------------- REGION COLOR PALETTE ---------------- */

const regionColorMap: Record<string, string> = {
  "mid west": "#168ee4", // blue
  "north west": "#28c9d4", // cyan
  "south west": "#0d8faf", // teal blue
  nile: "#072246", // navy

  central: "#0e6c79", // dark teal
  "central 1": "#033042", // royal blue
  "central 2": "#6c64db", // green

  albertine: "#1f7051", // forest green
  "west nile": "#26570f", // olive green
  east: "#3fa880", // mint green
  north: "#17becf", // aqua

  "lake zone": "#4e79a7", // steel blue
  "west w": "#321f99", // indigo
  south: "#2a857d", // sea green
  metro: "#8a6d1f", // mustard brown
};
/* ---------------- CHART CONFIG ---------------- */

const chartConfig = {
  value: {
    label: "Customers",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ActiveProperty = string | "all";

/* ---------------- PROPS ---------------- */

interface Props {
  data?: any[];
  regions?: string[];
}

/* ---------------- COMPONENT ---------------- */

export function GlowingBarVerticalChart({ data = [], regions = [] }: Props) {
  const [activeProperty, setActiveProperty] =
    React.useState<ActiveProperty>("all");
  const [isMobile, setIsMobile] = React.useState(false);

  // NEW: State to track which regions are currently hidden
  const [hiddenRegions, setHiddenRegions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // NEW: Toggle function for hiding/showing regions
  const toggleRegion = (region: string) => {
    setHiddenRegions(
      (prev) =>
        prev.includes(region)
          ? prev.filter((r) => r !== region) // Show it if it was hidden
          : [...prev, region], // Hide it if it was visible
    );
  };

  /* ---------------- CUSTOM LEGEND RENDERER (Moved inside to access state) ---------------- */
  const renderCustomLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-x-4 gap-y-2  pl-2 sm:pl-10">
        {payload.map((entry: any, index: number) => {
          const isHidden = hiddenRegions.includes(entry.value);

          return (
            <li
              key={`item-${index}`}
              onClick={() => toggleRegion(entry.value)}
              // Added cursor-pointer, transition, and an opacity change if hidden
              className={`flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground cursor-pointer transition-opacity duration-200 ${
                isHidden
                  ? "opacity-40 line-through"
                  : "opacity-100 hover:opacity-80"
              }`}
            >
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: isHidden ? "#ccc" : entry.color }}
              />
              <span className="truncate">{entry.value}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const normalizeRegion = (r: string) =>
    r
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[_-]/g, " ") // handle _ and -
      ?.replace(/\s+/g, " "); // remove extra spaces

  return (
    <Card className="p-[0px] m-[0px]">
      {/* <CardHeader>... existing Header content ...</CardHeader> */}

      <CardContent className="">
        <ChartContainer
          config={chartConfig}
          className="w-full h-[500px] sm:h-[550px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ left: 10, right: 10, top: 40, bottom: 10 }}
            >
              <YAxis
                width={105}
                type="category"
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => value}
              />

              <XAxis type="number" hide />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Legend
                verticalAlign="top"
                align="center"
                content={renderCustomLegend}
              />

              {/* DYNAMIC REGION BARS */}
              {regions.map((region) => (
                <Bar
                  key={region}
                  stackId="a"
                  barSize={18}
                  dataKey={region}
                  // NEW: Pass the hide prop conditionally based on state
                  hide={hiddenRegions.includes(region)}
                  fill={regionColorMap[normalizeRegion(region)] || "#ccc"}
                  radius={1}
                  shape={(props: any) => (
                    <CustomGradientBar
                      {...props}
                      activeProperty={activeProperty}
                    />
                  )}
                  overflow="visible"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/* ---------------- CUSTOM BAR SHAPE ---------------- */

const CustomGradientBar = (
  props: React.SVGProps<SVGRectElement> & {
    dataKey?: string;
    activeProperty?: string | "all";
  },
) => {
  const { fill, x, y, width, height, dataKey, activeProperty, radius } = props;

  const isActive = activeProperty === "all" || activeProperty === dataKey;

  return (
    <>
      <rect
        x={x}
        y={y}
        rx={radius}
        width={width}
        height={height}
        stroke="none"
        fill={fill}
        opacity={isActive ? 1 : 0.15}
        filter={
          isActive && activeProperty !== "all"
            ? `url(#glow-chart-${dataKey})`
            : undefined
        }
        className="transition-all duration-300 ease-in-out"
      />

      <defs>
        <filter
          id={`glow-chart-${dataKey}`}
          x="-200%"
          y="-200%"
          width="600%"
          height="600%"
        >
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </>
  );
};
