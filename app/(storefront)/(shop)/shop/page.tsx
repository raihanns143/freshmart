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

  return {
    title: settings.SEO_SHOP_TITLE || `Shop All Products | ${settings.SITE_NAME || "FreshMart"}`,
    description: settings.SEO_SHOP_DESCRIPTION || "Browse our complete catalog of fresh groceries.",
  };
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>}>
      <ShopPageClient />
    </Suspense>
  );
}
