import { MetadataRoute } from 'next';
import { SITE_URL, BACKEND_URL } from '@/lib/config';
import { Course } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/cursos`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/criar-conta`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  let courseRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${BACKEND_URL}/lms/courses`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const courses: Course[] = await res.json();
      if (Array.isArray(courses)) {
        courseRoutes = courses.map((course) => ({
          url: `${SITE_URL}/cursos/${course.slug}`,
          lastModified: currentDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
      }
    }
  } catch {
    // Fallback to static routes if backend is unavailable during build
  }

  return [...staticRoutes, ...courseRoutes];
}
