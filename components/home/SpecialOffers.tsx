"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Percent, Truck, Clock, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const offers = [
  {
    id: "welcome20",
    icon: Percent,
    title: "20% Off First Order",
    description: "New customers get 20% off their first order above $50",
    code: "WELCOME20",
    gradientClass: "offer-gradient-pink",
    badge: "Limited Time",
  },
  {
    id: "freedel",
    icon: Truck,
    title: "Free Delivery",
    description: "Free same-day delivery on orders above $75",
    code: "FREEDEL",
    gradientClass: "offer-gradient-blue",
    badge: "Limited Time",
  },
  {
    id: "express30",
    icon: Clock,
    title: "Express Delivery",
    description: "Get your groceries delivered in under 30 minutes",
    code: "EXPRESS30",
    gradientClass: "offer-gradient-green",
    badge: "Limited Time",
  },
];

function OfferCard({
  offer,
}: {
  offer: (typeof offers)[0];
}) {
  const [copied, setCopied] = useState(false);
  const Icon = offer.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code).then(() => {
      setCopied(true);
      toast.success(`Code "${offer.code}" copied!`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      {/* Colored Header */}
      <div className={cn("p-6 pb-8 relative", offer.gradientClass)}>
        {/* Badge */}
        <span className="absolute top-4 right-4 text-[10px] font-700 bg-white/20 text-white px-2.5 py-1 rounded-full">
          {offer.badge}
        </span>

        {/* Icon */}
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Text */}
        <h3 className="text-xl font-800 text-white mb-1">{offer.title}</h3>
        <p className="text-white/80 text-sm leading-relaxed">
          {offer.description}
        </p>
      </div>

      {/* Coupon Code Row */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">Use code:</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <span className="font-700 text-sm text-gray-800 tracking-wider">
              {offer.code}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-600 transition-all duration-200",
              copied
                ? "bg-green-500 text-white"
                : "bg-gray-900 text-white hover:bg-gray-800"
            )}
            aria-label={`Copy coupon code ${offer.code}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function SpecialOffers() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50" aria-labelledby="offers-heading">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            id="offers-heading"
            className="text-3xl lg:text-4xl font-800 text-gray-900 mb-3"
          >
            Special Offers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals and save more on your grocery shopping.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
