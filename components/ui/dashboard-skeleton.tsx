"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ChartSkeleton() {
  return (
    <Card className="p-4 space-y-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-[260px] w-full rounded-xl" />
    </Card>
  );
}

export function TableSkeleton() {
  return (
    <Card className="p-4 space-y-3">
      <Skeleton className="h-6 w-40" />
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </Card>
  );
}

export function CardsSkeleton() {
  return (
    <Card className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-24" />
        </Card>
      ))}
    </Card>
  );
}

/* =========================
   PIE CHART SKELETON
========================= */
export function PieChartSkeleton() {
  return (
    <Card className="p-6 h-[350px] flex flex-col justify-between">
      {/* 1. Top: Title */}
      <div className="flex justify-start">
        <Skeleton className="h-5 w-32" />
      </div>

      {/* 2. Middle: Circle */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Main Pie */}
          <Skeleton className="h-40 w-40 rounded-full" />
          {/* Donut hole - matches card background */}
          <div className="absolute inset-8 bg-card rounded-full" />
        </div>
      </div>

      {/* 3. Last: 3 lines for Legends */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Small square for the "color" indicator */}
            <Skeleton className="h-3 w-3 rounded-full shrink-0" />
            {/* The label text */}
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function BarGraphSkeleton() {
  return (
    <Card className="p-6 h-[350px] flex flex-col">
      {/* 1. Top Title */}
      <div className="mb-6">
        <Skeleton className="h-5 w-40" />
      </div>

      {/* 2. Middle: 10 Vertical Lines */}
      <div className="flex-1 w-full flex items-end justify-between gap-2 mb-8 px-2 relative min-h-[150px]">
        {/* Manually defining varied heights for a natural "data" look */}
        {[
          160, 120, 80, 140, 100, 180, 70, 110, 90, 150, 80, 140, 100, 180, 70,
          110, 90, 150, 110,
        ].map((height, i) => (
          <Skeleton
            key={i}
            className="w-full max-w-[12px] rounded-t-sm bg-muted"
            style={{ height: `${height}px` }}
          />
        ))}

        {/* X-Axis Base Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-muted/30" />
      </div>

      {/* 3. Bottom: 3 Legend Lines */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-3 w-3 rounded-sm shrink-0 bg-muted" />
            <Skeleton className="h-3 w-full bg-muted" />
          </div>
        ))}
      </div>
    </Card>
  );
}
