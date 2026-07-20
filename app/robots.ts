import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/api/', '/auth/', '/private/'],
    },
    sitemap: 'https://raihans.shop/sitemap.xml',
  };
}
