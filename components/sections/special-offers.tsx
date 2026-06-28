"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCircle2, Ticket, Truck, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const OFFERS = [
  {
    id: "welcome",
    title: "20% Off Your First Order",
    description: "Use code at checkout to get 20% off your first purchase over $50.",
    code: "WELCOME20",
    icon: Ticket,
    bgClass: "bg-orange-50",
    textClass: "text-orange-600",
    borderClass: "border-orange-100",
  },
  {
    id: "delivery",
    title: "Free Delivery",
    description: "Enjoy free standard delivery on all orders over $100.",
    code: "FREESHIP",
    icon: Truck,
    bgClass: "bg-blue-50",
    textClass: "text-blue-600",
    borderClass: "border-blue-100",
  },
  {
    id: "express",
    title: "Express Delivery",
    description: "Get your groceries in under 2 hours for a flat $5 fee.",
    code: "FAST5",
    icon: Clock,
    bgClass: "bg-green-50",
    textClass: "text-green-600",
    borderClass: "border-green-100",
  },
];

export function SpecialOffers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(code);
        toast.success(`Coupon code ${code} copied!`);
        setTimeout(() => setCopiedCode(null), 3000);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      toast.error("Clipboard API not available");
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-800 text-gray-900 tracking-tight">Special Offers</h2>
          <p className="text-gray-500 mt-2 font-medium">Exclusive deals and coupons for you</p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFERS.map((offer, index) => {
            const Icon = offer.icon;
            const isCopied = copiedCode === offer.code;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative rounded-[24px] p-6 border transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden",
                  offer.bgClass,
                  offer.borderClass
                )}
              >
                {/* Decorative Background Element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 bg-current pointer-events-none" style={{ color: "inherit" }} />
                
                <div className="relative z-10">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white shadow-sm", offer.textClass)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">
                    {offer.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl px-4 py-3 flex items-center justify-center">
                      <span className="font-bold text-gray-900 tracking-widest">{offer.code}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(offer.code)}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm",
                        isCopied 
                          ? "bg-green-500 text-white" 
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                      )}
                      aria-label="Copy code"
                    >
                      {isCopied ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
