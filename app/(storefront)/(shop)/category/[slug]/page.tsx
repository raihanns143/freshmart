import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CategoryPageContent } from "@/components/shop/CategoryPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!category) return { title: "Category Not Found | FreshMart" };

  return {
    title: `${category.name} – Fresh Groceries`,
    description:
      category.description ||
      `Shop fresh ${category.name.toLowerCase()} at FreshMart. Quality guaranteed with fast delivery.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
    },
  });

  if (!category) {
    notFound();
  }

  return <CategoryPageContent category={category} />;
}
