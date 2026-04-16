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
      brand_id: "",
      material_type: "",
      material: "",
    },
  });

  // Watch values to trigger dependent queries
  const selectedMaterialType = form.watch("material_type");
  const selectedBrand = form.watch("brand_id");

  // Fetching Data
  const { data: warehouses = [], isLoading: isLoadingWh } = useWarehouses();
  const { data: types = [], isLoading: isLoadingTypes } = useMaterialTypes();
  const { data: brands = [], isLoading: isLoadingBrands } =
    useBrands(selectedMaterialType);
  const { data: materials = [], isLoading: isLoadingMaterials } =
    useMaterials(selectedBrand);

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
      material_type_id: values.material_type || "",
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
                  options={warehouses}
                  value={field.value ?? ""}
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
                  enableSelectAll={true}
                  options={types}
                  value={field.value ?? ""}
                  onChange={(val) => {
                    field.onChange(val);
                    form.setValue("brand_id", ""); // Reset dependent fields
                    form.setValue("material", "");
                  }}
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
                  enableSelectAll={true}
                  options={brands}
                  disabled={!selectedMaterialType}
                  value={field.value ?? ""}
                  onChange={(val) => {
                    field.onChange(val);
                    form.setValue("material", ""); // Reset dependent field
                  }}
                  placeholder={
                    selectedMaterialType ? "Select brand" : "Select type first"
                  }
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
                  enableSelectAll={true}
                  options={materials}
                  disabled={!selectedBrand}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder={
                    selectedBrand ? "Select material" : "Select brand first"
                  }
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
