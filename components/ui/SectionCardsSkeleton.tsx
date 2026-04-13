"use client";

import * as React from "react";
import { Card } from "./card";

export function SectionCardsSkeleton() {
  return (
    <div className="grid gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-15 rounded-md bg-gray-200 animate-pulse gap-8"
        />
      ))}
    </div>
  );
}
