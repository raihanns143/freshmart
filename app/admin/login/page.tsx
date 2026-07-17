import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login – FreshMart",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
