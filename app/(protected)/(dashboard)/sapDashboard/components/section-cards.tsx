"use client";

import { motion, useAnimation } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

function AnimatedCard({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();

  const handleHoverStart = async () => {
    await controls.start({
      rotateY: 360,
      transition: { duration: 0.6, ease: "easeInOut" },
    });
    controls.set({ rotateY: 0 });
  };

  return <motion.div>{children}</motion.div>;
}

const cardsData = [
  {
    id: "surveys",
    title: "Total Surveys",
    value: "3",
    message: "Surveys collected",
    color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775] text-white",
  },
  {
    id: "country",
    title: "IB Country",
    value: "3",
    message: "Countries available",
    color: "bg-gradient-to-r from-[#243748] to-[#4B749F] text-white",
  },
  {
    id: "users",
    title: "IB Users",
    value: "6",
    message: "Active users",
    color: "bg-gradient-to-r from-[#134E5E] to-[#71B280] text-white",
  },
  {
    id: "customers",
    title: "IB Customers",
    value: "26",
    message: "Customer engagement",
    color:
      "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white",
  },
];

export function SectionCards({ onCardClick }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cardsData.map((card) => (
        <AnimatedCard key={card.id}>
          <Card
            onClick={() => onCardClick(card.id)}
            className={`py-2  shadow-sm ${card.color}`}
          >
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
