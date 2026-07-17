"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Dynamic categories will be passed in from the parent component

export function MobileCategoryBar({ categories = [] }: { categories?: any[] }) {
  const pathname = usePathname();

  if (!categories || categories.length === 0) return null;

  return (
    <div className="md:hidden bg-white border-b border-gray-100">
      <div className="flex overflow-x-auto scrollbar-hide px-4">
        {categories.map((cat) => {
          const isActive = pathname === `/category/${cat.slug}` || (pathname === "/" && categories[0]?.slug === cat.slug);

          // We'll just show the first letter or a generic icon if the db doesn't have an icon matching an emoji. 
          // For now, let's use a default if it's missing, or the name's first character.
          const catIcon = cat.icon || "✨";

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap py-3 px-1 mr-6 text-sm font-semibold transition-colors border-b-2",
                isActive 
                  ? "border-primary text-gray-900" 
                  : "border-transparent text-gray-500 hover:text-gray-900"
              )}
            >
              <span className="text-base">{catIcon}</span>
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
