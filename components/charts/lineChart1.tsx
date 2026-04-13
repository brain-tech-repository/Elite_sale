"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
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

const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

export default function LineCharts1() {
  return (
    <Card className="flex flex-col w-full max-w-sm shadow-xm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Traffic Overview
          <Badge
            variant="outline"
            className="text-green-500 bg-green-500/10 border-none"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.4%
          </Badge>
        </CardTitle>

        <CardDescription>Last 7 Pages Traffic</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />

              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#86EFAC" /> {/* light green */}
                  <stop offset="25%" stopColor="#4ADE80" /> {/* soft green */}
                  <stop offset="50%" stopColor="#22C55E" /> {/* main green */}
                  <stop offset="75%" stopColor="#16A34A" /> {/* darker green */}
                  <stop offset="100%" stopColor="#15803D" /> {/* deep green */}
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="pv"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
