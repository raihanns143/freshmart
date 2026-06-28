import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard – FreshMart",
  description: "Manage products, orders, and users.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
