import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | FreshMart`,
    description: product.shortDesc || product.description,
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
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
      inventory: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!product) {
    notFound();
  }

  // Calculate real-time inventory count
  const currentInventory = product.inventory[0]?.quantity || 0;

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailView product={product} inventory={currentInventory} />
    </div>
  );
}
