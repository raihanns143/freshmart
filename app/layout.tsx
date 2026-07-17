import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { ResponsiveToaster } from "@/components/ui/responsive-toaster";
import { prisma } from "@/lib/prisma";
import { defaultBDT } from "@/lib/currency";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settingsRecords = await prisma.setting.findMany({
    where: {
      key: {
        in: ["SITE_NAME", "SEO_TITLE", "SEO_DESCRIPTION", "SEO_KEYWORDS"],
      },
    },
  });
  
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  const siteName = settings.SITE_NAME || "FreshMart Bangladesh";
  const title = settings.SEO_TITLE || "Raihan's FreshMart \u2013 Fresh Groceries, Delivered Fast";
  const description = settings.SEO_DESCRIPTION || "Shop online for fresh produce, dairy, meat, and everyday essentials. Delivered straight to your door in minutes.";
  const keywords = settings.SEO_KEYWORDS ? settings.SEO_KEYWORDS.split(",") : ["grocery", "fresh produce", "delivery", "supermarket", "food"];

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description: description,
    keywords: keywords,
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
      title: title,
      description: description,
      siteName: siteName,
      images: [{ url: "/logo.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/logo.png"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#22C55E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global settings
  const settingsRecords = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  const currencyCode = settings.CURRENCY || "BDT";
  
  const activeCurrency = await prisma.currency.findUnique({
    where: { code: currencyCode }
  }) || defaultBDT;

  const globalSettings = {
    currency: currencyCode,
    activeCurrency: {
      ...activeCurrency,
      position: activeCurrency.position as "left" | "right",
    },
    siteName: settings.SITE_NAME || "FreshMart Bangladesh",
    taxRate: settings.TAX_RATE ? parseFloat(settings.TAX_RATE) : 0.05,
    deliveryCharge: settings.DELIVERY_CHARGE ? parseFloat(settings.DELIVERY_CHARGE) : 50,
    contactEmail: settings.CONTACT_EMAIL || "support@freshmart.com.bd",
    contactPhone: settings.CONTACT_PHONE || "+880 1700 000000",
    address: settings.STORE_ADDRESS || "Dhaka, Bangladesh",
  };

  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <body className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
        <Providers settings={globalSettings}>
          {children}
          <ResponsiveToaster />
        </Providers>
      </body>
    </html>
  );
}
