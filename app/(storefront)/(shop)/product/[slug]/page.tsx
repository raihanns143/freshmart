import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    select: { name: true, shortDesc: true, description: true, metaTitle: true, metaDesc: true, images: { select: { url: true }, take: 1 } },
  });

  if (!product) return { title: "Product Not Found | FreshMart" };

  return {
    title: product.metaTitle || `${product.name} | FreshMart`,
    description: product.metaDesc || product.shortDesc || product.description || "Shop fresh groceries at FreshMart.",
    openGraph: {
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { order: "asc" } },
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } },
        take: 10,
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Get related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    take: 4,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
