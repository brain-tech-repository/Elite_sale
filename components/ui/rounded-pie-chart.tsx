"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface PieItem {
  label: string;
  y: number;
}

interface RoundedPieChartProps {
  title?: string;
  description?: string;
  onSliceClick?: (label: string) => void;
  data?: PieItem[];
  isLoading?: boolean;
}

const RADIAN = Math.PI / 180;

const renderSmartLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, index, fill, name } = props;
  const RADIAN = Math.PI / 180;

  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const isRightSide = cos >= 0;

  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;

  const elbowExtension = 12;
  const mx = cx + (outerRadius + elbowExtension) * cos;
  const my = cy + (outerRadius + elbowExtension) * sin;

  const horizontalStretch = 10;
  const tx = isRightSide ? mx + horizontalStretch : mx - horizontalStretch;

  if (!window.__labelYCoords || index === 0) {
    window.__labelYCoords = { left: [], right: [] };
  }

  const list = isRightSide
    ? window.__labelYCoords.right
    : window.__labelYCoords.left;

  let adjustedY = my;
  const minGap = 16;

  list.forEach((prevY: number) => {
    if (Math.abs(adjustedY - prevY) < minGap) {
      adjustedY = my < cy ? prevY - minGap : prevY + minGap;
    }
  });
  list.push(adjustedY);

  return (
    <g>
      <path
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
  onSliceClick,
  data = [],
  isLoading = false,
}: RoundedPieChartProps) {
  const colors = [
    "#61bff1",
    "#6377bd",
    "#69e6ab",
    "#8c81be",
    "#83f3dd",
    "#729ab3",
    "#4ecdc4",
    "#8d7b7b",
    "#ffe66d",
    "#1a535c",
  ];

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => {
      const colorIndex = index % colors.length;
      return {
        name: item.label,
        value: item.y,
        fill: colors[colorIndex],
      };
    });
  }, [data]);

  const chartConfig = {} satisfies ChartConfig;

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
      <div className="text-sm py-0 px-4 lg:py-0">{title}</div>

      <CardContent className="flex flex-col items-center p-0">
        {isLoading ? (
          <div className="w-full h-[200px] flex flex-col items-center justify-center gap-3">
            <div className="w-[120px] h-[120px] rounded-full bg-gray-200 animate-pulse" />
            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-16 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
            No data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full lg:h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0];
                      return (
                        <div className="bg-white px-3 py-2 rounded shadow text-sm flex items-center gap-2">
                          <span
                            className="w-3 h-3"
                            style={{ backgroundColor: item.payload.fill }}
                          />
                          <span>{item.name}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={updatedData}
                  innerRadius={20}
                  outerRadius={75}
                  dataKey="value"
                  nameKey="name"
                  cornerRadius={10}
                  paddingAngle={4}
                  labelLine={false}
                  label={renderSmartLabel}
                  cy="45%"
                  isAnimationActive={false}
                  onClick={(data: any) => {
                    if (onSliceClick && data?.name) {
                      onSliceClick(data.name);
                    }
                  }}
                >
                  {updatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
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
