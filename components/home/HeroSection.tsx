"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-primary-500 overflow-hidden relative">
      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row items-center pt-12 pb-16 lg:py-24 gap-12">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-white max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-600 mb-6 shadow-sm">
              <span className="text-base">⚡</span> Weekend Special
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-800 leading-tight mb-6">
              Fresh Groceries
              <br />
              <span className="text-yellow-400">Delivered Fast</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-50 mb-8 max-w-lg font-400 leading-relaxed">
              Get farm-fresh produce, pantry essentials, and household items
              delivered to your doorstep in under 30 minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3.5 rounded-full font-600 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/offers"
                className="bg-primary-600/30 hover:bg-primary-600/50 text-white border border-primary-400/50 px-8 py-3.5 rounded-full font-600 transition-colors backdrop-blur-sm"
              >
                View Deals
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm font-500 text-primary-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                30-min delivery
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-yellow-400" />
                Free above $50
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 w-full lg:w-auto relative"
          >
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[500px] w-full max-w-[600px] mx-auto">
              <div className="absolute inset-0 bg-primary-400 rounded-[2rem] transform rotate-3 scale-105 opacity-50"></div>
              <div className="absolute inset-0 bg-primary-600 rounded-[2rem] transform -rotate-2 scale-105 opacity-50"></div>
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
                  alt="Fresh groceries"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
