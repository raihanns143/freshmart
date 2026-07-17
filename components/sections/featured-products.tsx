import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";
async function getProducts(): Promise<Product[]> {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            color: true,
            icon: true,
            itemCount: true,
            parentId: true,
          },
        },
        images: {
          select: { id: true, url: true, alt: true, isMain: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });
    if (rows.length === 0) return [];
    return rows.map((p) => ({
      ...p,
      brand: null,
      brandId: null,
      stock: p.stock > 0 ? p.stock : p.inStock ? 50 : 0,
      tags: [],
      specifications: [],
    })) as unknown as Product[];
  } catch {
    return [];
  }
}
export async function FeaturedProducts() {
  const products = await getProducts();
  if (products.length === 0) return null;
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <h2 className="text-xl md:text-3xl font-800 text-gray-900 tracking-tight text-left">
              Featured Products
            </h2>
            <p className="hidden md:block text-gray-500 mt-2 font-medium text-left">
              Handpicked fresh arrivals and weekly specials
            </p>
          </div>
          <Link href="/shop" className="md:hidden text-sm font-bold text-primary">
            See All
          </Link>
          <div className="hidden lg:flex items-center gap-2 mt-4 sm:mt-0">
            {["All", "Local", "Best Sellers", "On Sale"].map((filter, i) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  i === 0
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        {/*
          IMPORTANT: Both mobile and desktop iterate over the SAME `products` array.
          - Mobile: horizontal scroll row (overflow-x-auto), cards have fixed min-width so they scroll.
          - Desktop (md+): standard responsive grid, overflow visible.
          No slice(), take(), or separate mobile arrays.
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="group flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}