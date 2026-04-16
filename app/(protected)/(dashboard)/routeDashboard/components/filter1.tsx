"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* =========================
   SCHEMA
========================= */

const formSchema = z.object({
  dateRange: z.object({
    from: z.date({
      message: "Start date is required",
    }),
    to: z.date({
      message: "End date is required",
    }),
  }),

  routes: z.string().min(1, "Route is required"),
});

type FormValues = z.infer<typeof formSchema>;

/* =========================
   COMPONENT
========================= */

export default function MyForm1({
  onTypeChange,
}: {
  onTypeChange: (type: "routes" | "salesmen") => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
      routes: "",
    },
  });

  function onSubmit(values: FormValues) {
    const type = values.routes as "routes" | "salesmen";

    onTypeChange(type); // 🔥 main trigger

    toast.success("Filters applied successfully!");
  }
  return (
    <>
      <Form {...form}>
        {/* <DataTableHeader title="Route Performance" /> */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 max-w-7xl mx-auto py-1 px-2"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 lg:px-4">
            {/* ================= Date Range ================= */}

            {/* ================= Routes ================= */}

            <FormField
              control={form.control}
              name="routes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routes</FormLabel>

                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      onTypeChange(val as "routes" | "salesmen"); // 🔥 instant API call
                    }}
                  >
                    <FormControl className="shadow-xm w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Route" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="routes">Route</SelectItem>
                      <SelectItem value="salesmen">Salesman</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="flex gap-6 pt-6">
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
            </div> */}
          </div>

          {/* ================= Buttons ================= */}
        </form>
      </Form>
    </>
  );
}
