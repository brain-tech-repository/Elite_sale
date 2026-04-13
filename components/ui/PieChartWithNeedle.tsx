"use client";

import { Pie, PieChart, ResponsiveContainer, Customized } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Switch } from "./switch";

/* ---------------- DATA ---------------- */

const score = 80;

const chartData = [
  { name: "Low", value: 33, fill: "#38c1eb" },
  { name: "Medium", value: 33, fill: "#478edf" },
  { name: "High", value: 34, fill: "#5b73b4" },
];

/* ---------------- CONFIG ---------------- */

const chartConfig = {
  value: {
    label: "Performance",
    color: "#93C5FD",
  },
} satisfies ChartConfig;

/* ---------------- NEEDLE ---------------- */

const NEEDLE_COLOR = "#64748B";

const renderNeedle = (
  value: number,
  data: any[],
  innerRadius: number,
  outerRadius: number,
) => {
  return (
    <Customized
      component={({ width, height }: any) => {
        const cx = (width || 0) / 2;
        // 1. Changed to 100% to match Pie
        const cy = height || 0;

        const total = data.reduce((acc: any, cur: any) => acc + cur.value, 0);
        const angle = 180 * (value / total);
        const needleLength = innerRadius + (outerRadius - innerRadius) * 0.9;

        const rad = Math.PI / 180;
        const x = cx + needleLength * Math.cos(Math.PI - angle * rad);
        const y = cy - needleLength * Math.sin(Math.PI - angle * rad);

        return (
          <g>
            {/* Added a half-circle for the base so it sits flush at the bottom */}
            <path
              d={`M ${cx - 5} ${cy} A 5 5 0 0 1 ${cx + 5} ${cy} Z`}
              fill={NEEDLE_COLOR}
            />
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={NEEDLE_COLOR}
              strokeWidth={3}
            />
          </g>
        );
      }}
    />
  );
};

/* ---------------- COMPONENT ---------------- */

export function GaugePieChartCard() {
  const innerRadius = 40;
  const outerRadius = 80;

  return (
    <Card className="shadow-xm h-full flex flex-col pt-3 overflow-hidden">
      <CardHeader className="gap-1 pb-0 z-10 relative">
        <div className="flex items-center justify-between text-sm">
          <CardTitle>Performance Gauge</CardTitle>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <span>DTM</span>
          <Switch id="airplane-mode" />
          <span>MTY</span>
        </div>
      </CardHeader>

      {/* 2. Added aggressive negative margin (-mt-12) to pull it up */}
      <CardContent className="lg:h-[140px] -mt-6 sm:-mt-10 relative z-0">
        <ChartContainer config={chartConfig} className="p-0 m-0">
          <div className="w-full h-[140px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="p-0 m-0">
                <Pie
                  data={chartData}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  cx="50%"
                  // 3. Changed to 100% to push pie to bottom of SVG
                  cy="100%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                />

                {renderNeedle(score, chartData, innerRadius, outerRadius)}

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-start text-sm z-10 relative bg-white/50 ">
        <div className="font-medium">
          Score: <span className="text-emerald-600">{score}%</span>
        </div>

        <div className="text-muted-foreground">
          Target: 75% • Status: Above target
        </div>
      </CardFooter>
    </Card>
  );
}
