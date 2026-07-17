"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";;
import { useSettings } from "@/context/SettingsContext";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

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
  const { settings } = useSettings();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!active) return;
        setCategories((json.data ?? []) as CategoryOption[]);
      } catch (err: any) {
        if (!active) return;
        setCategoriesError(err.message || "Failed to load categories");
      } finally {
        if (active) setCategoriesLoading(false);
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: next });
  };

  const handleReset = () => {
    onChange({ categories: [], minPrice: 0, maxPrice: 10000, rating: 0, inStock: false });
  };

  const activeCount = [
    filters.categories.length > 0,
    filters.minPrice > 0 || filters.maxPrice < 10000,
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
          {categoriesLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading categories...
            </div>
          ) : categoriesError ? (
            <p className="text-sm text-red-500">{categoriesError}</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories available</p>
          ) : (
            categories.map((cat) => (
              <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#2563EB] cursor-pointer"
                />
                <span className="flex-1 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400">{cat.productCount}</span>
              </label>
            ))
          )}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={10000}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: parseInt(e.target.value) })
            }
            className="w-full accent-[#2563EB]"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="px-3 py-1 bg-gray-50 rounded-lg text-gray-600">
              {formatPrice(filters.minPrice, settings.activeCurrency)}
            </span>
            <span className="text-gray-400 text-xs">to</span>
            <span className="px-3 py-1 bg-gray-50 rounded-lg text-gray-600">
              {formatPrice(filters.maxPrice, settings.activeCurrency)}
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
            className="w-4 h-4 rounded border-gray-300 accent-[#2563EB]"
          />
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
      </FilterSection>
    </div>
  );
}
