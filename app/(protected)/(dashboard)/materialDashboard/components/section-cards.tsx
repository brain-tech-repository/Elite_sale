"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMaterialSummary } from "../useMaterial";
import { Skeleton } from "@/components/ui/skeleton";

/* =========================
   ANIMATION
========================= */

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
      transition={{ delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  );
}

/* =========================
   COMPONENT
========================= */

interface Props {
  filters?: any;
}

export function SectionCards({ filters }: Props) {
  const { data, isLoading } = useMaterialSummary(filters);

  const cardsData = [
    {
      title: "Total SKUs",
      value: data?.total_skus ?? 0,
      gradient: "from-[#1E6C8E] to-[#2E7775]",
    },
    {
      title: "Active SKUs",
      value: data?.active_skus ?? 0,
      gradient: "from-[#243748] to-[#4B749F]",
    },
    {
      title: "Inactive SKUs",
      value: data?.inactive_skus ?? 0,
      gradient: "from-[#134E5E] to-[#71B280]",
    },
    {
      title: "Total Brands",
      value: data?.total_brand ?? 0,
      gradient: "from-[#0F2027] to-[#2C5364]",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cardsData.map((card, index) => (
        <AnimatedCard key={index} index={index}>
          <Card
            className={`rounded-xl border-none shadow-xm p-3 text-white 
            bg-gradient-to-r ${card.gradient}`}
          >
            <CardHeader className="p-1 flex flex-col gap-1">
              <CardDescription className="text-xs uppercase tracking-wide text-white/80">
                {card.title}
              </CardDescription>

              <CardTitle className="text-lg font-semibold">
                {card.value}
              </CardTitle>
            </CardHeader>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}
