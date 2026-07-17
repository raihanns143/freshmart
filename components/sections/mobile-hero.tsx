"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/currency";;

export function MobileHero() {
  const scrollToSection = useScrollToSection("special-offers");
  const { settings } = useSettings();

  return (
    /* bg-hero-gradient uses the CSS variable --gradient-hero (blue 135deg) */
    <section className="md:hidden px-4 pt-6 pb-6 overflow-hidden bg-hero-gradient">
      <div className="flex flex-col">
        {/* Yellow Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 rounded-full text-xs font-bold text-gray-900 mb-4 self-start">
          <span>⚡</span>
          Weekend Special
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight mb-4 text-white">
          Fresh Groceries <br />
          {/* sky-200 gives a light-blue accent that pops against the blue hero */}
          <span className="text-sky-200">From Local Farmers</span>
        </h1>

        {/* Description */}
        <p className="text-white/90 text-sm leading-relaxed font-medium mb-6">
          Get farm-fresh produce, pantry essentials, and household items delivered to your doorstep in under 30 minutes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full">
          <Link
            href="/shop"
            className="flex-1 bg-white text-primary text-center py-3.5 px-4 rounded-xl font-bold hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center"
          >
            Shop Now
          </Link>
          <button
            onClick={scrollToSection}
            className="flex-1 bg-blue-700 text-white border border-white/20 text-center py-3.5 px-4 rounded-xl font-bold hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            View Deals
          </button>
        </div>

        {/* Features */}
        <div className="flex justify-between items-center text-xs font-semibold text-white mb-8 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">⚡</span>
            <span>30-min delivery</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🚚</span>
            <span>Free above {formatPrice(50, settings.activeCurrency)}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🥬</span>
            <span>Fresh Daily</span>
          </div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
        >
          <Image
            src="https://ibb.co.com/PZgtjrrL"
            alt="Fresh Hilsha Fish"
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
