"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

/* IMPORT FROM TYPES */
import {
  DashboardFilters,
  dashboardFilterSchema,
  DashboardFilterFormValues,
} from "../types/index";

/* =========================
   PROPS
========================= */
type Props = {
  onFilter?: (filters: DashboardFilters | undefined) => void;
};

/* =========================
   COMPONENT
========================= */
export default function MyForm({ onFilter }: Props) {
  const form = useForm<DashboardFilterFormValues>({
    resolver: zodResolver(dashboardFilterSchema),
    defaultValues: {
      dateRange: undefined,
    },
  });

  /* =========================
     SUBMIT
  ========================= */
  function onSubmit(values: DashboardFilterFormValues) {
    if (!values.dateRange?.from || !values.dateRange?.to) {
      toast.error("Please select a complete date range");
      return;
    }

    const filters: DashboardFilters = {
      startDate: format(values.dateRange.from, "yyyy-MM-dd"),
      endDate: format(values.dateRange.to, "yyyy-MM-dd"),
    };

    onFilter?.(filters);
    toast.success("Filters applied");
  }

  /* =========================
     RESET
  ========================= */
  function handleReset() {
    form.reset({ dateRange: undefined });
    onFilter?.(undefined);
    toast.info("Filters reset");
  }

  /* =========================
     UI
  ========================= */
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-5xl py-1 px-2"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* DATE RANGE */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => {
              const dateRange = field.value as DateRange | undefined;
              const isDateSelected = dateRange?.from && dateRange?.to;

              return (
                <FormItem>
                  <FormLabel>Date Range</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal shadow-xm w-full",
                          !dateRange?.from && "text-muted-foreground",
                        )}
                      >
                        {isDateSelected
                          ? `${format(dateRange.from!, "dd/MM/yy")} - ${format(
                              dateRange.to!,
                              "dd/MM/yy",
                            )}`
                          : "Pick a date range"}

                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent align="start" className="p-0 w-auto">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => field.onChange(range)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* BUTTONS */}
          <div className="flex gap-2 pt-6">
            <Button
              type="submit"
              className="shadow-xm bg-[#022235] hover:bg-[#022235]/90 cursor-pointer"
            >
              Filter
            </Button>

            <Button
              type="button"
              variant="outline"
              className="shadow-xm border-[#022235] text-[#022235] hover:bg-gray-100 cursor-pointer"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
