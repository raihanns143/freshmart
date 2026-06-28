"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

// ─── PRODUCT DATA ─────────────────────────────────────────────────────────────
const makeProduct = (
  id: string,
  name: string,
  price: number,
  oldPrice: number | null,
  unit: string,
  rating: number,
  reviews: number,
  badge: string | null,
  badgeColor: string | null,
  img: string,
  catName: string,
  catSlug: string,
  inStock = true,
): Product => ({
  id,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  description: name,
  shortDesc: name,
  category: {
    id: catSlug,
    name: catName,
    slug: catSlug,
    description: null,
    image: null,
    color: null,
    icon: null,
    itemCount: 0,
    parentId: null,
  },
  categoryId: catSlug,
  brand: null,
  brandId: null,
  price,
  originalPrice: oldPrice,
  discount: oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null,
  stock: inStock ? 50 : 0,
  inStock,
  unit,
  images: [{ id, url: img, alt: name, isMain: true, order: 0 }],
  badge,
  badgeColor,
  tags: [],
  isFeatured: true,
  isActive: true,
  metaTitle: null,
  metaDesc: null,
  rating,
  reviewCount: reviews,
  viewCount: 0,
  soldCount: 0,
  specifications: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const FEATURED_PRODUCTS: Product[] = [
  makeProduct("1",  "Organic Bananas",     2.99, 3.49, "bunch",         4.8, 124, "Organic",     "green",  "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80", "Fresh Fruits", "fresh-fruits"),
  makeProduct("2",  "Fresh Milk 1L",       3.29, null, "1 litre",        4.9,  89, "Fresh",      "blue",   "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80", "Dairy",        "dairy"),
  makeProduct("3",  "Sourdough Bread",     4.99, 5.99, "800g loaf",      4.7,  67, "Sale",       "red",    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", "Bakery",       "bakery"),
  makeProduct("4",  "Free Range Eggs",     4.49, null, "12 pack",        4.8, 156, "Free Range", "blue",   "https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=500&q=80", "Dairy",        "dairy"),
  makeProduct("5",  "Cherry Tomatoes",     3.79, null, "400g punnet",    4.6,  92, null,         null,     "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&q=80", "Vegetables",   "vegetables"),
  makeProduct("6",  "Greek Yogurt",        5.99, 6.99, "500g tub",       4.9, 203, null,         null,     "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80", "Dairy",        "dairy"),
  makeProduct("7",  "Avocados (4 pack)",   6.99, null, "4 pack",         4.5,  78, null,         null,     "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=500&q=80", "Fresh Fruits", "fresh-fruits", false),
  makeProduct("8",  "Chicken Breast",      8.99, null, "500g",           4.7, 184, null,         null,     "https://images.unsplash.com/photo-1604503468506-a8da13d11b36?w=500&q=80", "Meat",         "meat"),
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-white" aria-labelledby="featured-heading">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            id="featured-heading"
            className="text-3xl lg:text-4xl font-800 text-gray-900 mb-4"
          >
            Featured Products
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Hand-picked quality products at great prices. Fresh, local, and delivered with care.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white rounded-full font-600 transition-all duration-200"
          >
            View All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
