"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Minus, ShoppingCart, Heart, ShieldCheck, Truck, ChevronRight, Share2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/context/WishlistContext";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductDetailView({ product, relatedProducts }: { product: any; relatedProducts: any[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(product.variants?.[0] ?? null);
  const { addItem } = useCart();
  const { isInWishlist, toggle: toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const currentPrice = selectedVariant?.price ?? product.price ?? 0;
  const originalPrice = selectedVariant?.salePrice ?? product.originalPrice ?? null;
  const currentStock = selectedVariant?.stock ?? product.stock ?? 0;
  const inStock = currentStock > 0 && (selectedVariant?.inStock ?? product.inStock ?? true);

  const discountPercentage = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Group variants by size and color for selectors
  const sizes = useMemo(() => {
    const s = new Set<string>();
    product.variants?.forEach((v: any) => { if (v.size) s.add(v.size); });
    return Array.from(s);
  }, [product.variants]);

  const colors = useMemo(() => {
    const c = new Set<string>();
    product.variants?.forEach((v: any) => { if (v.color) c.add(v.color); });
    return Array.from(c);
  }, [product.variants]);

  const [selectedSize, setSelectedSize] = useState<string | null>(selectedVariant?.size ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(selectedVariant?.color ?? null);

  const handleVariantChange = (size?: string | null, color?: string | null) => {
    const v = product.variants?.find((variant: any) => {
      const matchSize = !size || variant.size === size;
      const matchColor = !color || variant.color === color;
      return matchSize && matchColor;
    });
    if (v) {
      setSelectedVariant(v);
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!inStock || currentStock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    addItem(product, quantity, selectedVariant);
    toast.success(`${product.name} added to cart`, {
      action: { label: "View Cart", onClick: () => (window.location.href = "/cart") },
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const specs = [
    { label: "Brand", value: product.brand?.name || "FreshMart" },
    { label: "SKU", value: selectedVariant?.sku || product.id.slice(0, 8).toUpperCase() },
    { label: "Barcode", value: selectedVariant?.barcode || "N/A" },
    { label: "Unit", value: product.unit || "piece" },
    { label: "Weight", value: selectedVariant?.weight ? `${selectedVariant.weight} kg` : product.weight ? `${product.weight} kg` : "N/A" },
  ];

  return (
    <div className="section-container py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square bg-gray-50 rounded-3xl flex items-center justify-center p-6 border border-gray-100">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage].url}
                alt={product.images[activeImage].alt || product.name}
                fill
                className="object-contain mix-blend-multiply p-4"
                priority
              />
            ) : (
              <ShoppingCart className="w-24 h-24 text-gray-200" />
            )}
            {/* Badges */}
            <div className="absolute top-5 left-5 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {discountPercentage}% OFF
                </div>
              )}
              {product.badge && (
                <div className={cn("text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm", product.badgeColor === "green" ? "bg-primary" : "bg-blue-500")}>
                  {product.badge}
                </div>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-20 h-20 flex-shrink-0 bg-gray-50 rounded-2xl border-2 p-2 transition-all",
                    activeImage === idx ? "border-primary" : "border-transparent hover:border-gray-200"
                  )}
                >
                  <Image src={img.url} alt="thumbnail" width={80} height={80} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.category.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 flex-wrap">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-sm font-bold text-gray-900 ml-1">{(product.rating ?? 0).toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-400">({product.reviewCount ?? 0} Reviews)</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-500">{product.soldCount ?? 0} sold</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">${currentPrice.toFixed(2)}</span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
            )}
            <span className="text-sm text-gray-500 ml-1">/{product.unit || "piece"}</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDesc || product.description}</p>

          {/* Variant Selectors */}
          {sizes.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-700 mb-2 block">Size</span>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); handleVariantChange(size, selectedColor); }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all",
                      selectedSize === size
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          {colors.length > 0 && (
            <div className="mb-6">
              <span className="text-sm font-semibold text-gray-700 mb-2 block">Color</span>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); handleVariantChange(selectedSize, color); }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all",
                      selectedColor === color
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900">Quantity</span>
              <span className={cn("text-sm font-bold", inStock ? "text-green-600" : "text-red-500")}>
                {inStock ? `${currentStock} in stock` : "Out of Stock"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl w-full sm:w-36 h-12 px-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50" disabled={quantity <= 1}>
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50" disabled={quantity >= currentStock || !inStock}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} disabled={!inStock || currentStock <= 0} className="flex-1 bg-primary text-white font-bold text-base rounded-xl h-12 flex items-center justify-center gap-2 hover:bg-secondary active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button onClick={() => toggleWishlist(product)} className={cn("w-12 h-12 flex-shrink-0 bg-white border rounded-xl flex items-center justify-center transition-all", inWishlist ? "border-red-500 text-red-500 bg-red-50" : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200")}>
                <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
              </button>
              <button onClick={handleShare} className="w-12 h-12 flex-shrink-0 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>100% Quality Guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>Next Day Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Reviews Matrix */}
      <div className="border-t border-gray-100 pt-12 lg:pt-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="w-full lg:w-2/3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">Product Description</h2>
            <div className="prose prose-gray max-w-none text-gray-600 mb-12 lg:mb-16">
              {product.description ? product.description.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-3">{paragraph}</p>
              )) : <p className="italic text-gray-400">No description available.</p>}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">Customer Reviews</h2>
            {product.reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="flex flex-col gap-6 lg:gap-8">
                {product.reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {review.user?.name?.[0] ?? "U"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{review.user?.name || "Anonymous"}</h4>
                          {review.verified && <span className="text-xs text-primary bg-primary/5 px-2 py-0.5 rounded-full">Verified Purchase</span>}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex gap-1 text-yellow-400 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("w-4 h-4", s <= review.rating ? "fill-current" : "text-gray-200")} />
                      ))}
                    </div>
                    {review.comment && <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Specifications</h3>
              <dl className="flex flex-col gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between border-b border-gray-200 pb-3 last:border-0">
                    <dt className="text-gray-500 text-sm">{spec.label}</dt>
                    <dd className="font-semibold text-gray-900 text-sm">{spec.value}</dd>
                  </div>
                ))}
                {product.tags && (
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <dt className="text-gray-500 text-sm">Tags</dt>
                    <dd className="font-semibold text-gray-900 text-sm text-right">{product.tags}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-100 pt-12 lg:pt-16 mt-12 lg:mt-16">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p: any) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden">
                  {p.images?.[0] ? (
                    <Image src={p.images[0].url} alt={p.name} fill className="object-contain p-3 mix-blend-multiply group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                <p className="text-xs text-gray-400 mb-1">{p.category.name}</p>
                <p className="text-sm font-bold text-gray-900">${p.price?.toFixed(2) ?? "0.00"}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
