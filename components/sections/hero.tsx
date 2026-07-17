"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";

export function Hero() {
  const scrollToSection = useScrollToSection("special-offers");

  return (
    <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-16 overflow-hidden bg-white">
      <div className="section-container">
        {/* Main Banner Container */}
        <div className="relative rounded-[2rem] overflow-hidden bg-hero-gradient shadow-2xl shadow-blue-600/25">
          
          {/* Decorative Abstract Background Patterns */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[140%] rounded-full bg-white/5 blur-3xl transform rotate-12 mix-blend-overlay" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[100%] rounded-full bg-black/5 blur-3xl transform -rotate-12 mix-blend-overlay" />
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 sm:p-12 lg:p-16 xl:p-20 min-h-[500px] lg:min-h-[560px]">
            
            {/* Left Content Area */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-white max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold mb-6"
              >
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                Weekend Special - 20% Off
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-800 leading-[1.1] tracking-tight mb-6"
              >
                Fresh Groceries <br />
                <span className="text-accent">From Local Farmers</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-white/90 mb-8 max-w-lg leading-relaxed font-medium"
              >
                Shop online for fresh produce, dairy, meat, and everyday Bangladeshi essentials. Delivered straight to your door in minutes.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link
                  href="/shop"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl shadow-black/10 group"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={scrollToSection}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/30 hover:scale-105 transition-all backdrop-blur-md group"
                >
                  View Deals
                </button>
              </motion.div>
            </div>

            {/* Right Showcase Area */}
            <div className="hidden lg:flex w-full lg:w-1/2 relative h-[500px] justify-end items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="relative z-10 w-full max-w-[420px] h-[480px] rounded-3xl shadow-2xl transform translate-x-12 xl:translate-x-4 border border-white/50"
              >
                {/* Background Image filling the card */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-inner group">
                  <Image 
                    src="/images/hero_premium.jpg" 
                    alt="Premium Bangladeshi Grocery Marketplace" 
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle soft shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Best Seller Badge - Re-positioned to top-right to not cover important parts */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-blue-100/90 backdrop-blur text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    Best Seller
                  </div>
                </div>
                
                {/* Floating Decorative Elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-1/4 -left-12 bg-white/95 backdrop-blur p-3 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 z-20"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shadow-inner">
                    <span className="text-2xl">🐟</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">River</p>
                    <p className="text-sm font-bold text-gray-900">Catch</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 15, 0] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-12 -right-8 bg-white/95 backdrop-blur p-3 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 z-20"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shadow-inner">
                    <span className="text-2xl">❄️</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery</p>
                    <p className="text-sm font-bold text-gray-900">Cold Chain</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
