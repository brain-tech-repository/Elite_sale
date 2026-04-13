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

  const statsData = [
    {
      title: "Total Routes",
      value: result?.total_routes ?? 0,
      color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775] text-white",

      //
    },
    {
      title: "Total Salesmans",
      value: result?.total_salesmen ?? 0,
      color: "bg-gradient-to-r from-[#243748] to-[#4B749F] text-white",
    },
    {
      title: "Total Customers",
      value: result?.total_customers ?? 0,
      color: "bg-gradient-to-r from-[#134E5E] to-[#71B280] text-white",
    },
    {
      title: "Avg. Customers per Route",
      value: result?.avg_customers_per_route ?? 0,
      color:
        "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 ">
      {statsData.map((card, index) => (
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
