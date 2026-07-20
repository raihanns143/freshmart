import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://raihans.shop';

  // Fetch all active products
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Fetch all categories
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch all brands
  const brands = await prisma.brand.findMany({
    select: { slug: true, updatedAt: true },
  });

  const brandUrls = brands.map((brand) => ({
    url: `${baseUrl}/brand/${brand.slug}`,
    lastModified: brand.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ];

  return [...staticRoutes, ...productUrls, ...categoryUrls, ...brandUrls];
}
