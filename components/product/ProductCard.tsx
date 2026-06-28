"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Minus, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, isInCart, getItemQuantity, updateQuantity, removeItem } = useCart();
  const { isInWishlist, toggle: toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const mainImage =
    product.images?.find((i) => i.isMain)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) removeItem(product.id);
    else updateQuantity(product.id, quantity - 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const badgeColorMap: Record<string, string> = {
    green:  "bg-primary-500",
    blue:   "bg-blue-500",
    red:    "bg-red-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={cn("product-card group", className)}>
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="product-card-image">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />

          {/* Badge */}
          {product.badge && (
            <span
              className={cn(
                "absolute top-3 left-3 text-white text-xs font-600 px-2.5 py-1 rounded-full z-10",
                badgeColorMap[product.badgeColor || ""] || "bg-primary-500"
              )}
            >
              {product.badge}
            </span>
          )}

          {/* Out of Stock */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="text-white font-600 text-sm bg-black/60 px-3 py-1.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className={cn(
              "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100",
              isInWishlist(product.id)
                ? "bg-red-500 text-white opacity-100"
                : "bg-white text-gray-500 hover:text-red-500"
            )}
          >
            <Heart className="w-4 h-4" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs font-600 text-primary-500 uppercase tracking-wider mb-1">
            {product.category?.name || "Product"}
          </p>

          {/* Name */}
          <h3 className="text-sm font-600 text-gray-900 leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-600 text-gray-800">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Price + Add button */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-base font-700 text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through ml-1.5">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Cart control */}
            {inCart ? (
              <div className="flex items-center gap-1.5 bg-primary-50 border border-primary-200 rounded-xl px-1.5 py-0.5">
                <button
                  onClick={handleDecrement}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary-100 text-primary-600 transition-colors"
                  aria-label="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-600 min-w-[18px] text-center text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary-100 text-primary-600 transition-colors"
                  aria-label="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                aria-label={`Add ${product.name} to cart`}
                className="btn-add-cart"
              >
                {isAdding ? (
                  <span className="text-lg">✓</span>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
