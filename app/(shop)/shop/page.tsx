import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ui/product-card";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop All Products | FreshMart",
  description: "Browse our complete catalog of fresh groceries.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "newest";

  // Build where clause
  const where: any = {};
  if (category) {
    where.category = { slug: category };
  }

  // Build orderBy
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };

  // Fetch from DB
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-gray-100">
        <div className="section-container py-8">
          <h1 className="text-3xl font-800 text-gray-900">Shop All Products</h1>
          <p className="text-gray-500 mt-1">Discover our full range of fresh groceries</p>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 font-bold text-gray-900 border-b border-gray-100 pb-4">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                Filters
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link 
                    href="/shop" 
                    className={`text-sm ${!category ? 'font-bold text-primary' : 'text-gray-600 hover:text-primary'}`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/shop?category=${cat.slug}`} 
                      className={`text-sm ${category === cat.slug ? 'font-bold text-primary' : 'text-gray-600 hover:text-primary'}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Showing <span className="font-bold text-gray-900">{products.length}</span> products
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Link href={`/shop?sort=newest${category ? `&category=${category}` : ''}`} className={`text-sm px-2 ${sort === 'newest' ? 'font-bold text-primary' : 'text-gray-600'}`}>Newest</Link>
                <Link href={`/shop?sort=price_asc${category ? `&category=${category}` : ''}`} className={`text-sm px-2 ${sort === 'price_asc' ? 'font-bold text-primary' : 'text-gray-600'}`}>Price: Low</Link>
                <Link href={`/shop?sort=price_desc${category ? `&category=${category}` : ''}`} className={`text-sm px-2 ${sort === 'price_desc' ? 'font-bold text-primary' : 'text-gray-600'}`}>Price: High</Link>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
