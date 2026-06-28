import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreshMart Pro – Farm Fresh Groceries Delivered Fast",
  description: "Shop online for fresh produce, dairy, meat, and everyday essentials. Delivered straight to your door in minutes.",
  keywords: ["grocery", "fresh produce", "delivery", "supermarket", "food"],
  authors: [{ name: "FreshMart Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freshmart.com",
    title: "FreshMart Pro",
    description: "Farm Fresh Groceries Delivered Fast",
    siteName: "FreshMart Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshMart Pro",
    description: "Farm Fresh Groceries Delivered Fast",
  },
};

export const viewport: Viewport = {
  themeColor: "#22C55E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Providers>
          <Header />
          <div className="flex-1 flex flex-col min-h-screen pt-20 lg:pt-0">
            {children}
          </div>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
