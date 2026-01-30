"use client";

import React, { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <Toaster richColors />
      {children}
    </QueryProvider>
  );
}
