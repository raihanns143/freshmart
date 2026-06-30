import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/categories/CategoriesManager";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { products: true, children: true } },
    },
  });

  return <CategoriesManager initialCategories={categories as any} />;
}
