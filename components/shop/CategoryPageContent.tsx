"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

const CATEGORY_META: Record<
  string,
  { name: string; description: string; image: string; color: string }
> = {
  "fresh-produce": {
    name: "Fresh Produce",
    description: "Farm-fresh fruits and vegetables",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1200&q=80",
    color: "from-green-600/80",
  },
  "fresh-fruits": {
    name: "Fresh Fruits",
    description: "Sweet and nutritious seasonal fruits",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1200&q=80",
    color: "from-green-600/80",
  },
  vegetables: {
    name: "Vegetables",
    description: "Crisp and colorful organic vegetables",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200&q=80",
    color: "from-orange-600/80",
  },
  "dairy-eggs": {
    name: "Dairy & Eggs",
    description: "Fresh dairy products and free-range eggs",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&q=80",
    color: "from-blue-600/80",
  },
  "meat-seafood": {
    name: "Meat & Seafood",
    description: "Premium cuts of meat and fresh seafood",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&q=80",
    color: "from-red-600/80",
  },
  bakery: {
    name: "Bakery",
    description: "Freshly baked breads and pastries",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
    color: "from-yellow-600/80",
  },
  beverages: {
    name: "Beverages",
    description: "Refreshing drinks for every occasion",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&q=80",
    color: "from-purple-600/80",
  },
  "frozen-foods": {
    name: "Frozen Foods",
    description: "Convenient frozen meals and ingredients",
    image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=1200&q=80",
    color: "from-cyan-600/80",
  },
  snacks: {
    name: "Snacks",
    description: "Delicious snacks for any time of day",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=1200&q=80",
    color: "from-pink-600/80",
  },
  "health-beauty": {
    name: "Health & Beauty",
    description: "Wellness and personal care products",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
    color: "from-indigo-600/80",
  },
};

const MOCK_PRODUCTS: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `cat-${i}`,
  name: ["Organic Apples", "Fresh Oranges", "Ripe Mangoes", "Sweet Grapes", "Juicy Pears", "Plump Blueberries", "Red Cherries", "Kiwi Fruit"][i],
  slug: ["organic-apples", "fresh-oranges", "ripe-mangoes", "sweet-grapes", "juicy-pears", "plump-blueberries", "red-cherries", "kiwi-fruit"][i],
  description: "Fresh quality produce",
  shortDesc: "Premium quality",
  category: {
    id: "1",
    name: "Fresh Fruits",
    slug: "fresh-fruits",
    description: null, image: null, color: null, icon: null, itemCount: 200, parentId: null,
  },
  categoryId: "1",
  brand: null, brandId: null,
  price: parseFloat((1.99 + i * 0.8).toFixed(2)),
  originalPrice: null, discount: null,
  stock: 50, inStock: true, unit: "piece",
  images: [{
    id: String(i),
    url: [
      "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=70",
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=400&q=70",
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=70",
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=70",
      "https://images.unsplash.com/photo-1514995669114-6081e934b693?w=400&q=70",
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=70",
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=70",
      "https://images.unsplash.com/photo-1618897996318-5a901fa8b2b8?w=400&q=70",
    ][i],
    alt: "", isMain: true, order: 0,
  }],
  badge: i % 3 === 0 ? "Organic" : null,
  badgeColor: i % 3 === 0 ? "green" : null,
  tags: [], isFeatured: false, isActive: true, metaTitle: null, metaDesc: null,
  rating: 4.0 + (i % 10) * 0.1,
  reviewCount: 20 + i * 5, viewCount: 100, soldCount: 50,
  specifications: [], createdAt: new Date(), updatedAt: new Date(),
}));

export function CategoryPageContent({ slug }: { slug: string }) {
  const meta = CATEGORY_META[slug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: "Browse our selection of fresh products",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    color: "from-green-600/80",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Category Banner */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <Image
          src={meta.image}
          alt={meta.name}
          fill
          className="object-cover"
          priority
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${meta.color} to-black/30`}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="section-container">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-white/70 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">{meta.name}</span>
            </nav>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">{meta.name}</h1>
            <p className="text-white/80">{meta.description}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="section-container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {MOCK_PRODUCTS.length} Products
          </h2>
        </div>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, staggerChildren: 0.05 }}
        >
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
