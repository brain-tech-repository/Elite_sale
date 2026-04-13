// app/providers/QueryProvider.tsx
"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* The corner icon to open Devtools */}
      <ReactQueryDevtools initialIsOpen={false}
    //    position="bottom-right" 
       />
    </QueryClientProvider>
  );
}