import type { Metadata } from "next";
import { ReportsDashboard } from "@/components/admin/reports/ReportsDashboard";

export const metadata: Metadata = { title: "Reports" };

export default function AdminReportsPage() {
  return <ReportsDashboard />;
}
