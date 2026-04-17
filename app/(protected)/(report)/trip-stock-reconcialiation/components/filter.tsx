"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AutoComplete } from "@/components/ui/autocomplete";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
      trip_number: "",
      trip_date: "",
      route: "",
      salesman: "",
    },
  });

  /* ---------------- STATIC DEMO DATA ---------------- */
  const tripOptions = [
    {
      value: "TRIP001",
      label: "TRIP001",
      trip_date: "17-Apr-2026",
      route: "Allahabad City",
      salesman: "Rahul",
    },
    {
      value: "TRIP002",
      label: "TRIP002",
      trip_date: "18-Apr-2026",
      route: "Naini Route",
      salesman: "Amit",
    },
    {
      value: "TRIP003",
      label: "TRIP003",
      trip_date: "19-Apr-2026",
      route: "Jhunsi Route",
      salesman: "Vikas",
    },
  ];

  /* ---------------- AUTO FILL ---------------- */
  const handleTripChange = (val: string | number) => {
    const selectedTrip = String(val);

    form.setValue("trip_number", selectedTrip);

    const selectedData = tripOptions.find(
      (item) => item.value === selectedTrip,
    );

    if (selectedData) {
      form.setValue("trip_date", selectedData.trip_date);
      form.setValue("route", selectedData.route);
      form.setValue("salesman", selectedData.salesman);
    } else {
      form.setValue("trip_date", "");
      form.setValue("route", "");
      form.setValue("salesman", "");
    }
  };

  function onSubmit(values: SalesFilterFormValues) {
    const payload: SalesFilterPayload = {
      trip_number: values.trip_number,
      trip_date: values.trip_date,
      route: values.route,
      salesman: values.salesman,
    };

    onFilter(payload);
    toast.success("Filters Applied");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-7xl mx-auto py-1 px-2"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          {/* TRIP NUMBER */}
          <FormField
            control={form.control}
            name="trip_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Number</FormLabel>
                <AutoComplete
                  options={tripOptions}
                  value={field.value}
                  placeholder="Select Trip Number"
                  onChange={handleTripChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TRIP DATE */}
          <FormField
            control={form.control}
            name="trip_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Date</FormLabel>
                <input
                  value={field.value}
                  readOnly
                  className="w-full h-10 px-3 border rounded-md bg-gray-100"
                  placeholder="Auto Fill"
                />
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
                <input
                  value={field.value}
                  readOnly
                  className="w-full h-10 px-3 border rounded-md bg-gray-100"
                  placeholder="Auto Fill"
                />
              </FormItem>
            )}
          />

          {/* SALESMAN */}
          <FormField
            control={form.control}
            name="salesman"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salesman</FormLabel>
                <input
                  value={field.value}
                  readOnly
                  className="w-full h-10 px-3 border rounded-md bg-gray-100"
                  placeholder="Auto Fill"
                />
              </FormItem>
            )}
          />

          {/* BUTTONS */}
          <div className="flex gap-2 mt-6">
            <Button
              type="submit"
              className="text-white bg-[#022235] hover:bg-[#033350]"
            >
              Filter
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                form.reset({
                  trip_number: "",
                  trip_date: "",
                  route: "",
                  salesman: "",
                })
              }
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
