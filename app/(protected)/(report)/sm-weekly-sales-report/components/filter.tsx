"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { AutoComplete } from "@/components/ui/autocomplete";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  SalesFilterFormValues,
  SalesFilterPayload,
  salesFilterSchema,
} from "../types";
import {
  useWarehouses,
  useMaterialTypes,
  useBrands,
  useMaterials,
} from "../useCustomers";

type Props = {
  onFilter: (filters: SalesFilterPayload) => void;
};

export default function MyForm({ onFilter }: Props) {
  const form = useForm<SalesFilterFormValues>({
    resolver: zodResolver(salesFilterSchema),
    defaultValues: {
      dateRange: undefined,
      warehouse: "",
      route: "",
      trip: "",
    },
  });

  const warehouseOptions = [
    { label: "Warehouse A", value: "1" },
    { label: "Warehouse B", value: "2" },
  ];

  const routeOptions = [
    { label: "Route 101", value: "101" },
    { label: "Route 102", value: "102" },
  ];

  const tripOptions = [
    { label: "Trip Morning", value: "morning" },
    { label: "Trip Evening", value: "evening" },
  ];

  function onSubmit(values: SalesFilterFormValues) {
    if (!values.dateRange?.from || !values.dateRange?.to) {
      toast.error("Please select date range");
      return;
    }

    const filters = {
      fromdate: format(values.dateRange.from, "yyyy-MM-dd"),
      todate: format(values.dateRange.to, "yyyy-MM-dd"),
      warehouse_id: values.warehouse,
      route_id: values.route,
      trip_id: values.trip,
    };

    onFilter(filters);
    toast.success("Filters applied");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-7xl mx-auto py-1 px-2"
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          {/* DATE RANGE */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date Range</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal w-full",
                        !field.value?.from && "text-muted-foreground",
                      )}
                    >
                      {field.value?.from ? (
                        field.value.to ? (
                          `${format(field.value.from, "dd/MM/yy")} - ${format(field.value.to, "dd/MM/yy")}`
                        ) : (
                          format(field.value.from, "dd/MM/yy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 w-auto">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* WAREHOUSE */}
          <FormField
            control={form.control}
            name="warehouse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <AutoComplete
                  options={warehouseOptions}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select warehouse"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ROUTE */}
          <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route</FormLabel>
                <AutoComplete
                  options={routeOptions}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select route"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TRIP */}
          <FormField
            control={form.control}
            name="trip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip</FormLabel>
                <AutoComplete
                  options={tripOptions}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select trip"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-x-4">
          <Button
            type="submit"
            className="text-white bg-[#022235] hover:bg-[#033350]"
          >
            Filter
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-[#022235] text-[#022235]"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
