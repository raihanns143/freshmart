"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCircle2, Ticket, Truck, Clock, Tag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";;
import { useSettings } from "@/context/SettingsContext";

// Colour palette cycles for coupons so every card looks distinct
const PALETTE = [
  { bgClass: "bg-orange-50", textClass: "text-orange-600", borderClass: "border-orange-100" },
  { bgClass: "bg-blue-50",   textClass: "text-blue-600",   borderClass: "border-blue-100"   },
  { bgClass: "bg-sky-50",    textClass: "text-sky-600",    borderClass: "border-sky-100"    },
  { bgClass: "bg-purple-50", textClass: "text-purple-600", borderClass: "border-purple-100" },
  { bgClass: "bg-pink-50",   textClass: "text-pink-600",   borderClass: "border-pink-100"   },
];

const ICONS = [Ticket, Truck, Clock, Tag, Ticket];

export interface CouponOffer {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
}

export function SpecialOffersClient({ offers }: { offers: CouponOffer[] }) {
  const { settings } = useSettings();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(code);
        toast.success(`Coupon code ${code} copied!`);
        setTimeout(() => setCopiedCode(null), 3000);
      });
    } else {
      toast.error("Clipboard API not available");
    }
  };

  if (!offers || offers.length === 0) return null;

  return (
    <section id="special-offers" className="py-16 bg-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="mb-6 md:mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-800 text-gray-900 tracking-tight text-left">Special Offers</h2>
            <p className="hidden md:block text-gray-500 mt-2 font-medium text-left">Exclusive deals and coupons for you</p>
          </div>
        </div>

        {/* Offers Grid / Scroll */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 gap-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible pb-4 md:pb-0">
          {offers.map((offer, index) => {
            const palette = PALETTE[index % PALETTE.length];
            const Icon = ICONS[index % ICONS.length];
            const isCopied = copiedCode === offer.code;
            const title = offer.type === "PERCENTAGE"
              ? `${offer.value}% Off Your Order`
              : `${formatPrice(offer.value, settings.activeCurrency)} Off Your Order`;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "min-w-[280px] snap-start flex-shrink-0 md:min-w-0 md:flex-shrink relative rounded-[24px] p-6 border transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden",
                  palette.bgClass,
                  palette.borderClass
                )}
              >
                {/* Decorative Background Element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 bg-current pointer-events-none" style={{ color: "inherit" }} />

                <div className="relative z-10">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white shadow-sm", palette.textClass)}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">
                    {offer.description || "Use this code at checkout to save on your order."}
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
                          ? "bg-blue-500 text-white"
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
