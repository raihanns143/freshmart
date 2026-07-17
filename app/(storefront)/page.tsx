import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/sections/hero";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { MobileSearch } from "@/components/sections/mobile-search";
import { MobileCategoryBar } from "@/components/sections/mobile-category-bar";
import { MobileHero } from "@/components/sections/mobile-hero";
import { HomeSectionScroller } from "@/components/ui/HomeSectionScroller";

import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

function FeaturedSkeleton() {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="section-container">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md mb-2"></div>
            <div className="hidden md:block h-5 w-64 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    </section>
  );
}



export default async function Home() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' }
  });

  return (
    <main className="flex-1 flex flex-col w-full">
      <HomeSectionScroller />
      {/* === MOBILE SPECIFIC TOP SECTIONS === */}
      <div className="md:hidden">
        <MobileSearch />
        <MobileCategoryBar categories={categories} />
        <MobileHero />
      </div>

      {/* === DESKTOP SPECIFIC TOP SECTIONS === */}
      <div className="hidden md:block">
        <Hero />
      </div>
      
      {/* === SHARED SECTIONS (Mobile Horizontal Scroll / Desktop Grid) === */}
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}
