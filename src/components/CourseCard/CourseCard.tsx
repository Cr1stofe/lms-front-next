'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/lib/types';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './CourseCard.module.scss';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const role = useAuthStore((state) => state.role);

  return (
    <Link href={`/cursos/${course.slug}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badgeIndigo}>
          <BookOpen size={12} /> {course.lessons} aulas
        </span>
        <span className={styles.badgeDefault}>
          <Clock size={12} /> {course.hours} horas
        </span>
      </div>

      <h3 className={styles.title}>{course.title}</h3>
      <p className={styles.description}>{course.description}</p>

      <div className={styles.footer}>
        <span className={styles.statusText}>
          {role === 'user' ? 'Disponível' : 'Acesso Liberado'}
        </span>

        <span className={styles.accessBtn}>
          <span>{role === 'user' ? 'Acessar Curso' : 'Ver Curso'}</span>
          <ArrowRight size={14} className={styles.accessIcon} />
        </span>
      </div>
    </Link>
  );
}
