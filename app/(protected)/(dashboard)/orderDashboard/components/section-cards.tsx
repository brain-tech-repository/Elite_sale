"use client";

import { motion, useAnimation } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOrderSummary } from "../useOrder";

import { useState } from "react";
import { OrderSummaryFilters } from "../types";

function AnimatedCard({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);

  const handleHoverStart = async () => {
    setHovered(true);

    await controls.start({
      rotateY: 360,
      transition: { duration: 0.8, ease: "easeInOut" },
    });

    controls.set({ rotateY: 0 });
  };

  const handleHoverEnd = () => {
    setHovered(false);
    controls.stop();
    controls.set({ rotateY: 0 });
  };
  return <motion.div>{children}</motion.div>;
}

// type Props = {
//   filters?: SalesFilterPayload;
// };

type Props = {
  filters?: OrderSummaryFilters;
  onCardClick?: (type: string) => void; // ✅ NEW
};

export function SectionCards({ filters, onCardClick }: Props) {
  const { data, isLoading } = useOrderSummary(filters);
  const [activeCard, setActiveCard] = useState<string>("order");

  const result = data?.data;

  const cardsData = [
    {
      title: "Total Orders",
      value: result?.order?.count ?? 0,
      subtitle: result?.order?.total ?? 0,
      color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775] text-white",
      type: "order",
    },
    {
      title: "Approved",
      value: result?.approved?.count ?? 0,
      subtitle: result?.approved?.total ?? 0,
      color: "bg-gradient-to-r from-[#243748] to-[#4B749F] text-white",
      type: "approved",
    },
    {
      title: "Pending",
      value: result?.pending?.count ?? 0,
      subtitle: result?.pending?.total ?? 0,
      color: "bg-gradient-to-r from-[#134E5E] to-[#71B280] text-white",
      type: "pending",
    },
    {
      title: "Delivery",
      value: result?.delivery?.count ?? 0,
      subtitle: result?.delivery?.total ?? 0,
      color:
        "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white",
      type: "delivery",
    },
    {
      title: "Invoice",
      value: result?.invoice?.count ?? 0,
      subtitle: result?.invoice?.total ?? 0,
      color: "bg-gradient-to-r from-[#42275a] to-[#734b6d] text-white",
      type: "invoice",
    },
  ];

  return (
    <Card className="grid grid-cols-1 gap-2 shadow-xm px-5">
      {cardsData.map((card, index) => (
        <AnimatedCard key={index}>
          <Card
            onClick={() => {
              setActiveCard(card.type);
              onCardClick?.(card.type);
            }}
            className={`py-2 px-2 shadow-xm cursor-pointer ${
              activeCard === card.type ? "ring-2 ring-white scale-[1.02]" : ""
            } ${card.color}`}
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
    </Card>
  );
}
