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

/* HOOKS */

import {
  useRegions,
  useWarehouses,
  useBrands,
  useMaterialGroups,
  useMaterials,
} from "../useSales";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  SalesFilterFormValues,
  SalesFilterPayload,
  salesFilterSchema,
} from "../types";
import { AutoComplete } from "@/components/ui/autocomplete";

type Props = {
  onFilter: (filters: SalesFilterPayload) => void;
};

/* =========================
   COMPONENT
========================= */

export default function MyForm({ onFilter }: Props) {
  /* SEARCH STATES */

  const [regionSearch, setRegionSearch] = useState("");
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");

  /* FORM */

  const form = useForm<SalesFilterFormValues>({
    resolver: zodResolver(salesFilterSchema),
    defaultValues: {
      dateRange: undefined,
      region: "",
      warehouse: "",
      Brand: "",
      material_group: "",
      material: "",
    },
  });

  /* WATCH VALUES */

  const regionValue = form.watch("region");
  const materialTypeValue = form.watch("material_group");
  const brandValue = form.watch("Brand");

  /* API DATA */

  const { data: regions = [] } = useRegions(regionSearch);

  const { data: warehouses = [] } = useWarehouses(
    regionValue || "",
    warehouseSearch,
  );

  const { data: groups = [] } = useMaterialGroups(groupSearch);

  const { data: brands = [] } = useBrands(materialTypeValue || "", brandSearch);

  const { data: materials = [] } = useMaterials(
    materialTypeValue || "",
    brandValue || "",
    materialSearch,
  );

  /* RESET DEPENDENT FIELDS */
  useEffect(() => {
    form.setValue("warehouse", "");
  }, [regionValue]);

  useEffect(() => {
    form.setValue("Brand", "");
    form.setValue("material", "");
  }, [materialTypeValue]);

  useEffect(() => {
    form.setValue("material", "");
  }, [brandValue]);

  /* SUBMIT */

  function onSubmit(values: SalesFilterFormValues) {
    const filters: SalesFilterPayload = {
      fromdate: format(values.dateRange.from, "yyyy-MM-dd"),
      todate: format(values.dateRange.to, "yyyy-MM-dd"),
      region_id: values.region || "",
      warehouse_id: values.warehouse || "",
      brand_id: values.Brand || "",
      material_type_id: values.material_group || "",
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
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-6">
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

          {/* MATERIAL TYPE */}

          <FormField
            control={form.control}
            name="material_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Group</FormLabel>

                <AutoComplete
                  enableSelectAll
                  options={groups}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onSearch={(text) => setGroupSearch(text.trim())}
                  placeholder="Select group"
                />

                <FormMessage />
              </FormItem>
            )}
          />
          {/* BRAND */}

          <FormField
            control={form.control}
            name="Brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Brand</FormLabel>

                <AutoComplete
                  enableSelectAll
                  options={brands}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onSearch={(text) => setBrandSearch(text.trim())}
                  placeholder="Select brand"
                  disabled={!materialTypeValue}
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
                  enableSelectAll
                  options={materials}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onSearch={(text) => setMaterialSearch(text.trim())}
                  placeholder="Select material"
                  disabled={!materialTypeValue}
                />

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* BUTTONS */}

        <div className="flex gap-x-6 ">
          <Button
            type="submit"
            className="shadow-xm bg-[#022235] text-white cursor-pointer"
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
      </form>
    </Form>
  );
}
