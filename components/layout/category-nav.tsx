"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Leaf, Milk, Fish, Croissant, Snowflake, Coffee, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  Leaf, Milk, Fish, Croissant, Snowflake, Coffee, Cookie
};

export function CategoryNav({ categories = [] }: { categories?: any[] }) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="section-container relative z-10">
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        {categories.map((category) => {
          const Icon = category.icon && iconMap[category.icon] ? iconMap[category.icon] : Leaf;
          const isHovered = hoveredCategory === category.name;

          return (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={`/category/${category.slug}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  isHovered ? "bg-gray-50 text-primary" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-4 h-4", isHovered ? "text-primary" : "text-gray-400")} />
                {category.name}
                {/* For now we disable dropdowns since they were hardcoded, or check if it has children */}
                {category.children?.length > 0 && (
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 ml-0.5 transition-transform duration-200",
                    isHovered ? "text-primary rotate-180" : "text-gray-400"
                  )} />
                )}
              </Link>
              
              {/* Optional: Add animated dropdown here later using AnimatePresence if hasDropdown is true */}
              {category.children?.length > 0 && isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-white shadow-xl border border-gray-100 rounded-xl p-2 z-50 pointer-events-auto"
                >
                  <div className="flex flex-col gap-1">
                    <Link href={`/category/${category.slug}/all`} className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      View All {category.name}
                    </Link>
                    {category.children.map((child: any) => (
                      <Link key={child.id} href={`/category/${child.slug}`} className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
