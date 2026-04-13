"use client";

import Lottie from "lottie-react";
import loaderAnimation from "@/public/animation/loader.json";

export function TableLoader() {
  return (
    <div className="flex justify-center items-center h-[200px]">
      <Lottie animationData={loaderAnimation} loop className="h-20 w-20" />
    </div>
  );
}
