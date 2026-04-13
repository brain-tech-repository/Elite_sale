"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";

interface FormCardHeaderProps {
  title: string;
  backHref?: string; // optional
}

export function FormCardHeader({ title, backHref }: FormCardHeaderProps) {
  return (
    <CardHeader className="border-b pb-0 lg:py-0 py-0 m-0 p-0 mb-0 pb-0">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        {/* Left: Gradient indicator + Title */}

        {title && (
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-100 to-gray-300" />
            <h1 className="font-bold text-gray-900 text-lg dark:text-gray-100">
              {title}
            </h1>
          </div>
        )}

        {/* Right: Back button (only if href is provided) */}
        {backHref && (
          <div>
            <Link href={backHref as any}>
              <Button type="submit" className="w-full sm:w-auto">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        )}
      </div>
    </CardHeader>
  );
}
