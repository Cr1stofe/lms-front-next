import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/cursos', '/cursos/*', '/login', '/criar-conta'],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/certificados',
          '/certificados/*',
          '/perdeu-senha',
          '/resetar-senha',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
