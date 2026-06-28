"use client";

import React from "react";
import Link from "next/link";
import { Star, Plus, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

// Interface reflecting the Prisma Product structure needed for the card
export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    inStock: boolean;
    rating: number;
    reviewCount: number;
    badge: string | null;
    badgeColor: string | null;
    unit: string;
    images: { url: string; alt: string | null }[];
    category: {
      name: string;
      slug: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  
  // Calculate discount percentage if original price exists
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addItem(product, 1);
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="block h-full group">
      <div className="relative flex flex-col h-full bg-white rounded-[20px] p-4 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1">
        
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] rounded-[20px] flex items-center justify-center">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl transform -rotate-12">
              OUT OF STOCK
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              {discountPercentage}% OFF
            </div>
          )}
          {product.badge && (
            <div className={cn(
              "text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm",
              product.badgeColor === "green" ? "bg-primary" : 
              product.badgeColor === "blue" ? "bg-blue-500" : 
              "bg-accent"
            )}>
              {product.badge}
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Toggle wishlist logic here
          }}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Image Container (Fallback) */}
        <div className="relative w-full aspect-square rounded-2xl bg-gray-50 mb-4 overflow-hidden flex items-center justify-center">
          {product.images[0] ? (
            <img 
              src={product.images[0].url} 
              alt={product.images[0].alt || product.name}
              className="w-[85%] h-[85%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center opacity-50">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          {/* Category Breadcrumb */}
          <span className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
            {product.category.name}
          </span>
          
          {/* Title */}
          <h3 className="text-gray-900 font-bold leading-tight mb-2 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3 mt-auto">
            <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded text-primary">
              <Star className="w-3.5 h-3.5 fill-primary text-primary mr-1" />
              <span className="text-xs font-bold">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs font-medium text-gray-400">
              ({product.reviewCount})
            </span>
          </div>

          {/* Footer: Price & Add to Cart */}
          <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-900 text-gray-900 tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-medium text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                /{product.unit}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                product.inStock 
                  ? "bg-primary text-white hover:bg-secondary active:scale-95" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
              style={{ minWidth: "40px" }} // Ensuring exact sizing for 14px icon alignment typical in 40px blocks
            >
              <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
