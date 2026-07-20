import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) return { title: "Brand Not Found | Raihans Shop" };
  
  const title = `${brand.name} | Raihans Shop`;
  const description = `Shop products from ${brand.name} at Raihans Shop. Genuine products with fast delivery across Bangladesh.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://raihans.shop/brand/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://raihans.shop/brand/${slug}`,
      images: brand.logo ? [{ url: brand.logo }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: brand.logo ? [brand.logo] : undefined,
    }
  };
}

export const dynamic = "force-dynamic";

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: {
            select: { id: true, url: true, alt: true, isMain: true, order: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!brand) return notFound();

  // Transform products for the ProductCard component
  const products = brand.products.map((p) => ({
    ...p,
    brand: null, // ProductCard expects this, we can pass null since it's already under the brand
    stock: p.stock > 0 ? p.stock : p.inStock ? 50 : 0,
    tags: [],
    specifications: [],
  })) as any[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": brand.name,
    "url": `https://raihans.shop/brand/${brand.slug}`,
    ...(brand.logo && { "logo": brand.logo })
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="section-container">
        {/* Brand Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-50 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0">
            {brand.logo ? (
              <Image src={brand.logo} alt={brand.name} fill className="object-contain p-4" unoptimized />
            ) : (
              <span className="text-5xl font-bold text-gray-300">
                {brand.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              {brand.name}
            </h1>
            <p className="text-gray-500 text-lg">
              Explore {products.length} {products.length === 1 ? 'product' : 'products'} from {brand.name}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
            No products available for this brand yet.
          </div>
        )}
      </div>
    </div>
  );
}
