"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { title } from "process";

const data = [
  { name: "Page A", uv: 180, pv: 170 }, // high start
  { name: "Page B", uv: 60, pv: 70 }, // drop
  { name: "Page C", uv: 160, pv: 150 }, // rise

  { name: "Page F", uv: 40, pv: 130 }, // small fall
  { name: "Page G", uv: 170, pv: 20 }, // slight rise
];

// Define the Props interface
interface RoundedPieChartProps {
  title?: string;
  description?: string;
}
export default function Example({
  title = "Browser Distribution", // Default title
  description = "January - June 2024", // Default description
}: RoundedPieChartProps) {
  return (
    <Card className="flex flex-col shadow-xm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>January - July 2024</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="pv"
                stroke="url(#rainbowGradient)"
                strokeWidth={2}
                dot={false}
                filter="url(#lineGlow)"
              />

              <defs>
                <linearGradient
                  id="rainbowGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#0B84CE" stopOpacity={0.8} />
                  <stop offset="20%" stopColor="#224CD1" stopOpacity={0.8} />
                  <stop offset="40%" stopColor="#3A11C7" stopOpacity={0.8} />
                  <stop offset="60%" stopColor="#7107C6" stopOpacity={0.8} />
                  <stop offset="80%" stopColor="#C900BD" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#D80155" stopOpacity={0.8} />
                </linearGradient>

                <filter
                  id="lineGlow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
