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

import { useSalesAreas } from "../useCustomers";

import { AutoComplete } from "@/components/ui/autocomplete";

import {
  SalesFilterFormValues,
  SalesFilterPayload,
  salesFilterSchema,
} from "../types";

type Props = {
  onFilter: (filters: SalesFilterPayload) => void;
};
export default function MyForm({ onFilter }: Props) {
  /* FORM */
  const form = useForm<SalesFilterFormValues>({
    resolver: zodResolver(salesFilterSchema),
    defaultValues: {
      dateRange: undefined,
    },
  });
  /* API */
  const { data: salesAreas = [] } = useSalesAreas("");
  /* SUBMIT */
  function onSubmit(values: SalesFilterFormValues) {
    if (!values.dateRange?.from || !values.dateRange?.to) {
      toast.error("Please select date range");
      return;
    }
    const filters: SalesFilterPayload = {
      fromdate: format(values.dateRange.from, "yyyy-MM-dd"),
      todate: format(values.dateRange.to, "yyyy-MM-dd"),

      page: 1,
      length: 10,
    };
    onFilter(filters);
    toast.success("Filters applied");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-5xl mx-auto py-1 px-2"
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
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

          {/* SALES */}

          <div className="flex gap-2 pt-6">
            <Button
              type="submit"
              className="shadow-xm bg-[#022235] cursor-pointer"
            >
              Filter
            </Button>

            <Button
              type="button"
              className="shadow-xm bg-[#022235] text-white cursor-pointer"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* BUTTONS */}
      </form>
    </Form>
  );
}
