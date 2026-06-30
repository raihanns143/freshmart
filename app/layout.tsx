import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raihan's FreshMart – Fresh Groceries, Delivered Fast",
  description: "Shop online for fresh produce, dairy, meat, and everyday essentials. Delivered straight to your door in minutes.",
  keywords: ["grocery", "fresh produce", "delivery", "supermarket", "food"],
  authors: [{ name: "FreshMart Team" }],
  icons: {
    icon: [
      { url: "/favicon-icon.png", type: "image/png" },
    ],
    apple: "/favicon-icon.png",
    shortcut: "/favicon-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://raihans.shop",
    title: "Raihan's FreshMart",
    description: "Fresh Groceries, Delivered Fast",
    siteName: "Raihan's FreshMart",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raihan's FreshMart",
    description: "Fresh Groceries, Delivered Fast",
    images: ["/logo.png"],
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
      <body className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
