import { Hero } from "@/components/sections/hero";
import { Categories } from "@/components/sections/categories";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { SpecialOffers } from "@/components/sections/special-offers";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">
      {/* 1. Top Hero Banner with Promotions */}
      <Hero />
      
      {/* 2. Shop by Category Grid */}
      <Categories />
      
      {/* 3. Featured Products Grid (Server Fetched) */}
      <FeaturedProducts />
      
      {/* 4. Special Offers & Coupons */}
      <SpecialOffers />
    </main>
  );
}
