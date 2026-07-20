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

      {/* === BRAND ENTITY & SEO SECTIONS === */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="section-container max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Raihans Shop – Your Trusted Online Grocery Platform in Bangladesh
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Welcome to Raihans Shop, where we bring the freshest groceries, premium meats, and everyday essentials directly to your doorstep. We are committed to making your daily shopping easier and more reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Why Raihans Shop?</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Customers trust Raihans Shop because we prioritize quality, speed, and affordability. Every product is hand-picked to ensure you receive only the best produce and pantry staples.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About Raihans Shop</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Born out of a desire to simplify grocery shopping in Bangladesh, Raihans Shop has grown into a reliable online destination. We source directly from trusted suppliers.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">How fast does Raihans Shop deliver?</h3>
                <p className="text-sm text-gray-600 mt-1">We offer fast delivery across Bangladesh, ensuring your groceries arrive fresh and on time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Are the products at Raihans Shop fresh?</h3>
                <p className="text-sm text-gray-600 mt-1">Absolutely. Raihans Shop works directly with farmers and verified suppliers to guarantee maximum freshness.</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}
