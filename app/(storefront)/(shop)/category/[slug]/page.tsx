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
    select: { name: true, description: true, image: true },
  });

  if (!category) return { title: "Category Not Found | Raihans Shop" };

  const title = `${category.name} | Raihans Shop`;
  const description = category.description || `Shop fresh ${category.name.toLowerCase()} online at Raihans Shop. Fast delivery and Cash on Delivery available across Bangladesh.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://raihans.shop/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://raihans.shop/category/${slug}`,
      images: category.image ? [{ url: category.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: category.image ? [category.image] : undefined,
    }
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description || `Collection of ${category.name}`,
    "url": `https://raihans.shop/category/${category.slug}`,
    ...(category.image && { "image": category.image })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryPageContent category={category} />
    </>
  );
}
