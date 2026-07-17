import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BrandsManager } from "@/components/admin/brands/BrandsManager";

export const metadata: Metadata = { title: "Brands" };
export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return <BrandsManager initialBrands={brands} />;
}
