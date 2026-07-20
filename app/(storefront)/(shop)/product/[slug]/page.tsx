import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    select: { name: true, shortDesc: true, description: true, metaTitle: true, metaDesc: true, images: { select: { url: true }, take: 1 }, category: { select: { name: true } } },
  });

  if (!product) return { title: "Product Not Found | Raihans Shop" };

  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc || product.description?.substring(0, 160) || `Buy ${product.name} at Raihans Shop.`,
    alternates: {
      canonical: `https://raihans.shop/product/${resolvedParams.slug}`,
    },
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDesc || product.shortDesc || product.description?.substring(0, 160),
      url: `https://raihans.shop/product/${resolvedParams.slug}`,
      type: 'article',
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle || product.name,
      description: product.metaDesc || product.shortDesc || product.description?.substring(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    }
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map(img => img.url),
    "description": product.description || product.shortDesc,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "Raihans Shop"
    },
    "category": product.category?.name,
    "offers": {
      "@type": "Offer",
      "url": `https://raihans.shop/product/${product.slug}`,
      "priceCurrency": "BDT",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Raihans Shop"
      }
    },
    ...(product.reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      },
      "review": product.reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating
        },
        "author": {
          "@type": "Person",
          "name": review.user?.name || "Anonymous"
        },
        "reviewBody": review.comment || ""
      }))
    })
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
