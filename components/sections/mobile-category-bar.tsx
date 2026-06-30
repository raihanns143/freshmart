"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Fresh Produce", slug: "fresh-produce", icon: "🍏" },
  { name: "Dairy & Eggs", slug: "dairy-eggs", icon: "🥛" },
  { name: "Meat & Seafood", slug: "meat-seafood", icon: "🥩" },
  { name: "Bakery", slug: "bakery", icon: "🥐" },
  { name: "Frozen Foods", slug: "frozen-foods", icon: "❄️" },
  { name: "Snacks", slug: "snacks", icon: "🥨" },
  { name: "Beverages", slug: "beverages", icon: "🥤" },
];

export function MobileCategoryBar() {
  const pathname = usePathname();

  return (
    <div className="md:hidden bg-white border-b border-gray-100">
      <div className="flex overflow-x-auto scrollbar-hide px-4">
        {CATEGORIES.map((cat) => {
          // For homepage, we might want to just mock "Fresh Produce" as active
          // Or let it be active if we are actually on /category/[slug]
          const isActive = pathname === `/category/${cat.slug}` || (pathname === "/" && cat.slug === "fresh-produce");

          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap py-3 px-1 mr-6 text-sm font-semibold transition-colors border-b-2",
                isActive 
                  ? "border-primary text-gray-900" 
                  : "border-transparent text-gray-500 hover:text-gray-900"
              )}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
