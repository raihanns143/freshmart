"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-16 overflow-hidden bg-white">
      <div className="section-container">
        {/* Main Banner Container */}
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/20">
          
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
                <span className="text-accent">Delivered Fast</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-white/90 mb-8 max-w-lg leading-relaxed font-medium"
              >
                Shop online for fresh produce, dairy, meat, and everyday essentials. Delivered straight to your door in minutes.
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
                
                <div className="flex items-center gap-3 mt-4 sm:mt-0 text-white/90 px-4 py-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-white flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={`https://images.unsplash.com/photo-${1534528741775 + i}?w=100&q=80`} alt="User avatar" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-bold text-white">4.9/5</span>
                    </div>
                    <span className="text-xs font-medium opacity-80">from 10k+ reviews</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Showcase Area */}
            <div className="hidden lg:flex w-full lg:w-1/2 relative h-[500px] justify-end items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="relative z-10 w-full max-w-[420px] h-[480px] bg-white rounded-3xl p-6 shadow-2xl flex flex-col justify-between transform translate-x-12 xl:translate-x-4 border border-white/50 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Best Seller
                  </div>
                  <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 relative mb-6 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" 
                    alt="Fresh organic vegetables" 
                    className="w-[90%] h-[90%] object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Organic Farm Box</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">(128 Reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 line-through text-sm font-medium mr-2">$34.99</span>
                      <span className="text-2xl font-bold text-gray-900">$29.99</span>
                    </div>
                    <button className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-secondary hover:scale-105 transition-all shadow-md shadow-primary/30">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                  </div>
                </div>
                
                {/* Floating Decorative Elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -top-6 -left-12 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🥕</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Farm</p>
                    <p className="text-sm font-bold text-gray-900">Fresh</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 15, 0] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-16 -right-10 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">❄️</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Delivery</p>
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
