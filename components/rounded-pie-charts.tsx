"use client";

import * as React from "react";
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";
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

interface PieItem {
  label: string;
  y: number;
}

interface RoundedPieChartProps {
  title?: string;
  description?: string;
  data?: PieItem[];
}

const RADIAN = Math.PI / 180;

const renderSmartLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, index, fill, name } = props;
  const RADIAN = Math.PI / 180;

  // Configuration
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const isRightSide = cos >= 0;

  // 1. Point A: Edge of the pie
  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;

  // 2. Point B: THE ELBOW (Reduced to 12 for "small lines")
  // This brings the label much closer to the pie slice.
  const elbowExtension = 12;
  const mx = cx + (outerRadius + elbowExtension) * cos;
  const my = cy + (outerRadius + elbowExtension) * sin;

  // 3. Point C: THE HORIZONTAL STRETCH (Small flat line)
  const horizontalStretch = 10;
  const tx = isRightSide ? mx + horizontalStretch : mx - horizontalStretch;

  // Collision Logic: Prevents "hiding" or overlapping at the top
  if (!window.__labelYCoords || index === 0) {
    window.__labelYCoords = { left: [], right: [] };
  }

  const list = isRightSide
    ? window.__labelYCoords.right
    : window.__labelYCoords.left;

  let adjustedY = my;
  const minGap = 16; // Enough space for font size 11-12

  // The fix for "Top Side": If the label is in the top half (my < cy),
  // we push UP to keep it from drowning in the pie.
  list.forEach((prevY: number) => {
    if (Math.abs(adjustedY - prevY) < minGap) {
      adjustedY = my < cy ? prevY - minGap : prevY + minGap;
    }
  });
  list.push(adjustedY);

  return (
    <g>
      <path
        // Using a shorter Quadratic Bezier curve for a cleaner "small line" look
        d={`M${sx},${sy} Q${mx},${my} ${mx},${adjustedY} L${tx},${adjustedY}`}
        stroke={fill}
        strokeWidth={1}
        fill="none"
      />
      <text
        x={tx + (isRightSide ? 4 : -4)}
        y={adjustedY}
        fill="#444"
        textAnchor={isRightSide ? "start" : "end"}
        dominantBaseline="central"
        fontSize={11}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

declare global {
  interface Window {
    __labelYCoords: any;
  }
}

export function RoundedPieChart({
  title = "Sales Contribution",
  description = "Distribution",
  data = [],
}: RoundedPieChartProps) {
  // 1. Expand your color palette to ensure more variety
  const colors = [
    "#61bff1", // light sky
    "#6377bd", // light indigo
    "#69e6ab", // light green
    "#8c81be", // light violet
    "#83f3dd", // light teal
    "#729ab3", // extra light blue
    "#4ecdc4", // medium teal
    "#8d7b7b", // coral
    "#ffe66d", // yellow
    "#1a535c", // dark teal
  ];

  /* -------------------------------------------------------------------------- */
  /* FORMAT API DATA FOR CHART                       */
  /* -------------------------------------------------------------------------- */

  const chartData = React.useMemo(() => {
    // const source = data && data.length > 0 ? data : fallbackData;
    if (!data || data.length === 0) return [];

    return data.map((item, index) => {
      // 2. This logic ensures if you have more than 10 items,
      // it loops back but offsets so color #1 and #11 aren't the same.
      const colorIndex = index % colors.length;

      return {
        name: item.label,
        value: item.y,
        fill: colors[colorIndex],
      };
    });
  }, [data]);

  const chartConfig = {
    value: { label: "Sales" },
  } satisfies ChartConfig;

  const [hidden, setHidden] = React.useState<string[]>([]);

  const toggleItem = (name: string) => {
    setHidden((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const updatedData = chartData.filter((item) => !hidden.includes(item.name));

  return (
    <Card className="flex flex-col shadow-sm py-3">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center p-0">
        {chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
            No data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full lg:h-[246px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="value" hideLabel />}
                />
                <Pie
                  data={updatedData}
                  innerRadius={25}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name" // Ensure nameKey is present for tooltip/labels
                  cornerRadius={10}
                  paddingAngle={4}
                  labelLine={false}
                  label={renderSmartLabel}
                  cy="45%"
                  isAnimationActive={false} // Prevents label jumping
                >
                  {/* 🔥 This ensures every part uses its pre-assigned color from chartData */}
                  {updatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-1">
          {chartData.map((item) => {
            const isHidden = hidden.includes(item.name);
            return (
              <button
                key={item.name}
                onClick={() => toggleItem(item.name)}
                className={`flex items-center gap-2 text-sm transition  ${
                  isHidden ? "opacity-40" : "opacity-100"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.fill }}
                />

                {item.name}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
