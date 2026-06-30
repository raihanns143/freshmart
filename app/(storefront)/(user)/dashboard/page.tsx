import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export const metadata: Metadata = {
  title: "My Account – FreshMart",
  description: "Manage your orders, addresses, and account settings.",
};

export default function Dashboard() {
  return <DashboardPage />;
}
