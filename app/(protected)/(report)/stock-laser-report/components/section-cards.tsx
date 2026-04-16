"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesFilterPayload } from "../types";
import { useDashboardSummary } from "@/app/(protected)/(dashboard)/customerDashboard/useCustomers";

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

type Props = {
  filters?: SalesFilterPayload;
};

export function SectionCards({ filters }: Props) {
  const { data, isLoading } = useDashboardSummary(filters);

  const result = data?.data || {};
  const cardsData = [
    {
      title: "Today",
      value: result.today ?? 0,
      color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775] text-white",
    },
    {
      title: "This Month",
      value: result.this_month ?? 0,
      color: "bg-gradient-to-r from-[#243748] to-[#4B749F] text-white",
    },
    {
      title: "Total Customer",
      value: result.total_customer ?? 0,
      color: "bg-gradient-to-r from-[#134E5E] to-[#71B280] text-white",
    },
    {
      title: "Pending Approval",
      value: result.pending_approval ?? 0,
      color:
        "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white",
    },
  ];
  return (
    <Card className="grid grid-cols-1 gap-1 shadow-xm px-5">
      {cardsData.map((card, index) => (
        <AnimatedCard key={index}>
          <Card className={`py-2 px-2 shadow-xm ${card.color}`}>
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
