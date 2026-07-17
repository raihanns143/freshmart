import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { InventoryManager } from "@/components/admin/inventory/InventoryManager";

export const metadata: Metadata = { title: "Inventory" };
export const dynamic = "force-dynamic";

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; filter?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 30;
  const skip = (page - 1) * pageSize;
  const filter = (sp.filter ?? "all") as "all" | "low" | "out";

  const variantWhere: any = { isActive: true };
  if (filter === "out") variantWhere.stock = 0;
  if (filter === "low") variantWhere.stock = { gt: 0, lte: 10 };

  const productNameFilter = sp.search
    ? { product: { name: { contains: sp.search, mode: "insensitive" as const } } }
    : {};

  const [variants, total, stats] = await Promise.all([
    prisma.productVariant.findMany({
      where: { ...variantWhere, ...productNameFilter },
      skip,
      take: pageSize,
      orderBy: { stock: "asc" },
      include: { product: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.productVariant.count({ where: { ...variantWhere, ...productNameFilter } }),
    Promise.all([
      prisma.productVariant.count({ where: { isActive: true } }),
      prisma.productVariant.count({ where: { isActive: true, stock: 0 } }),
      prisma.productVariant.count({ where: { isActive: true, stock: { gt: 0, lte: 10 } } }),
    ]),
  ]);

  const [totalVariants, outOfStock, lowStock] = stats;

  return (
    <InventoryManager
      variants={variants as any}
      total={total}
      page={page}
      pageSize={pageSize}
      search={sp.search}
      filter={filter}
      stats={{ totalVariants, outOfStock, lowStock }}
    />
  );
}
