import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
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
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Check user session and review eligibility
  const session = await auth();
  const userId = session?.user ? (session.user as any).id : null;
  let canReview = false;
  let existingReview = null;

  if (userId) {
    const purchaseCount = await prisma.orderItem.count({
      where: {
        productId: product.id,
        order: { userId, status: "DELIVERED" }
      }
    });
    if (purchaseCount > 0) {
      canReview = true;
      existingReview = await prisma.review.findUnique({
        where: { userId_productId: { userId, productId: product.id } }
      });
    }
  }

  // Fetch per-star rating breakdown
  const ratingGroups = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId: product.id, status: "APPROVED" },
    _count: { id: true },
  });
  const ratingBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const g of ratingGroups) {
    ratingBreakdown[g.rating] = g._count.id;
  }

  // Get related products from same category (newest first)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailView 
        product={product} 
        relatedProducts={relatedProducts}
        canReview={canReview}
        existingReview={existingReview}
        currentUser={session?.user || null}
        ratingBreakdown={ratingBreakdown}
      />
    </div>
  );
}
