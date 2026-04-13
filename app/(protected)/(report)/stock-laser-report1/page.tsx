"use client";

import { Suspense } from "react";
import { MaterialForm } from "./components/form";

// Assuming you might receive these from a parent or a hook for Edit mode
// For a direct "Create" page, these can stay empty/false

interface PageProps {
  params?: { id?: string }; // If using Next.js dynamic routes
  searchParams?: { [key: string]: string | string[] | undefined };
}

function MaterialFormContent({ id, isEditMode, initialData }: any) {
  return (
    // <div className="rounded-lg border border-border/50 bg-white py-4 dark:bg-neutral-900">
    <MaterialForm
      initialValues={initialData}
      isEditMode={isEditMode}
      isLoading={false}
      backHref="/materials" // Where to go when they click 'Back'
    />
    // </div>
  );
}

export default function Page({ params }: PageProps) {
  // If you are on an Edit page, you'd fetch data here using 'params.id'
  // For now, this is a clean direct-entry form page
  const isEditMode = !!params?.id;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Loading Form...
        </div>
      }
    >
      <div className="p-4 md:p-8">
        <MaterialFormContent isEditMode={isEditMode} initialData={null} />
      </div>
    </Suspense>
  );
}
