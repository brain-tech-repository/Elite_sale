"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  data?: {
    total_menu_survey: number;
    total_sub_survey: number;
    total_responds: number;
  };
  isLoading?: boolean;
}

function AnimatedCard({ children }: { children: React.ReactNode }) {
  return <motion.div>{children}</motion.div>;
}

export function SectionCards({ data, isLoading }: Props) {
  const cardsData = [
    {
      id: "surveys",
      title: "Surveys",
      value: data?.total_menu_survey ?? 0,
      message: "Total surveys created",
      color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775] text-white",
    },
    {
      id: "sub_survey",
      title: "Sub Survey",
      value: data?.total_sub_survey ?? 0,
      message: "Total responses collected",
      color: "bg-gradient-to-r from-[#243748] to-[#4B749F] text-white",
    },

    {
      id: "responds",
      title: "Responds",
      value: data?.total_responds ?? 0,
      message: "Average completion time",
      color:
        "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-1">
      {cardsData.map((card) => (
        <AnimatedCard key={card.id}>
          <Card className={`py-2 shadow-sm ${card.color}`}>
            <CardHeader>
              <CardDescription className="text-sm font-semibold text-white">
                {card.title}
              </CardDescription>

              {isLoading ? (
                <Skeleton className="h-4 w-24 bg-white/30" />
              ) : (
                <CardTitle className="text-base font-semibold tabular-nums">
                  {card.value}
                </CardTitle>
              )}
            </CardHeader>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}
