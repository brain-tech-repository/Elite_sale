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
import { useRegions } from "../useRoutes";

type Props = {
  onFilter: (filters: any) => void;
};
/* =========================
   SCHEMA
========================= */
const formSchema = z.object({
  date: z.date().optional(), // ✅ single date
  region: z.string().optional(),
  sub_region: z.string().optional(),
  warehouse: z.string().optional(),
  routes: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;
/* =========================
   COMPONENT
========================= */
export default function MyForm({ onFilter }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      region: "",
      sub_region: "",
      warehouse: "",
      routes: "",
    },
  });

  /* WATCH VALUES */

  /* API DATA */

  // const { data: regions = [] } = useRegions();
  const regions = [
    { label: "John Doe", value: "s1" },
    { label: "Jane Smith", value: "s2" },
    { label: "Michael Knight", value: "s3" },
    { label: "Sarah Connor", value: "s4" },
    { label: "James Bond", value: "s5" },
  ];

  function onSubmit(values: FormValues) {
    const payload = {
      date: values.date ? format(values.date, "yyyy-MM-dd") : "",
      region_id: values.region || "0",
      sub_region_id: values.sub_region || "0",
      warehouse_id: values.warehouse || "0",
      route_id: values.routes || "0",

      page: 1,
      length: 10,
    };

    onFilter(payload); // 🔥 THIS IS MAIN THING

    toast.success("Filters applied successfully!");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-7xl mx-auto py-1 px-2"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* ================= Date Range ================= */}

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal shadow-xm w-full",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? format(field.value, "dd/MM/yy")
                          : "Pick a date"}

                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="p-0 w-auto ">
                    <Calendar
                      mode="single" // ✅ IMPORTANT CHANGE
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

          {/* ================= Region ================= */}

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salesman</FormLabel>

                <FormControl>
                  <AutoComplete
                    options={regions}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Select Salesman"
                    searchPlaceholder="Search Salesman..."
                    width="w-full"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 mt-6">
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

        {/* ================= Buttons ================= */}
      </form>
    </Form>
  );
}
