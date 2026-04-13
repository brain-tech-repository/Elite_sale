"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "./card";
import { useRef } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

interface Props {
  title?: string;
  data?: any[];
  xKey?: string;
  yKey?: string;
  height?: number;
  truncateLabel?: (val: string) => string;
}

export default function GradientBarChart({
  title = "Chart",
  data = [],
  xKey = "label",
  yKey = "y",
  height = 300,
  truncateLabel,
}: Props) {
  const chartRef = useRef<any>(null);

  // ✅ K / M / B formatter
  const formatNumber = (value: number) => {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (value >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return value.toString();
  };

  // ✅ CSS variable
  const getCssVar = (name: string) =>
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : "";

  const chart2Color = getCssVar("--chart-3");

  // ✅ Gradient
  const getGradient = (ctx: any, chartArea: any) => {
    const gradient = ctx.createLinearGradient(
      chartArea.left,
      0,
      chartArea.right,
      0,
    );

    gradient.addColorStop(0, "#0F2027");
    gradient.addColorStop(0.5, "#203A43");
    gradient.addColorStop(1, "#2C5364");

    return gradient;
  };

  // ✅ Transform data
  const labels = data.map((item) =>
    truncateLabel ? truncateLabel(item[xKey]) : item[xKey],
  );

  const values = data.map((item) => item[yKey]);

  const chartData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          return getGradient(ctx, chartArea);
        },
        borderColor: chart2Color,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatNumber(Number(value));
          },
        },
      },
      y: {
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${formatNumber(
              context.raw as number,
            )}`;
          },
        },
      },
    },
  };

  return (
    <Card className="shadow-xm p-3">
      {/* <div className="text-sm font-medium mb-2">{title}</div> */}

      <div style={{ height }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </Card>
  );
}
