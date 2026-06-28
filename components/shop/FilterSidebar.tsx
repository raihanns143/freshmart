"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { slug: "fresh-fruits", name: "Fresh Fruits", count: 48 },
  { slug: "vegetables", name: "Vegetables", count: 62 },
  { slug: "dairy-eggs", name: "Dairy & Eggs", count: 35 },
  { slug: "meat-seafood", name: "Meat & Seafood", count: 28 },
  { slug: "bakery", name: "Bakery", count: 22 },
  { slug: "beverages", name: "Beverages", count: 40 },
  { slug: "snacks", name: "Snacks", count: 55 },
  { slug: "frozen-foods", name: "Frozen Foods", count: 30 },
];

interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  rating: number;
  inStock: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-1"
      >
        <span className="font-semibold text-sm text-gray-800">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: next });
  };

  const handleReset = () => {
    onChange({ categories: [], minPrice: 0, maxPrice: 100, rating: 0, inStock: false });
  };

  const activeCount = [
    filters.categories.length > 0,
    filters.minPrice > 0 || filters.maxPrice < 100,
    filters.rating > 0,
    filters.inStock,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">Filters</h3>
        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-primary-500 hover:text-primary-hover font-semibold"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="w-4 h-4 rounded border-gray-300 accent-[#16C65B] cursor-pointer"
              />
              <span className="flex-1 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400">{cat.count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={100}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: parseInt(e.target.value) })
            }
            className="w-full accent-[#16C65B]"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="px-3 py-1 bg-gray-50 rounded-lg text-gray-600">
              ${filters.minPrice}
            </span>
            <span className="text-gray-400 text-xs">to</span>
            <span className="px-3 py-1 bg-gray-50 rounded-lg text-gray-600">
              ${filters.maxPrice}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() =>
                onChange({ ...filters, rating: filters.rating === r ? 0 : r })
              }
              className={cn(
                "flex items-center gap-2 w-full p-2.5 rounded-xl text-sm transition-colors",
                filters.rating === r
                  ? "bg-primary-50 text-primary-500"
                  : "hover:bg-gray-50 text-gray-600"
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i < r
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200 fill-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs">& above</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen={false}>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 accent-[#16C65B]"
          />
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
      </FilterSection>
    </div>
  );
}
