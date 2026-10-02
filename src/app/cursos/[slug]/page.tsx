import type { Metadata } from 'next';
import { BACKEND_URL, SITE_URL } from '@/lib/config';
import { CourseDetailsResponse } from '@/lib/types';
import CourseDetailClient from './CourseDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchCourseData(slug: string): Promise<CourseDetailsResponse | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/lms/course/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error(`Erro ao carregar metadados do curso ${slug}`, e);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchCourseData(slug);

  if (!data?.course) {
    return {
      title: 'Curso não encontrado',
      description: 'O curso solicitado não foi encontrado ou foi removido.',
    };
  }

  const course = data.course;
  const title = `${course.title} | Veltro LMS`;
  const description = course.description || `Aprenda ${course.title} com ${course.hours} horas de conteúdo prático e certificado.`;
  const url = `${SITE_URL}/cursos/${course.slug}`;

  return {
    title: course.title,
    description,
    alternates: {
      canonical: `/cursos/${course.slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Veltro LMS',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchCourseData(slug);
  const course = data?.course;
  const lessons = data?.lessons || [];

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
      {
        '@type': 'ListItem',
        position: 3,
        name: course?.title || slug,
        item: `${SITE_URL}/cursos/${slug}`,
      },
    ],
  };

  const jsonLdCourse = course
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Veltro LMS',
          url: SITE_URL,
        },
        timeRequired: `PT${course.hours || 1}H`,
        educationalCredentialAwarded: 'Certificado de Conclusão Veltro LMS',
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: `PT${course.hours || 1}H`,
        },
        numberOfLessons: lessons.length,
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdCourse && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCourse) }}
        />
      )}
      <CourseDetailClient slug={slug} />
    </>
  );
}
