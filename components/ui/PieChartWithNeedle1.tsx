"use client";

import { Pie, PieChart, ResponsiveContainer } from "recharts";
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

const score = 70;

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
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
) => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const angle = 180 * (value / total);

  const needleLength = innerRadius + (outerRadius - innerRadius) * 0.9;
  const rad = Math.PI / 180;

  const x = cx + needleLength * Math.cos(Math.PI - angle * rad);
  const y = cy - needleLength * Math.sin(Math.PI - angle * rad);

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={NEEDLE_COLOR} />
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
};

/* ---------------- COMPONENT ---------------- */

export function GaugePieChartCard() {
  const innerRadius = 60;
  const outerRadius = 100;

  return (
    <Card className="shadow-xm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Performance Gauge</CardTitle>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <span>DTM</span>
          <Switch id="mode" />
          <span>MTY</span>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          {/* ✅ Responsive wrapper */}
          <div className="w-full h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  cx="50%" // ✅ always center
                  cy="75%" // ✅ correct vertical position
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                />

                {/* ✅ Needle centered dynamically */}
                {renderNeedle(score, chartData, 140, 110, 100, 110)}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-1 text-sm ">
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
