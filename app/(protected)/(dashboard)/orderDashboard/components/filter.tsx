"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
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

import { AutoComplete, AutoCompleteOption } from "@/components/ui/autocomplete";
import { useOrderTypes, useSpecificSelection } from "../useOrder";

/* =========================
   SCHEMA
========================= */
const formSchema = z.object({
  dateRange: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .refine((val) => val.from && val.to, {
      message: "Date range required",
    }),

  order_type: z.string().min(1, "Order type is required"),
  specific_selection: z.string().min(1, "Specific Selection is required"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  onApply: (data: any) => void;
};

/* =========================
   COMPONENT
========================= */

export default function MyForm({ onApply }: Props) {
  // ✅ FIRST create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: { from: null, to: null },
      order_type: "",
      specific_selection: "",
    },
  });

  // ✅ THEN use it
  const selectedOrderType = form.watch("order_type");

  // ✅ Hooks
  const { data: orderTypes = [], isLoading: orderLoading } = useOrderTypes();

  const { data: specificOptions = [], isLoading: specificLoading } =
    useSpecificSelection(selectedOrderType);

  function onSubmit(values: FormValues) {
    const payload = {
      order_type: values.order_type,
      specific_selection: values.specific_selection,
      from_date: format(values.dateRange.from!, "yyyy-MM-dd"),
      to_date: format(values.dateRange.to!, "yyyy-MM-dd"),
    };
    onApply(payload);
    toast.success("Filters applied!");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-7xl mx-auto py-2 px-2"
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Date Range */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => {
              const dateRange = field.value as DateRange | undefined;

              return (
                <FormItem>
                  <FormLabel>Date Range</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left w-full",
                            !dateRange?.from && "text-muted-foreground",
                          )}
                        >
                          {dateRange?.from && dateRange?.to
                            ? `${format(dateRange.from, "dd/MM/yy")} - ${format(
                                dateRange.to,
                                "dd/MM/yy",
                              )}`
                            : "Pick date range"}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Order Type */}
          <FormField
            control={form.control}
            name="order_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Type</FormLabel>
                <FormControl>
                  <AutoComplete
                    options={orderTypes}
                    // loading={orderLoading}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      form.setValue("specific_selection", "");
                    }}
                    placeholder="Select Order Type"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Specific Selection */}
          <FormField
            control={form.control}
            name="specific_selection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Selection</FormLabel>
                <FormControl>
                  <AutoComplete
                    options={specificOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Specific"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="cursor-pointer">
              Filter
            </Button>
            <Button
              type="button"
              onClick={() => form.reset()}
              className="cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
