"use client";

import { useState, useEffect } from "react";
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

import {
  useRegions,
  useWarehouses,
  useSalesAreas,
  useRoutes,
} from "../useCustomers";

import { AutoComplete } from "@/components/ui/autocomplete";

import {
  SalesFilterFormValues,
  SalesFilterPayload,
  salesFilterSchema,
} from "../types";

/* =========================
   COMPONENT
========================= */

type Props = {
  onFilter: (filters: SalesFilterPayload) => void;
};

export default function MyForm({ onFilter }: Props) {
  /* SEARCH STATES */

  const [regionSearch, setRegionSearch] = useState("");
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const [salesAreaSearch, setSalesAreaSearch] = useState("");
  const [routeSearch, setRouteSearch] = useState("");

  /* FORM */

  const form = useForm<SalesFilterFormValues>({
    resolver: zodResolver(salesFilterSchema),
    defaultValues: {
      dateRange: undefined,
      region: "",
      warehouse: "",
      sales_area: "",
      route: "",
    },
  });

  /* WATCH VALUES */

  const regionValue = form.watch("region");
  const warehouseValue = form.watch("warehouse");
  const salesAreaValue = form.watch("sales_area");

  /* API DATA */

  const { data: regions = [] } = useRegions();

  const { data: warehouses = [] } = useWarehouses(regionValue);

  const { data: salesAreas = [] } = useSalesAreas(warehouseValue);

  const { data: routes = [] } = useRoutes(salesAreaValue);

  /* RESET DEPENDENT FIELDS */

  useEffect(() => {
    form.setValue("warehouse", "");
    form.setValue("sales_area", "");
    form.setValue("route", "");
  }, [regionValue]);

  useEffect(() => {
    form.setValue("sales_area", "");
    form.setValue("route", "");
  }, [warehouseValue]);

  useEffect(() => {
    form.setValue("route", "");
  }, [salesAreaValue]);

  /* SUBMIT */

  function onSubmit(values: SalesFilterFormValues) {
    const filters: SalesFilterPayload = {
      fromdate: values.dateRange?.from
        ? format(values.dateRange.from, "yyyy-MM-dd")
        : "",

      todate: values.dateRange?.to
        ? format(values.dateRange.to, "yyyy-MM-dd")
        : "",

      region_id: values.region || "0",
      warehouse_id: values.warehouse || "0",
      sales_area_id: values.sales_area || "0",
      route_id: values.route || "0",
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
        className="space-y-2 max-w-7xl mx-auto py-1 px-2"
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5">
          {/* DATE RANGE */}

          {/* <FormField
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
          /> */}

          {/* REGION */}

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>

                <AutoComplete
                  enableSelectAll
                  options={regions}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onSearch={(text) => setRegionSearch(text.trim())}
                  placeholder="Select region"
                />

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
                  enableSelectAll
                  options={warehouses}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onSearch={(text) => setWarehouseSearch(text.trim())}
                  placeholder="Select warehouse"
                  disabled={!regionValue}
                />

                <FormMessage />
              </FormItem>
            )}
          />

          {/* SALES AREA */}

          <FormField
            control={form.control}
            name="sales_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Area</FormLabel>

                <AutoComplete
                  enableSelectAll
                  options={salesAreas}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onSearch={(text) => setSalesAreaSearch(text.trim())}
                  placeholder="Select sales area"
                  disabled={!warehouseValue}
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
                  enableSelectAll
                  options={routes}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onSearch={(text) => setRouteSearch(text.trim())}
                  placeholder="Select route"
                  disabled={!salesAreaValue}
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-x-6 lg:pt-5">
            <Button
              type="submit"
              className="shadow-xm bg-[#022235] cursor-pointer"
            >
              Filter
            </Button>
            <Button
              type="button"
              className="shadow-xm bg-[#022235] cursor-pointer"
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
