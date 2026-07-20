import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/dashboard/', 
        '/api/', 
        '/auth/', 
        '/private/',
        '/cart/',
        '/checkout/',
        '/login/',
        '/register/',
        '/account/',
        '/order-success/'
      ],
    },
    sitemap: 'https://raihans.shop/sitemap.xml',
  };
}
