"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardSummary } from "../useSales";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Utility to format numbers with commas (e.g., 1,000,000)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-UG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
const formateCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-UG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function AnimatedCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  data?: any;
  isLoading?: boolean;
}

export function SectionCards({ data, isLoading }: Props) {
  const result = data?.Result;

  const cardsData = [
    {
      title: "Today Sales",
      value: result?.today_sales ?? 0,
      percentage: result?.today_sales_percentage ?? 0,
      color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775] text-white",
    },
    {
      title: "Total Sales",
      value: result?.total_sales ?? 0,
      percentage: result?.total_sales_percentage ?? 0,
      color: "bg-gradient-to-r from-[#243748] to-[#4B749F] text-white",
    },
    {
      title: "Today Collection",
      value: result?.today_collection ?? 0,
      percentage: result?.today_collection_percentage ?? 0,
      color: "bg-gradient-to-r from-[#134E5E] to-[#71B280] text-white",
    },
    {
      title: "Total Collection",
      value: result?.total_collection ?? 0,
      percentage: result?.total_collection_percentage ?? 0,
      color:
        "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white",
    },
    {
      title: "Today Return",
      value: result?.today_return ?? 0,
      percentage: result?.today_return_percentage ?? 0,
      color: "bg-gradient-to-r from-[#2b5876] to-[#4e4376] text-white",
    },
    {
      title: "Total Return",
      value: result?.total_return ?? 0,
      percentage: result?.total_return_percentage ?? 0,
      color: "bg-gradient-to-r from-[#09203f] to-[#537895] text-white",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-4 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-1">
      {cardsData.map((card, index) => (
        <AnimatedCard key={index} index={index}>
          <Card
            className={`rounded-xl border-none shadow-xm  p-3 ${card.color}`}
          >
            <CardHeader className="px-2 flex flex-col items-center lg:items-start ">
              <CardDescription className="text-xs font-bold uppercase tracking-wider text-white dark:text-gray-400">
                {card.title}
              </CardDescription>
              <CardTitle className="text-xs whitespace-nowrap text-white">
                <span className="text-xs  mr-1 text-white">UGX</span>
                {formateCurrency(card.value)}
              </CardTitle>
            </CardHeader>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}
