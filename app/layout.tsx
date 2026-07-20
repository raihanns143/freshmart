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
        in: [
          "SITE_NAME", "SEO_TITLE", "SEO_DESCRIPTION", "SEO_KEYWORDS", 
          "SEO_OG_IMAGE", "SEO_TWITTER_IMAGE", "STORE_ADDRESS", "CONTACT_PHONE", "CONTACT_EMAIL"
        ],
      },
    },
  });
  
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  const siteName = settings.SITE_NAME || "Raihans Shop";
  const title = settings.SEO_TITLE || "Raihans Shop | Online Grocery Store in Bangladesh";
  const description = settings.SEO_DESCRIPTION || "Shop fresh vegetables, fruits, fish, meat, rice, dairy products, snacks and daily essentials online from Raihans Shop. Fast delivery and Cash on Delivery available across Bangladesh.";
  const keywords = settings.SEO_KEYWORDS ? settings.SEO_KEYWORDS.split(",") : [
    "Raihans Shop", "Online Grocery Bangladesh", "Grocery Delivery Bangladesh", 
    "Online Supermarket", "Fresh Vegetables", "Fresh Fish", "Fresh Meat", 
    "Rice", "Daily Essentials", "Bangladesh Grocery", "Rajshahi Grocery", 
    "Cash On Delivery", "FreshMart Bangladesh"
  ];
  const ogImage = settings.SEO_OG_IMAGE || "/logo.png";
  const twitterImage = settings.SEO_TWITTER_IMAGE || "/logo.png";

  return {
    metadataBase: new URL("https://raihans.shop"),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description: description,
    keywords: keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: "https://raihans.shop",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/favicon-icon.png", type: "image/png" },
      ],
      apple: "/favicon-icon.png",
      shortcut: "/favicon-icon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: "en_BD",
      url: "https://raihans.shop",
      title: title,
      description: description,
      siteName: siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [twitterImage],
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

  const siteName = settings.SITE_NAME || "Raihans Shop";
  const contactEmail = settings.CONTACT_EMAIL || "support@raihans.shop";
  const contactPhone = settings.CONTACT_PHONE || "+8801700000000";
  const address = settings.STORE_ADDRESS || "Rajshahi, Bangladesh";

  const globalSettings = {
    currency: currencyCode,
    activeCurrency: {
      ...activeCurrency,
      position: activeCurrency.position as "left" | "right",
    },
    siteName,
    taxRate: settings.TAX_RATE ? parseFloat(settings.TAX_RATE) : 0.05,
    deliveryCharge: settings.DELIVERY_CHARGE ? parseFloat(settings.DELIVERY_CHARGE) : 50,
    contactEmail,
    contactPhone,
    address,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://raihans.shop/#organization",
        "name": siteName,
        "url": "https://raihans.shop",
        "logo": "https://raihans.shop/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": contactPhone,
          "contactType": "customer service",
          "email": contactEmail,
          "areaServed": "BD",
          "availableLanguage": ["en", "bn"]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://raihans.shop/#website",
        "url": "https://raihans.shop",
        "name": siteName,
        "publisher": {
          "@id": "https://raihans.shop/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://raihans.shop/search?query={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Store",
        "@id": "https://raihans.shop/#store",
        "name": siteName,
        "image": "https://raihans.shop/logo.png",
        "telephone": contactPhone,
        "email": contactEmail,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": address,
          "addressLocality": "Rajshahi",
          "addressCountry": "BD"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "24.3745",
          "longitude": "88.6042"
        },
        "priceRange": "$$"
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
        <Providers settings={globalSettings}>
          {children}
          <ResponsiveToaster />
        </Providers>
      </body>
    </html>
  );
}
