import type { Metadata } from "next";
import { AdminLayoutWrapper } from "@/components/admin/layout/AdminLayoutWrapper";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { template: "%s | Raihans Shop Admin", default: "Raihans Shop Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Note: /admin/login has its own standalone page; this layout wraps all dashboard pages
  return (
    <div className={`${inter.variable} font-sans`}>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
      <Toaster richColors position="top-right" theme="dark" />
    </div>
  );
}
