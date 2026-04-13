"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cardsData = [
  {
    title: "Gross Profit",
    value: 1288,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775]",
  },
  {
    title: "Gross Profit %",
    value: 1287,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#243748] to-[#4B749F]",
  },
  {
    title: "Cost Of Good Sold",
    value: 1283,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#134E5E] to-[#71B280]",
  },
  {
    title: "Net Profit",
    value: 1283,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]",
  },
  {
    title: "Gross Sales",
    value: 1283,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#09203f] to-[#537895]",
  },
  {
    title: "Net Sales",
    value: 1285,
    change: "175.5%",

    color: "bg-gradient-to-r from-[#042f2e] to-[#14b8a6]",
  },
  {
    title: "Collection",
    value: 1283,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#020617] to-[#155e75]",
  },
  {
    title: "Total Debt",
    value: 1283,
    change: "170.5%",
    color: "bg-gradient-to-r from-[#134e4a] to-[#115e59]",
  },
  {
    title: "Inventory Value",
    value: 1283,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#3f3f46] to-[#27272a]",
  },
  {
    title: "Total Discount",
    value: 1283,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#1f2937] to-[#111827]",
  },
  {
    title: "Total Returns",
    value: 1283,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#022c22] to-[#134e4a]",
  },
  {
    title: "Total Expense",
    value: 1283,
    change: "175.5%",
    color: "bg-gradient-to-r from-[#031e2f] to-[#0e7490]",
  },
];

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
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.04 }}
    >
      {children}
    </motion.div>
  );
}

const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-IN").format(num);

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
      {cardsData.map((card, index) => (
        <AnimatedCard key={index} index={index}>
          <Card
            className={`rounded-xl border-none shadow-md p-4 text-white ${card.color}`}
          >
            <CardHeader className="px-2 flex flex-col gap-1">
              <CardDescription className="text-xs font-semibold uppercase tracking-wide opacity-80 text-white">
                {card.title}
              </CardDescription>

              <CardTitle className="text-lg font-bold text-white">
                {formatNumber(card.value)}
              </CardTitle>

              {/* 🔥 Percentage Change */}
              {/* <p className="text-xs font-medium text-white/80">
                ↑ {card.change}
              </p> */}
            </CardHeader>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}
