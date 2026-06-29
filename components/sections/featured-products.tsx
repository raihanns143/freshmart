import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { Product } from "@/types";

// Static demo products — shown when DB is unavailable or empty
const DEMO_PRODUCTS: Product[] = [
  { id:"1", name:"Organic Bananas", slug:"organic-bananas", description:"Fresh organic bananas", shortDesc:"Sweet & organic", categoryId:"1", category:{ id:"1", name:"Fresh Fruits", slug:"fresh-fruits", description:null, image:null, color:"#22c55e", icon:"🍎", itemCount:24, parentId:null }, brandId:null, brand:null, price:1.99, originalPrice:2.49, discount:20, stock:50, inStock:true, unit:"bunch", images:[{ id:"1", url:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=70", alt:"Organic Bananas", isMain:true, order:0 }], badge:"Organic", badgeColor:"green", tags:[], isFeatured:true, isActive:true, rating:4.8, reviewCount:124, viewCount:980, soldCount:430, specifications:[], createdAt:new Date(), updatedAt:new Date() },
  { id:"2", name:"Fresh Whole Milk 1L", slug:"fresh-milk", description:"Farm-fresh whole milk", shortDesc:"Creamy whole milk", categoryId:"2", category:{ id:"2", name:"Dairy & Eggs", slug:"dairy-eggs", description:null, image:null, color:"#3b82f6", icon:"🥛", itemCount:18, parentId:null }, brandId:null, brand:null, price:1.49, originalPrice:null, discount:null, stock:80, inStock:true, unit:"litre", images:[{ id:"2", url:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=70", alt:"Fresh Milk", isMain:true, order:0 }], badge:"Fresh", badgeColor:"blue", tags:[], isFeatured:true, isActive:true, rating:4.6, reviewCount:87, viewCount:640, soldCount:310, specifications:[], createdAt:new Date(), updatedAt:new Date() },
  { id:"3", name:"Sourdough Bread", slug:"sourdough-bread", description:"Artisan sourdough loaf", shortDesc:"Artisan baked", categoryId:"3", category:{ id:"3", name:"Bakery", slug:"bakery", description:null, image:null, color:"#f59e0b", icon:"🍞", itemCount:12, parentId:null }, brandId:null, brand:null, price:3.99, originalPrice:4.99, discount:20, stock:20, inStock:true, unit:"loaf", images:[{ id:"3", url:"https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=70", alt:"Sourdough Bread", isMain:true, order:0 }], badge:"Sale", badgeColor:"red", tags:[], isFeatured:true, isActive:true, rating:4.9, reviewCount:203, viewCount:1200, soldCount:560, specifications:[], createdAt:new Date(), updatedAt:new Date() },
  { id:"4", name:"Free Range Eggs (12)", slug:"free-range-eggs", description:"Free range farm eggs", shortDesc:"Cage-free eggs", categoryId:"2", category:{ id:"2", name:"Dairy & Eggs", slug:"dairy-eggs", description:null, image:null, color:"#3b82f6", icon:"🥛", itemCount:18, parentId:null }, brandId:null, brand:null, price:4.49, originalPrice:null, discount:null, stock:60, inStock:true, unit:"dozen", images:[{ id:"4", url:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70", alt:"Free Range Eggs", isMain:true, order:0 }], badge:"Fresh", badgeColor:"blue", tags:[], isFeatured:true, isActive:true, rating:4.7, reviewCount:156, viewCount:870, soldCount:420, specifications:[], createdAt:new Date(), updatedAt:new Date() },
  { id:"5", name:"Cherry Tomatoes", slug:"cherry-tomatoes", description:"Sweet cherry tomatoes", shortDesc:"Garden fresh", categoryId:"4", category:{ id:"4", name:"Vegetables", slug:"vegetables", description:null, image:null, color:"#ef4444", icon:"🥦", itemCount:30, parentId:null }, brandId:null, brand:null, price:2.99, originalPrice:null, discount:null, stock:45, inStock:true, unit:"punnet", images:[{ id:"5", url:"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=70", alt:"Cherry Tomatoes", isMain:true, order:0 }], badge:null, badgeColor:null, tags:[], isFeatured:true, isActive:true, rating:4.5, reviewCount:93, viewCount:520, soldCount:280, specifications:[], createdAt:new Date(), updatedAt:new Date() },
  { id:"6", name:"Greek Yogurt 500g", slug:"greek-yogurt", description:"Thick creamy Greek yogurt", shortDesc:"High protein", categoryId:"2", category:{ id:"2", name:"Dairy & Eggs", slug:"dairy-eggs", description:null, image:null, color:"#3b82f6", icon:"🥛", itemCount:18, parentId:null }, brandId:null, brand:null, price:2.79, originalPrice:3.49, discount:20, stock:35, inStock:true, unit:"tub", images:[{ id:"6", url:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=70", alt:"Greek Yogurt", isMain:true, order:0 }], badge:"Sale", badgeColor:"red", tags:[], isFeatured:true, isActive:true, rating:4.8, reviewCount:178, viewCount:760, soldCount:340, specifications:[], createdAt:new Date(), updatedAt:new Date() },
  { id:"7", name:"Avocados 4 Pack", slug:"avocados", description:"Perfectly ripe avocados", shortDesc:"Ready to eat", categoryId:"1", category:{ id:"1", name:"Fresh Fruits", slug:"fresh-fruits", description:null, image:null, color:"#22c55e", icon:"🍎", itemCount:24, parentId:null }, brandId:null, brand:null, price:3.49, originalPrice:null, discount:null, stock:25, inStock:true, unit:"pack", images:[{ id:"7", url:"https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400&q=70", alt:"Avocados", isMain:true, order:0 }], badge:"Organic", badgeColor:"green", tags:[], isFeatured:true, isActive:true, rating:4.6, reviewCount:211, viewCount:1050, soldCount:490, specifications:[], createdAt:new Date(), updatedAt:new Date() },
  { id:"8", name:"Chicken Breast 500g", slug:"chicken-breast", description:"Premium chicken breast", shortDesc:"Lean protein", categoryId:"5", category:{ id:"5", name:"Meat & Seafood", slug:"meat-seafood", description:null, image:null, color:"#8b5cf6", icon:"🥩", itemCount:15, parentId:null }, brandId:null, brand:null, price:5.99, originalPrice:7.49, discount:20, stock:40, inStock:true, unit:"pack", images:[{ id:"8", url:"https://images.unsplash.com/photo-1604503468506-a8da13d11b36?w=400&q=70", alt:"Chicken Breast", isMain:true, order:0 }], badge:"Sale", badgeColor:"red", tags:[], isFeatured:true, isActive:true, rating:4.7, reviewCount:142, viewCount:890, soldCount:380, specifications:[], createdAt:new Date(), updatedAt:new Date() },
];

async function getProducts(): Promise<Product[]> {
  try {
    // Dynamically import prisma to avoid build-time crashes when DB is unavailable
    const { default: prisma } = await import("@/lib/prisma");
    const rows = await prisma.product.findMany({
      take: 8,
      where: { isActive: true },
      orderBy: { rating: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true, description: true, image: true, color: true, icon: true, itemCount: true, parentId: true } },
        images: { select: { id: true, url: true, alt: true, isMain: true, order: true }, orderBy: { order: "asc" } },
      },
    });

    if (rows.length === 0) return DEMO_PRODUCTS;

    // Normalise DB rows to match Product type (tags is a plain string in SQLite)
    return rows.map((p) => ({
      ...p,
      brand: null,
      brandId: null,
      stock: p.inStock ? 50 : 0,
      tags: [],
      specifications: [],
    })) as unknown as Product[];
  } catch {
    // DB not reachable — fall back to demo data
    return DEMO_PRODUCTS;
  }
}

export async function FeaturedProducts() {
  const products = await getProducts();

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-800 text-gray-900 tracking-tight text-center sm:text-left">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2 font-medium text-center sm:text-left">
              Handpicked fresh arrivals and weekly specials
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 mt-4 sm:mt-0">
            {["All", "Organic", "Best Sellers", "On Sale"].map((filter, i) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  i === 0
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="group flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
