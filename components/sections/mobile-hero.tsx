"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function MobileHero() {
  return (
    <section className="md:hidden bg-[#22c55e] px-4 pt-6 pb-8 overflow-hidden rounded-b-3xl">
      <div className="flex flex-col">
        {/* Yellow Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 rounded-full text-xs font-bold text-gray-900 mb-4 self-start">
          <span>⚡</span>
          Weekend Special
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight mb-4 text-white">
          Fresh Groceries <br />
          <span className="text-[#d9f99d]">Delivered Fast</span>
        </h1>

        {/* Description */}
        <p className="text-white/90 text-sm leading-relaxed font-medium mb-6">
          Get farm-fresh produce, pantry essentials, and household items delivered to your doorstep in under 30 minutes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <Link
            href="/shop"
            className="w-full bg-white text-[#22c55e] text-center py-3.5 rounded-xl font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Shop Now
          </Link>
          <Link
            href="/offers"
            className="w-full bg-white text-[#22c55e] text-center py-3.5 rounded-xl font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            View Deals
          </Link>
        </div>

        {/* Features */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/90 mb-8">
          <div className="flex items-center gap-1.5">
            <span>⚡</span>
            <span>30-min delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🚚</span>
            <span>Free above $50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🥬</span>
            <span>Fresh Daily</span>
          </div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white/10"
        >
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
            alt="Fresh organic vegetables"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </motion.div>
      </div>
    </section>
  );
}
