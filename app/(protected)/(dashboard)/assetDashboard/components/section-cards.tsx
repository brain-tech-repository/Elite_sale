"use client";

import { motion } from "framer-motion";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cardsData = [
  {
    title: "Asset Total",
    value: "1",
    message: "Total number of assets",
    color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775] text-white",
  },
  {
    title: "Asset Value",
    value: "0.00",
    message: "Total asset value",
    color: "bg-gradient-to-r from-[#243748] to-[#4B749F] text-white",
  },
  {
    title: "Asset Net Book Value",
    value: "0.00",
    message: "Current net book value",
    color: "bg-gradient-to-r from-[#134E5E] to-[#71B280] text-white",
  },
  {
    title: "Asset Repair Cost Value",
    value: "0.00",
    message: "Total repair cost",
    color:
      "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white",
  },
];

function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="transition-all duration-200 hover:shadow-xl rounded-lg"
    >
      {children}
    </motion.div>
  );
}

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cardsData.map((card, index) => (
        <AnimatedCard key={index}>
          <Card className={`py-2  shadow-sm ${card.color}`}>
            <CardHeader className="">
              <CardDescription className="text-sm font-semibold text-white">
                {card.title}
              </CardDescription>

              <CardTitle className="text-base font-semibold tabular-nums">
                {card.value}
              </CardTitle>
            </CardHeader>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}
