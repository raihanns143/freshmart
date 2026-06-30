import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/shop/CategoryPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} – Fresh Groceries`,
    description: `Shop fresh ${name.toLowerCase()} at FreshMart. Quality guaranteed with fast delivery.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPageContent slug={slug} />;
}
