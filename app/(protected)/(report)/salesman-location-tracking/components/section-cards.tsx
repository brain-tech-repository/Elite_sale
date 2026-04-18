"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useDashboardSummary } from "../useRoutes";
import { SalesFilterPayload } from "../types";

function AnimatedCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

type Props = {
  filters?: SalesFilterPayload;
};

export function SectionCards({ filters }: Props) {
  const { data, isLoading } = useDashboardSummary(filters);
  const result = data?.data || {};

  const cardsData = [
    {
      title: "Planned Outlet",
      value: 120,
      percentage: 100,
      color: "bg-gradient-to-r from-[#2c3e50] to-[#3b5f85] text-white",
    },
    {
      title: "Visited Outlet",
      value: 95,
      percentage: 79,
      color: "bg-gradient-to-r from-[#15803d] to-[#16a34a] text-white",
    },
    {
      title: "Pending  Visit",
      value: 25,
      percentage: 21,
      color: "bg-gradient-to-r from-[#9ca3af] to-[#7c8591] text-white",
    },
    {
      title: "Closed Outlet",
      value: 80,
      percentage: 67,
      color: "bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white",
    },
    {
      title: "Productive Outlet",
      value: 60,
      percentage: 50,
      color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775] text-white",
    },
    {
      title: "Unplanned Visit",
      value: 35,
      percentage: 29,
      color: "bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-1 ">
      {cardsData.map((card, index) => (
        <AnimatedCard key={index} index={index}>
          <Card className={`py-2  shadow-sm ${card.color}`}>
            <CardHeader className="">
              <CardDescription className="text-sm font-semibold text-white">
                {card.title}
              </CardDescription>

              <CardTitle className="text-base font-semibold tabular-nums">
                {card.value.toLocaleString("en-IN")}
              </CardTitle>
            </CardHeader>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}
