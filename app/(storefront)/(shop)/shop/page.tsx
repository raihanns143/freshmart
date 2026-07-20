import type { Metadata } from "next";
import { ShopPage as ShopPageClient } from "@/components/shop/ShopPage";
import { Suspense } from "react";

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settingsRecords = await prisma.setting.findMany({
    where: {
      key: { in: ["SEO_SHOP_TITLE", "SEO_SHOP_DESCRIPTION", "SITE_NAME"] },
    },
  });
  
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  const siteName = settings.SITE_NAME || "Raihans Shop";
  const title = settings.SEO_SHOP_TITLE || `Shop All Products | ${siteName}`;
  const description = settings.SEO_SHOP_DESCRIPTION || "Browse the complete catalog of fresh groceries, organic produce, meat, and daily essentials at Raihans Shop.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://raihans.shop/shop",
    },
    openGraph: {
      title,
      description,
      url: "https://raihans.shop/shop",
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>}>
      <ShopPageClient />
    </Suspense>
  );
}
