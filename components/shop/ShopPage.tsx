"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, SlidersHorizontal, X, ChevronDown, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useSearchParams } from "next/navigation";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest" },
  { value: "popular",  label: "Most Popular" },
  { value: "price_asc",label: "Price: Low to High" },
  { value: "price_desc",label: "Price: High to Low" },
  { value: "rating",   label: "Highest Rated" },
];

const PAGE_SIZE = 12;

function normalise(p: any): Product {
  return {
    ...p,
    stock: p.stock > 0 ? p.stock : p.inStock ? 50 : 0,
    tags: p.tags ? (typeof p.tags === "string" ? p.tags.split(",").filter(Boolean) : p.tags) : [],
    specifications: p.specifications ?? [],
    brand: p.brand ?? null,
    brandId: p.brandId ?? null,
    originalPrice: p.originalPrice ?? null,
    discount: p.discount ?? null,
    badge: p.badge ?? null,
    badgeColor: p.badgeColor ?? null,
    shortDesc: p.shortDesc ?? null,
    metaTitle: p.metaTitle ?? null,
    metaDesc: p.metaDesc ?? null,
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  };
}

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || searchParams.get("q") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    categories: string[];
    minPrice: number;
    maxPrice: number;
    rating: number;
    inStock: boolean;
  }>({
    categories: [],
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
    inStock: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      if (filters.categories.length > 0) {
        params.set("category", filters.categories.join(","));
      }
      if (filters.minPrice > 0)  params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice < 10000) params.set("maxPrice", String(filters.maxPrice));
      if (filters.rating > 0) params.set("minRating", String(filters.rating));
      if (filters.inStock)       params.set("inStock", "true");
      if (initialSearch) params.set("q", initialSearch);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const mapped: Product[] = (json.data ?? []).map(normalise);
      setProducts(mapped);
      setTotalCount(json.meta?.totalCount ?? mapped.length);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [sort, page, filters, initialSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = useMemo(() => products, [products]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="section-container py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {initialSearch ? `Search Results for "${initialSearch}"` : "Shop All Products"}
          </h1>
          <p className="text-gray-500 mt-1">
            {initialSearch ? `Showing products matching your search` : "Discover our full range of fresh groceries"}
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar – Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{totalCount}</span> products
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:border-primary cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {/* View Mode */}
                <div className="hidden md:flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600")}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600")}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="py-4">
                <ProductGridSkeleton count={12} />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <X className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-gray-500 text-lg font-medium">Failed to load products</p>
                <p className="text-gray-400 text-sm mt-1">{error}</p>
                <button
                  onClick={() => fetchProducts()}
                  className="mt-4 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filtered.length > 0 ? (
                  <motion.div
                    key={`${page}-${sort}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "grid gap-4",
                      viewMode === "grid"
                        ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                    )}
                  >
                    {filtered.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    icon={X}
                    title="No products found"
                    description="Try adjusting your filters to find what you're looking for."
                    primaryAction={{
                      label: "Clear Filters",
                      onClick: () => { setFilters({ categories: [], minPrice: 0, maxPrice: 10000, rating: 0, inStock: false }); setPage(1); }
                    }}
                  />
                )}
              </AnimatePresence>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  filters={filters}
                  onChange={(f) => { setFilters(f); setPage(1); setSidebarOpen(false); }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
