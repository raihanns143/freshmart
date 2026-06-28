"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Leaf, Milk, Fish, Croissant, Snowflake, Coffee, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Fresh Produce", href: "/category/fresh-produce", icon: Leaf, hasDropdown: true },
  { name: "Dairy & Eggs", href: "/category/dairy-eggs", icon: Milk, hasDropdown: true },
  { name: "Meat & Seafood", href: "/category/meat-seafood", icon: Fish, hasDropdown: false },
  { name: "Bakery", href: "/category/bakery", icon: Croissant, hasDropdown: false },
  { name: "Frozen Foods", href: "/category/frozen-foods", icon: Snowflake, hasDropdown: true },
  { name: "Beverages", href: "/category/beverages", icon: Coffee, hasDropdown: false },
  { name: "Snacks", href: "/category/snacks", icon: Cookie, hasDropdown: false },
];

export function CategoryNav() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="section-container relative z-10">
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isHovered = hoveredCategory === category.name;

          return (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={category.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  isHovered ? "bg-gray-50 text-primary" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-4 h-4", isHovered ? "text-primary" : "text-gray-400")} />
                {category.name}
                {category.hasDropdown && (
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 ml-0.5 transition-transform duration-200",
                    isHovered ? "text-primary rotate-180" : "text-gray-400"
                  )} />
                )}
              </Link>
              
              {/* Optional: Add animated dropdown here later using AnimatePresence if hasDropdown is true */}
              {category.hasDropdown && isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-white shadow-xl border border-gray-100 rounded-xl p-2 z-50 pointer-events-auto"
                >
                  <div className="flex flex-col gap-1">
                    <Link href={`${category.href}/all`} className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      View All {category.name}
                    </Link>
                    <Link href={`${category.href}/new`} className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      New Arrivals
                    </Link>
                    <Link href={`${category.href}/sale`} className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      On Sale
                    </Link>
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
