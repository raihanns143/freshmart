"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/currency";;
import { CartSkeleton } from "@/components/cart/CartSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
export default function CartPage() {
  const { settings } = useSettings();
  const { items, removeItem, updateQuantity, total, isHydrated } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const tax = total * settings.taxRate;
  const shipping = total > settings.deliveryCharge || total === 0 ? 0 : settings.deliveryCharge;
  const finalTotal = total - discount + tax + shipping;
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode === "WELCOME20" && total > 50) {
      setDiscount(total * 0.2);
      toast.success("Coupon applied! 20% off.");
    } else if (couponCode === "FREESHIP" && total > 100) {
      toast.success("Free shipping applied!");
      // Shipping is already 0 if > 50, but just for demo
    } else {
      toast.error("Invalid coupon or minimum order not met.");
      setDiscount(0);
    }
  };
  
  if (!isHydrated) return <CartSkeleton />;
  
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC]">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any fresh groceries yet."
          primaryAction={{ label: "Start Shopping", href: "/shop" }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md mx-4"
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="section-container">
        <h1 className="text-3xl font-800 text-gray-900 mb-8">Shopping Cart ({items.length})</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Product Image */}
                <Link href={`/product/${item.product.slug}`} className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100">
                  {item.product.images?.[0] ? (
                    <Image src={item.product.images[0].url} alt={item.product.name} width={96} height={96} className="w-full h-full object-contain mix-blend-multiply" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-gray-300" /></div>
                  )}
                </Link>
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.slug}`} className="font-bold text-gray-900 text-lg line-clamp-1 hover:text-primary transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mb-3">Unit: {item.product.unit}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{formatPrice(item.product.price, settings.activeCurrency)}</span>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(total, settings.activeCurrency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(discount, settings.activeCurrency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-gray-900">{formatPrice(tax, settings.activeCurrency)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{shipping === 0 ? "Free" : formatPrice(shipping, settings.activeCurrency)}</span>
                </div>
              </div>
              <div className="flex justify-between items-end mb-8">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="text-3xl font-900 text-gray-900 tracking-tight">{formatPrice(finalTotal, settings.activeCurrency)}</span>
              </div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-8">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo Code" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase"
                />
                <button type="submit" className="bg-gray-900 text-white px-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                  Apply
                </button>
              </form>
              <Link 
                href="/checkout"
                className="w-full bg-primary text-white h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg hover:bg-secondary active:scale-[0.98] transition-all shadow-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Secure SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}