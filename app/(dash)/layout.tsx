import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { ReactNode } from "react";

export default function DLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
