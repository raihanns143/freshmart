"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Loader2, SearchX } from "lucide-react";
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
  "pantry-staples": {
    name: "Pantry Staples",
    description: "Everyday essentials for your kitchen",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    color: "from-amber-600/80",
  },
  "health-beauty": {
    name: "Health & Beauty",
    description: "Wellness and personal care products",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
    color: "from-indigo-600/80",
  },
};

export function CategoryPageContent({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");

  const meta = CATEGORY_META[slug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: "Browse our selection of fresh products",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    color: "from-green-600/80",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?category=${slug}&sort=${sort}&limit=24`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const json = await res.json();
        // Map DB product shape to frontend Product type
        const mapped = (json.data || []).map((p: any) => ({
          ...p,
          stock: p.inStock ? 50 : 0,
          tags: p.tags ? p.tags.split(",").filter(Boolean) : [],
          specifications: [],
          metaTitle: p.metaTitle ?? null,
          metaDesc: p.metaDesc ?? null,
          brand: p.brand ?? null,
          brandId: p.brandId ?? null,
          originalPrice: p.originalPrice ?? null,
          discount: p.discount ?? null,
          badge: p.badge ?? null,
          badgeColor: p.badgeColor ?? null,
          shortDesc: p.shortDesc ?? null,
        }));
        setProducts(mapped);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [slug, sort]);

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
          unoptimized
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
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isLoading ? "Loading..." : `${products.length} Products`}
          </h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white outline-none focus:border-primary cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchX className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-gray-500 text-lg font-medium">Failed to load products</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No products in this category yet</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new arrivals</p>
            <Link
              href="/shop"
              className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
