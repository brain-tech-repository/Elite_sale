"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { AutoComplete, AutoCompleteOption } from "@/components/ui/autocomplete";

/* =========================
   SCHEMA
========================= */

const formSchema = z.object({
  region: z.string().min(1, "Region is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  Brand: z.string().min(1, "Brand is required"),
  material_group: z.string().min(1, "Material group is required"),
  material: z.string().min(1, "Material is required"),
});

type FormValues = z.infer<typeof formSchema>;

/* =========================
   OPTIONS
========================= */

const regionOptions: AutoCompleteOption[] = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "west", label: "West" },
];

const warehouseOptions: AutoCompleteOption[] = [
  { value: "wh1", label: "Warehouse 1" },
  { value: "wh2", label: "Warehouse 2" },
];

const brandOptions: AutoCompleteOption[] = [
  { value: "brand1", label: "Brand 1" },
  { value: "brand2", label: "Brand 2" },
];

const groupOptions: AutoCompleteOption[] = [
  { value: "group1", label: "Group 1" },
  { value: "group2", label: "Group 2" },
];

const materialOptions: AutoCompleteOption[] = [
  { value: "mat1", label: "Material 1" },
  { value: "mat2", label: "Material 2" },
];

/* =========================
   COMPONENT
========================= */

export default function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: "",
      warehouse: "",
      Brand: "",
      material_group: "",
      material: "",
    },
  });

  function onSubmit(values: FormValues) {
    try {
      console.log(values);
      toast.success("Form submitted successfully!");
    } catch (error) {
      toast.error("Submission failed");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-7xl mx-auto py-4 px-2"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Region */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <AutoComplete
                    options={regionOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Region"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Warehouse */}
          <FormField
            control={form.control}
            name="warehouse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <FormControl>
                  <AutoComplete
                    options={warehouseOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Warehouse"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="Brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Brand</FormLabel>
                <FormControl>
                  <AutoComplete
                    options={brandOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Brand"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Material Group */}
          <FormField
            control={form.control}
            name="material_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Group</FormLabel>
                <FormControl>
                  <AutoComplete
                    options={groupOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Material Group"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Material */}
          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <FormControl>
                  <AutoComplete
                    options={materialOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Material"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex w-full justify-start gap-6 pt-2">
          <Button type="submit" variant="outline" className="shadow-xm">
            Filter
          </Button>

          <Button
            type="button"
            variant="outline"
            className="shadow-xm"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
