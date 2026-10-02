import type { Metadata } from 'next';
import { BACKEND_URL, SITE_URL } from '@/lib/config';
import { Lesson } from '@/lib/types';
import LessonPlayerClient from './LessonPlayerClient';

interface Props {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

async function fetchLessonData(courseSlug: string, lessonSlug: string): Promise<Lesson | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/lms/lesson/${courseSlug}/${lessonSlug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error(`Erro ao carregar metadados da aula ${courseSlug}/${lessonSlug}`, e);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await fetchLessonData(courseSlug, lessonSlug);

  if (!lesson) {
    return {
      title: 'Aula não encontrada',
      description: 'A aula requisitada não foi localizada.',
      robots: { index: false, follow: false },
    };
  }

  const courseTitle = lesson.course_title || courseSlug;
  const isFree = Boolean(lesson.free) && lesson.free !== 0;

  return {
    title: `${lesson.title} - ${courseTitle}`,
    description: lesson.description || `Assista à aula ${lesson.title} do curso ${courseTitle} na Veltro LMS.`,
    alternates: {
      canonical: `/aula/${courseSlug}/${lessonSlug}`,
    },
    robots: {
      index: isFree,
      follow: true,
    },
    openGraph: {
      title: `${lesson.title} | ${courseTitle} - Veltro LMS`,
      description: lesson.description || `Aula ${lesson.order} do curso ${courseTitle}.`,
      url: `${SITE_URL}/aula/${courseSlug}/${lessonSlug}`,
      type: 'video.other',
    },
  };
}

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await fetchLessonData(courseSlug, lessonSlug);
  const courseTitle = lesson?.course_title || courseSlug;
  const effectiveCourseSlug = lesson?.course_slug || courseSlug;

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
        name: courseTitle,
        item: `${SITE_URL}/cursos/${effectiveCourseSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: lesson?.title || lessonSlug,
        item: `${SITE_URL}/aula/${courseSlug}/${lessonSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <LessonPlayerClient courseSlug={courseSlug} lessonSlug={lessonSlug} />
    </>
  );
}
