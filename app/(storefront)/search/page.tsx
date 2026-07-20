import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { ShopPage as ShopPageClient } from "@/components/shop/ShopPage";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.query === 'string' ? resolvedParams.query : '';
  const title = query ? `Search results for "${query}" | Raihans Shop` : "Search | Raihans Shop";
  
  return {
    title,
    description: `Browse search results for ${query} at Raihans Shop. Buy fresh groceries online.`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `https://raihans.shop/search`,
    },
    openGraph: {
      title,
      description: `Browse search results for ${query} at Raihans Shop.`,
      url: `https://raihans.shop/search?query=${query}`,
      type: "website",
      siteName: "Raihans Shop",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `Browse search results for ${query} at Raihans Shop.`,
    }
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.query === 'string' ? resolvedParams.query : '';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `Search results for ${query}`,
    "url": `https://raihans.shop/search?query=${encodeURIComponent(query)}`,
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopPageClient />
    </Suspense>
  );
}
