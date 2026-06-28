"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "fresh-fruits",
    name: "Fresh Fruits",
    items: "200+ items",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80",
    color: "bg-green-500",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    items: "150+ items",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    color: "bg-orange-500",
  },
  {
    id: "dairy",
    name: "Dairy Products",
    items: "80+ items",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    color: "bg-blue-600",
  },
  {
    id: "meat",
    name: "Meat & Poultry",
    items: "120+ items",
    image: "https://images.unsplash.com/photo-1607166452264-61c19b3a5822?w=400&q=80",
    color: "bg-red-600",
  },
  {
    id: "bakery",
    name: "Bakery Items",
    items: "90+ items",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    color: "bg-yellow-500",
  },
  {
    id: "beverages",
    name: "Beverages",
    items: "100+ items",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80",
    color: "bg-purple-500",
  },
  {
    id: "frozen",
    name: "Frozen Foods",
    items: "70+ items",
    image: "https://images.unsplash.com/photo-1571131652158-b610c436bb56?w=400&q=80",
    color: "bg-teal-500",
  },
  {
    id: "snacks",
    name: "Snacks",
    items: "180+ items",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
    color: "bg-pink-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function CategoryGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-800 text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover fresh, quality products across all your favorite categories.
            From farm-fresh produce to household essentials.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/category/${category.id}`}
                className="group relative block rounded-2xl overflow-hidden aspect-square"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div
                  className={cn(
                    "absolute inset-0 opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-90",
                    category.color
                  )}
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-700 text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm font-500">
                    {category.items}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
