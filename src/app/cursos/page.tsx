import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import CoursesCatalogClient from './CoursesCatalogClient';

export const metadata: Metadata = {
  title: 'Catálogo de Cursos',
  description: 'Explore nosso catálogo completo de cursos práticos de desenvolvimento web, engenharia de software e arquitetura de sistemas.',
  alternates: {
    canonical: '/cursos',
  },
  openGraph: {
    title: 'Catálogo de Cursos | Veltro LMS',
    description: 'Explore nosso catálogo completo de cursos práticos de desenvolvimento web e arquitetura.',
    url: `${SITE_URL}/cursos`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo de Cursos | Veltro LMS',
    description: 'Explore nosso catálogo completo de cursos práticos de desenvolvimento web e arquitetura.',
  },
};

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Cursos',
      item: `${SITE_URL}/cursos`,
    },
  ],
};

export default function CoursesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <CoursesCatalogClient />
    </>
  );
}
