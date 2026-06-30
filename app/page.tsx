import { Hero } from "@/components/sections/hero";
import { Categories } from "@/components/sections/categories";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { SpecialOffers } from "@/components/sections/special-offers";
import { MobileSearch } from "@/components/sections/mobile-search";
import { MobileCategoryBar } from "@/components/sections/mobile-category-bar";
import { MobileHero } from "@/components/sections/mobile-hero";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">
      {/* === MOBILE SPECIFIC TOP SECTIONS === */}
      <div className="md:hidden">
        <MobileSearch />
        <MobileCategoryBar />
        <MobileHero />
      </div>

      {/* === DESKTOP SPECIFIC TOP SECTIONS === */}
      <div className="hidden md:block">
        <Hero />
        <Categories />
      </div>
      
      {/* === SHARED SECTIONS (Mobile Horizontal Scroll / Desktop Grid) === */}
      <FeaturedProducts />
      <SpecialOffers />
    </main>
  );
}
