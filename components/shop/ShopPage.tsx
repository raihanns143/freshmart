"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { Pagination } from "@/components/ui/Pagination";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

// Demo products for UI without database
const ALL_PRODUCTS: Product[] = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  name: [
    "Organic Bananas","Fresh Milk 1L","Sourdough Bread","Free Range Eggs",
    "Cherry Tomatoes","Greek Yogurt","Avocados (4 pack)","Chicken Breast",
    "Spinach Leaves","Cheddar Cheese","Orange Juice","Whole Wheat Pasta",
    "Olive Oil Extra Virgin","Blueberries","Salmon Fillet","Almond Milk",
    "Broccoli Crown","Greek Feta Cheese","Fresh Strawberries","Beef Mince",
    "Coconut Milk","Mixed Nuts","Sweet Potatoes","Classic Tiramisu",
  ][i],
  slug: ["organic-bananas","fresh-milk","sourdough-bread","free-range-eggs","cherry-tomatoes","greek-yogurt","avocados","chicken-breast","spinach","cheddar","orange-juice","pasta","olive-oil","blueberries","salmon","almond-milk","broccoli","feta","strawberries","beef-mince","coconut-milk","mixed-nuts","sweet-potatoes","tiramisu"][i],
  description: "Fresh quality product",
  shortDesc: "Premium quality",
  category: {
    id: String((i % 5) + 1),
    name: ["Fresh Fruits","Vegetables","Dairy","Meat","Bakery"][i % 5],
    slug: ["fresh-fruits","vegetables","dairy-eggs","meat-seafood","bakery"][i % 5],
    description: null, image: null, color: null, icon: null, itemCount: 50, parentId: null,
  },
  categoryId: String((i % 5) + 1),
  brand: null, brandId: null,
  price: parseFloat((1.99 + i * 0.9).toFixed(2)),
  originalPrice: i % 3 === 0 ? parseFloat((2.49 + i * 0.9).toFixed(2)) : null,
  discount: i % 3 === 0 ? 20 : null,
  stock: i === 6 ? 0 : 50,
  inStock: i !== 6,
  unit: "piece",
  images: [{
    id: String(i + 1),
    url: [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=70",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=70",
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=70",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70",
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=70",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=70",
      "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400&q=70",
      "https://images.unsplash.com/photo-1604503468506-a8da13d11b36?w=400&q=70",
    ][i % 8],
    alt: "", isMain: true, order: 0,
  }],
  badge: i % 4 === 0 ? "Organic" : i % 4 === 1 ? "Fresh" : i % 4 === 2 ? "Sale" : null,
  badgeColor: i % 4 === 0 ? "green" : i % 4 === 1 ? "blue" : i % 4 === 2 ? "red" : null,
  tags: [],
  isFeatured: i < 8,
  isActive: true,
  rating: parseFloat((3.5 + (i % 15) * 0.1).toFixed(1)),
  reviewCount: 10 + i * 7,
  viewCount: 100 + i * 20,
  soldCount: 50 + i * 10,
  specifications: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const PAGE_SIZE = 12;

export function ShopPage() {
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
    maxPrice: 100,
    rating: 0,
    inStock: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category.slug)) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.rating && p.rating < filters.rating) return false;
      if (filters.inStock && !p.inStock) return false;
      return true;
    });
  }, [filters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popular") return b.soldCount - a.soldCount;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [filtered, sort]);

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="section-container py-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop All Products</h1>
          <p className="text-gray-500 mt-1">Discover our full range of fresh groceries</p>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar – Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} />
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
                  <span className="font-semibold text-gray-900">{sorted.length}</span> products
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:border-primary-500 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {/* View Mode */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary-500 text-white" : "text-gray-400 hover:text-gray-600")}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary-500 text-white" : "text-gray-400 hover:text-gray-600")}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <AnimatePresence mode="wait">
              {paginated.length > 0 ? (
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
                  {paginated.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                  <button
                    onClick={() => setFilters({ categories: [], minPrice: 0, maxPrice: 100, rating: 0, inStock: false })}
                    className="mt-4 btn-primary text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
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
                <FilterSidebar filters={filters} onChange={(f) => { setFilters(f); setSidebarOpen(false); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
