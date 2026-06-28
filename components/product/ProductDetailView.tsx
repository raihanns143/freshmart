"use client";

import React, { useState } from "react";
import { Star, Plus, Minus, ShoppingCart, Heart, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { format } from "date-fns";

export function ProductDetailView({ product, inventory }: { product: any; inventory: number }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product.inStock && inventory > 0) {
      addItem(product, quantity);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="section-container py-12">
      {/* Top Section: Images & Add to Cart */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16">
        
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square bg-gray-50 rounded-[32px] flex items-center justify-center p-8 border border-gray-100">
            {product.images[activeImage] ? (
              <img 
                src={product.images[activeImage].url} 
                alt={product.images[activeImage].alt || product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            ) : (
              <ShoppingCart className="w-24 h-24 text-gray-200" />
            )}
            
            {/* Badges overlay */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <div className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {discountPercentage}% OFF
                </div>
              )}
              {product.badge && (
                <div className={`text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm ${
                  product.badgeColor === "green" ? "bg-primary" : "bg-blue-500"
                }`}>
                  {product.badge}
                </div>
              )}
            </div>
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img: any, idx: number) => (
                <button 
                  key={img.id}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl border-2 p-2 transition-all ${
                    activeImage === idx ? "border-primary" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-2">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              {product.category.name}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-800 text-gray-900 leading-tight mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-sm font-bold text-gray-900 ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm font-medium text-gray-400">
              ({product.reviewCount} Reviews)
            </span>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-sm font-medium text-gray-500">
              {product.soldCount} sold
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-900 text-gray-900 tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xl font-medium text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.shortDesc || product.description}
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900">Quantity</span>
              <span className={`text-sm font-bold ${inventory > 0 && product.inStock ? "text-green-600" : "text-red-500"}`}>
                {inventory > 0 && product.inStock ? `${inventory} in stock` : "Out of Stock"}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl w-full sm:w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(inventory, quantity + 1))}
                  className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                  disabled={quantity >= inventory || !product.inStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || inventory <= 0}
                className="flex-1 bg-primary text-white font-bold text-lg rounded-xl h-12 flex items-center justify-center gap-2 hover:bg-secondary active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              
              <button className="w-12 h-12 flex-shrink-0 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span>100% Quality Guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-blue-500" />
              <span>Next Day Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Reviews Matrix */}
      <div className="border-t border-gray-100 pt-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-800 text-gray-900 mb-6">Product Description</h2>
            <div className="prose prose-gray max-w-none text-gray-600 mb-16">
              {product.description.split('\n').map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <h2 className="text-2xl font-800 text-gray-900 mb-8">Customer Reviews</h2>
            {product.reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="flex flex-col gap-8">
                {product.reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{review.user.name}</h4>
                      <span className="text-sm text-gray-400">{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex gap-1 text-yellow-400 mb-3">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-current" : "text-gray-200"}`} />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Specifications Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Specifications</h3>
              <dl className="flex flex-col gap-4">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <dt className="text-gray-500 text-sm">Brand</dt>
                  <dd className="font-semibold text-gray-900 text-sm">{product.brand?.name || "FreshMart"}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <dt className="text-gray-500 text-sm">Unit</dt>
                  <dd className="font-semibold text-gray-900 text-sm uppercase">{product.unit}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <dt className="text-gray-500 text-sm">SKU</dt>
                  <dd className="font-semibold text-gray-900 text-sm">{product.id.slice(0,8).toUpperCase()}</dd>
                </div>
                {product.specifications && Object.entries(product.specifications as object).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-200 pb-2">
                    <dt className="text-gray-500 text-sm capitalize">{key}</dt>
                    <dd className="font-semibold text-gray-900 text-sm">{value as string}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
