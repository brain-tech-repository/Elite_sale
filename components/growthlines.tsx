import React from "react";
import { Card } from "./ui/card";

// ---------------- Types ----------------
export type GrowthItem = {
  label: string;
  value: string | number; // ✅ allow string from API
};

export interface GrowthLinesProps {
  data?: any; // raw API response
  isLoading?: boolean;
}

// Gradient styles
const gradients = [
  "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]",
  "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775]",
  "bg-gradient-to-r from-[#243748] to-[#4B749F]",
  "bg-gradient-to-r from-[#134E5E] to-[#71B280]",
];

// ---------------- Component ----------------
const GrowthLines: React.FC<GrowthLinesProps> = ({ data, isLoading }) => {
  // 🔥 Direct mapping (NO parsing)
  const items: GrowthItem[] = data
    ? [
        {
          label: "Completion Rate",
          value: data.completion_rate,
        },
        {
          label: "Success Rate",
          value: data.success_rate,
        },
        {
          label: "Incompletion Rate",
          value: data.incompletion_rate,
        },
        {
          label: "Closure Rate", // ✅ NEW
          value: data.completion_rate,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <Card className="w-full shadow-sm p-6 rounded-xl space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-3 w-1/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-5 w-full bg-gray-200 animate-pulse rounded-full" />
          </div>
        ))}
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card className="w-full shadow-md p-6 rounded-xl text-center text-muted-foreground">
        No data available
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md p-6 rounded-xl pt-3">
      <div className="w-full space-y-6">
        {items.slice(0, 4).map((item, index) => {
          const gradient = gradients[index % gradients.length];

          return (
            <div key={index} className="space-y-4">
              {/* Label + Value */}
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-bold">{item.value}%</span>
              </div>

              {/* Progress Bar (static width to avoid issues) */}
              <div className="w-full bg-gray-200/70 rounded-full h-5 overflow-hidden">
                <div
                  className={`h-5 rounded-full ${gradient}`}
                  style={{ width: "100%" }} // ✅ no calculation
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GrowthLines;
