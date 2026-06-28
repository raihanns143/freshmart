"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus, Plus, Trash2, Tag, ShoppingBag, ArrowRight,
  Truck, ChevronRight, Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

const VALID_COUPONS: Record<string, { type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING"; value: number; label: string }> = {
  WELCOME20: { type: "PERCENTAGE", value: 20, label: "20% off" },
  FREEDEL: { type: "FREE_SHIPPING", value: 0, label: "Free delivery" },
  EXPRESS30: { type: "PERCENTAGE", value: 10, label: "10% off" },
};

export function CartPage() {
  const {
    items, subtotal, shipping, tax, total, discount,
    couponCode, updateQuantity, removeItem, applyCoupon, removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCouponCode = () => {
    const code = couponInput.trim().toUpperCase();
    const coupon = VALID_COUPONS[code];
    if (!coupon) {
      toast.error("Invalid coupon code. Try WELCOME20, FREEDEL, or EXPRESS30.");
      return;
    }
    setCouponLoading(true);
    setTimeout(() => {
      let discountAmount = 0;
      if (coupon.type === "PERCENTAGE") discountAmount = (subtotal * coupon.value) / 100;
      else if (coupon.type === "FIXED") discountAmount = coupon.value;
      applyCoupon(code, discountAmount);
      toast.success(`Coupon applied! ${coupon.label}`);
      setCouponLoading(false);
      setCouponInput("");
    }, 600);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">
            Add some fresh products to get started!
          </p>
          <Link href="/shop" className="btn-primary">
            <ShoppingBag className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="section-container py-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
            <Link href="/" className="hover:text-primary-500">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Shopping Cart</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, overflow: "hidden" }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl p-4 shadow-sm flex gap-4"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0"
                  >
                    <Image
                      src={item.product.images?.[0]?.url || "/images/placeholder-product.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          {item.product.category.name}
                        </p>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-semibold text-gray-900 text-sm leading-tight hover:text-primary-500 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {formatCurrency(item.product.price)} / {item.product.unit}
                    </p>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1.5 font-semibold text-sm text-gray-900 min-w-[36px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Total */}
                      <span className="font-bold text-gray-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-primary-500 hover:text-primary-hover font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-primary-500" />
                <h3 className="font-semibold text-gray-900">Coupon Code</h3>
              </div>
              {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary-500" />
                    <div>
                      <p className="text-xs text-gray-500">Applied:</p>
                      <p className="font-bold text-primary-500">{couponCode}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyCouponCode()}
                    placeholder="Enter coupon code"
                    className="flex-1 fm-input text-sm py-2.5"
                  />
                  <button
                    onClick={applyCouponCode}
                    disabled={!couponInput || couponLoading}
                    className="px-4 py-2.5 bg-primary-500 hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Try: WELCOME20, FREEDEL, EXPRESS30
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-5">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">Coupon Discount</span>
                    <span className="font-medium text-green-500">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Shipping
                  </span>
                  <span className={cn("font-medium", shipping === 0 ? "text-green-500" : "text-gray-900")}>
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (8%)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                </div>

                {subtotal < 50 && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <Truck className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Add{" "}
                      <span className="font-semibold">{formatCurrency(50 - subtotal)}</span>{" "}
                      more for free shipping!
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-extrabold text-2xl text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full mt-5 py-3.5 justify-center rounded-xl text-base"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-2 mt-3">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <p className="text-center text-xs text-gray-400">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
