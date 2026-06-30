import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsManager } from "@/components/admin/products/ProductsManager";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (sp.category) where.categoryId = sp.category;
  if (sp.status) {
    if (sp.status === "ACTIVE") where.isActive = true;
    if (sp.status === "DRAFT") where.isActive = false;
  }
  if (sp.search) {
    where.OR = [
      { name: { contains: sp.search, mode: "insensitive" } },
      { sku: { contains: sp.search, mode: "insensitive" } },
    ];
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        variants: true,
        images: { where: { isMain: true }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <ProductsManager
      products={products as any}
      total={total}
      page={page}
      pageSize={pageSize}
      search={sp.search}
      category={sp.category}
      status={sp.status}
      categories={categories}
    />
  );
}
