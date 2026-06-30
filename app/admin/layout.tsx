import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { template: "%s | FreshMart Admin", default: "FreshMart Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Note: /admin/login has its own standalone page; this layout wraps all dashboard pages
  return (
    <div className={`${inter.variable} font-sans`}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster richColors position="top-right" theme="dark" />
    </div>
  );
}
