import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settingsRecords = await prisma.setting.findMany({
    where: {
      key: { in: ["SEO_BRANDS_TITLE", "SEO_BRANDS_DESCRIPTION", "SITE_NAME"] },
    },
  });
  
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  return {
    title: settings.SEO_BRANDS_TITLE || `Brands | ${settings.SITE_NAME || "FreshMart"}`,
    description: settings.SEO_BRANDS_DESCRIPTION || "Shop from your favorite brands",
  };
}

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-16">
      <div className="section-container">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Our Brands
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover fresh and high-quality products from top local and international brands.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform">
                {brand.logo ? (
                  <Image src={brand.logo} alt={brand.name} fill className="object-contain p-2" unoptimized />
                ) : (
                  <span className="text-3xl font-bold text-gray-300">
                    {brand.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {brand._count.products} Products
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {brands.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
            No brands found.
          </div>
        )}
      </div>
    </div>
  );
}
