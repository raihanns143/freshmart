"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_DATA = [
  {
    id: "1",
    name: "Fresh Produce",
    slug: "fresh-produce",
    itemCount: 145,
    bgColor: "bg-[#F1F8F1]", // Soft green
    textColor: "text-[#2E7D32]", // Dark green
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
  },
  {
    id: "2",
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    itemCount: 86,
    bgColor: "bg-[#FFF8E1]", // Soft yellow
    textColor: "text-[#F57F17]", // Dark yellow
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  },
  {
    id: "3",
    name: "Meat & Seafood",
    slug: "meat-seafood",
    itemCount: 92,
    bgColor: "bg-[#FFEBEE]", // Soft red
    textColor: "text-[#C62828]", // Dark red
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d11b36?w=400&q=80",
  },
  {
    id: "4",
    name: "Bakery",
    slug: "bakery",
    itemCount: 54,
    bgColor: "bg-[#FFF3E0]", // Soft orange
    textColor: "text-[#EF6C00]", // Dark orange
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  },
  {
    id: "5",
    name: "Frozen Foods",
    slug: "frozen-foods",
    itemCount: 112,
    bgColor: "bg-[#E3F2FD]", // Soft blue
    textColor: "text-[#1565C0]", // Dark blue
    image: "https://images.unsplash.com/photo-1574722772633-e401c33eb317?w=400&q=80",
  },
  {
    id: "6",
    name: "Beverages",
    slug: "beverages",
    itemCount: 204,
    bgColor: "bg-[#F3E5F5]", // Soft purple
    textColor: "text-[#6A1B9A]", // Dark purple
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
  },
  {
    id: "7",
    name: "Snacks",
    slug: "snacks",
    itemCount: 178,
    bgColor: "bg-[#FCE4EC]", // Soft pink
    textColor: "text-[#AD1457]", // Dark pink
    image: "https://images.unsplash.com/photo-1582281272097-48f8a15e61cc?w=400&q=80", // Popcorn
  },
  {
    id: "8",
    name: "Pantry Staples",
    slug: "pantry-staples",
    itemCount: 315,
    bgColor: "bg-[#E0F2F1]", // Soft teal
    textColor: "text-[#00695C]", // Dark teal
    image: "https://images.unsplash.com/photo-1588610543661-00e9de5e1de7?w=400&q=80", // Pasta/jars
  }
];

export function Categories() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-800 text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="text-gray-500 mt-2 font-medium">Explore our wide selection of fresh products</p>
          </div>
          <Link
            href="/categories"
            className="group flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
          >
            View All Categories
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {CATEGORY_DATA.map((category, index) => (
            <Link href={`/category/${category.slug}`} key={category.id} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={cn(
                  "relative w-full aspect-square rounded-[20px] overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300",
                  category.bgColor
                )}
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-300 z-10" />

                <div className="relative w-3/5 h-3/5 mb-4 z-20">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>
                
                <div className="relative z-20 mt-auto">
                  <h3 className={cn("text-lg sm:text-xl font-bold tracking-tight mb-1", category.textColor)}>
                    {category.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 bg-white/60 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
                    {category.itemCount} items
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
