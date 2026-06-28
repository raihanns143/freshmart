"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, Heart, Share2, Minus, Plus, ShoppingCart,
  Truck, Shield, RotateCcw, ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types";
import { formatCurrency, getBadgeColor, cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { toast } from "sonner";

// Mock product – in production, fetch by slug from API/DB
const MOCK_PRODUCT: Product = {
  id: "1",
  name: "Organic Bananas",
  slug: "organic-bananas",
  description:
    "Our organic bananas are sourced from certified organic farms where no synthetic pesticides or fertilizers are used. These bananas are hand-picked at the perfect ripeness to ensure maximum sweetness and nutritional value. Rich in potassium, vitamin B6, and dietary fiber, they make for a perfect healthy snack or smoothie ingredient.",
  shortDesc: "Farm-fresh organic bananas, rich in potassium and natural sweetness",
  category: {
    id: "1", name: "Fresh Fruits", slug: "fresh-fruits",
    description: null, image: null, color: null, icon: null, itemCount: 200, parentId: null,
  },
  categoryId: "1",
  brand: null, brandId: null,
  price: 2.99, originalPrice: 3.49, discount: 14,
  stock: 50, inStock: true, unit: "bunch",
  images: [
    { id: "1", url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700&q=85", alt: "Organic Bananas", isMain: true, order: 0 },
    { id: "2", url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=700&q=85", alt: "Bananas bunch", isMain: false, order: 1 },
    { id: "3", url: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=700&q=85", alt: "Banana closeup", isMain: false, order: 2 },
  ],
  badge: "Organic", badgeColor: "green",
  tags: ["organic", "fruit", "fresh"],
  isFeatured: true, isActive: true,
  metaTitle: null, metaDesc: null,
  rating: 4.8, reviewCount: 324, viewCount: 1200, soldCount: 800,
  specifications: [
    { id: "1", key: "Weight", value: "~150g per banana" },
    { id: "2", key: "Origin", value: "Ecuador" },
    { id: "3", key: "Certification", value: "USDA Organic" },
    { id: "4", key: "Storage", value: "Room temperature" },
    { id: "5", key: "Shelf Life", value: "5-7 days" },
  ],
  createdAt: new Date(), updatedAt: new Date(),
};

const REVIEWS = [
  { id: "1", user: "Sarah M.", rating: 5, comment: "These are the sweetest bananas I've ever had! Will definitely order again.", date: "Jan 15, 2024", verified: true },
  { id: "2", user: "John D.", rating: 4, comment: "Good quality organic bananas. Arrived fresh and perfectly ripe.", date: "Jan 10, 2024", verified: true },
  { id: "3", user: "Emma K.", rating: 5, comment: "Perfect for my morning smoothies. Love that they're organic!", date: "Jan 5, 2024", verified: false },
];

const RELATED: Product[] = Array.from({ length: 4 }, (_, i) => ({
  ...MOCK_PRODUCT,
  id: `related-${i}`,
  name: ["Fresh Oranges", "Ripe Mangoes", "Sweet Grapes", "Red Apples"][i],
  slug: ["fresh-oranges", "ripe-mangoes", "sweet-grapes", "red-apples"][i],
  price: 3.49 + i * 0.5,
  badge: null,
  badgeColor: null,
  images: [{
    id: String(i),
    url: [
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=400&q=70",
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=70",
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=70",
      "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=70",
    ][i],
    alt: "", isMain: true, order: 0,
  }],
}));

export function ProductDetailPage({ slug: _slug }: { slug: string }) {
  const product = MOCK_PRODUCT; // In production, fetch by slug

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const { addItem, isInCart } = useCart();
  const { isInWishlist, toggle: toggleWishlist } = useWishlist();
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => addItem(product, quantity);

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="section-container py-4">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-primary-500 transition-colors">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/category/${product.category.slug}`} className="hover:text-primary-500 transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="section-container py-10">
        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Gallery */}
          <div className="space-y-3">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0.7, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-card"
            >
              {product.badge && (
                <span
                  className={cn(
                    "badge absolute top-4 left-4 z-10",
                    getBadgeColor(product.badgeColor)
                  )}
                >
                  {product.badge}
                </span>
              )}
              <Image
                src={product.images[selectedImage]?.url || product.images[0].url}
                alt={product.images[selectedImage]?.alt || product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                    idx === selectedImage
                      ? "border-primary-500 shadow-sm"
                      : "border-gray-200 hover:border-primary-300"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">
                {product.category.name}
              </p>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-4 h-4",
                        s <= Math.round(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200 fill-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                <span className="text-sm text-gray-400">
                  ({product.reviewCount.toLocaleString()} reviews)
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-green-500 font-semibold">
                  {product.soldCount}+ sold
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2.5 py-1 bg-red-100 text-red-500 text-sm font-bold rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-500 text-sm leading-relaxed">{product.shortDesc}</p>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  product.inStock ? "bg-green-500" : "bg-red-500"
                )}
              />
              <span
                className={cn(
                  "text-sm font-semibold",
                  product.inStock ? "text-green-600" : "text-red-500"
                )}
              >
                {product.inStock
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Quantity + Cart */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 font-semibold text-gray-900 min-w-[48px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 btn-primary py-3.5 rounded-xl justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {inCart ? "Update Cart" : "Add to Cart"}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                  inWishlist
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400"
                )}
                aria-label="Toggle wishlist"
              >
                <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
              </button>
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "30-min delivery" },
                { icon: Shield, label: "Quality guaranteed" },
                { icon: RotateCcw, label: "Easy returns" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 text-center"
                >
                  <Icon className="w-5 h-5 text-primary-500" />
                  <span className="text-xs text-gray-500 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-12">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-4 text-sm font-semibold capitalize transition-colors border-b-2 whitespace-nowrap",
                  activeTab === tab
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                {tab === "specs" ? "Specifications" : tab}
                {tab === "reviews" && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded-full text-xs">
                    {product.reviewCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="p-8">
            {activeTab === "description" && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.id}
                    className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-gray-500">{spec.key}</span>
                    <span className="text-sm font-semibold text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {REVIEWS.map((r) => (
                  <div key={r.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-500 flex-shrink-0">
                      {r.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-semibold text-sm text-gray-900">{r.user}</span>
                        {r.verified && (
                          <span className="text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "w-3.5 h-3.5",
                              s <= r.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200 fill-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RELATED.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
