"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

type Props = {
  onFilter: (filters: SalesFilterPayload) => void;
};

export default function MyForm({ onFilter }: Props) {
  const form = useForm<SalesFilterFormValues>({
    resolver: zodResolver(salesFilterSchema),
    defaultValues: {
      dateRange: undefined,
      warehouse: "",
      brand_id: "",
      material_type: "", // Updated name
      material: "",
    },
  });

  /* MOCK DATA */
  const warehouses = [
    { label: "Warehouse A", value: "1" },
    { label: "Warehouse B", value: "2" },
  ];
  const types = [
    { label: "Type 1", value: "1" },
    { label: "Type 2", value: "2" },
  ];
  const brands = [
    { label: "Brand A", value: "1" },
    { label: "Brand B", value: "2" },
  ];
  const materials = [
    { label: "Material X", value: "1" },
    { label: "Material Y", value: "2" },
  ];

  function onSubmit(values: SalesFilterFormValues) {
    if (!values.dateRange?.from || !values.dateRange?.to) {
      toast.error("Please select date range");
      return;
    }

    const filters: SalesFilterPayload = {
      fromdate: format(values.dateRange.from, "yyyy-MM-dd"),
      todate: format(values.dateRange.to, "yyyy-MM-dd"),
      warehouse_id: values.warehouse || "",
      brand_id: values.brand_id || "",
      material_type_id: values.material_type || "", // Mapping updated
      material_id: values.material || "",
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
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5">
          {/* DATE RANGE */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => {
              const dateRange = field.value as DateRange | undefined;
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Range</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal w-full",
                          !dateRange?.from && "text-muted-foreground",
                        )}
                      >
                        {dateRange?.from ? (
                          dateRange.to ? (
                            `${format(dateRange.from, "dd/MM/yy")} - ${format(dateRange.to, "dd/MM/yy")}`
                          ) : (
                            format(dateRange.from, "dd/MM/yy")
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
                        selected={dateRange}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* WAREHOUSE */}
          <FormField
            control={form.control}
            name="warehouse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <AutoComplete
                  options={warehouses}
                  value={field.value ?? ""} // Fixes "undefined" error
                  onChange={field.onChange}
                  placeholder="Select warehouse"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MATERIAL TYPE */}
          <FormField
            control={form.control}
            name="material_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Type</FormLabel>
                <AutoComplete
                  options={types}
                  value={field.value ?? ""} // Fixes "undefined" error
                  onChange={field.onChange}
                  placeholder="Select type"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BRAND */}
          <FormField
            control={form.control}
            name="brand_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <AutoComplete
                  options={brands}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select brand"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MATERIAL */}
          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <AutoComplete
                  options={materials}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select material"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-x-4">
          <Button
            type="submit"
            className=" text-white  bg-[#022235] cursor-pointer"
          >
            Filter
          </Button>
          <Button
            type="submit"
            className=" text-white  bg-[#022235] cursor-pointer"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
