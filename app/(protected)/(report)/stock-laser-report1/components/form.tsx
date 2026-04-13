"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FormCardFooter } from "@/components/Form/cardFooterProps";
import { FormCardHeader } from "@/components/Form/cardHeaderProps";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define your schema based on the original form
const materialFormSchema = z.object({
  from_date: z.string().min(1, "From date is required"),
  to_date: z.string().min(1, "To date is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  materialtype: z.string().min(1, "Material type is required"),
  brand: z.string().min(1, "Brand is required"),
  Material: z.string().min(1, "Material name is required"),
});

type MaterialFormData = z.infer<typeof materialFormSchema>;

export function MaterialForm({
  initialValues,
  isEditMode = false,
  isLoading = false,
  backHref = "/materials",
}: {
  initialValues?: Partial<MaterialFormData>;
  isEditMode?: boolean;
  isLoading?: boolean;
  backHref?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      from_date: initialValues?.from_date || "",
      to_date: initialValues?.to_date || "",
      warehouse: initialValues?.warehouse || "",
      materialtype: initialValues?.materialtype || "",
      brand: initialValues?.brand || "",
      Material: initialValues?.Material || "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = useCallback(
    async (values: MaterialFormData) => {
      try {
        setIsSubmitting(true);
        console.log("Submitting values:", values);

        // Add your mutation logic here (like useCreateMaterial)
        toast.success(
          isEditMode ? "Updated successfully" : "Created successfully",
        );

        router.back();
      } catch (error: any) {
        toast.error(error?.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
    [isEditMode, router],
  );

  return (
    <Card className="lg:py-0">
      <FormCardHeader
        title={isEditMode ? "Update Material" : "Create Material Request"}
        backHref={backHref}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="gap-0 ">
          <CardContent className="py-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* From Date */}
              <FormField
                control={form.control}
                name="from_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isSubmitting || isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* To Date */}
              <FormField
                control={form.control}
                name="to_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isSubmitting || isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Warehouse - Using Select to match your original Select logic */}
              <FormField
                control={form.control}
                name="warehouse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Warehouse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Material Type */}
              <FormField
                control={form.control}
                name="materialtype"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter type"
                        {...field}
                        disabled={isSubmitting || isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter brand"
                        {...field}
                        disabled={isSubmitting || isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Material Name */}
              <FormField
                control={form.control}
                name="Material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter material"
                        {...field}
                        disabled={isSubmitting || isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <FormCardFooter
            submitLabel={
              isSubmitting || isLoading
                ? "Saving..."
                : isEditMode
                  ? "Update"
                  : "Create"
            }
            isLoading={isSubmitting || isLoading}
          />
        </form>
      </Form>
    </Card>
  );
}
