"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Loader2, SearchX } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

// Fetch with retry helper
async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || i === retries) return res;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error("All retries exhausted");
}

export function CategoryPageContent({ category }: { category: CategoryData }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchWithRetry(`/api/products?category=${category.slug}&sort=${sort}&limit=24`);
        if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
        const json = await res.json();
        // Map DB product shape to frontend Product type
        const mapped = (json.data || []).map((p: any) => ({
          ...p,
          // Use real stock value; fall back to 50 if 0 but inStock=true (legacy data)
          stock: p.stock > 0 ? p.stock : (p.inStock ? 50 : 0),
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
  }, [category.slug, sort]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Category Banner — rendered only when the category has an image in the DB */}
      {category.image ? (
        <div className="relative h-52 md:h-64 overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          <div className="absolute inset-0 flex items-center">
            <div className="section-container">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-white/70 text-sm mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white">{category.name}</span>
              </nav>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-extrabold text-white mb-2">{category.name}</h1>
              {category.description && <p className="text-white/80">{category.description}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="section-container pt-8">
          {/* Breadcrumb + title (no hero when the category has no image) */}
          <nav className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700">{category.name}</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-gray-900">{category.name}</h1>
          {category.description && <p className="text-gray-500 mt-1">{category.description}</p>}
        </div>
      )}

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
