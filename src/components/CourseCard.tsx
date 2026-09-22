'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/lib/types';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const role = useAuthStore((state) => state.role);

  return (
    <div className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span className="badge badge-indigo">
          <BookOpen size={12} /> {course.lessons} aulas
        </span>
        <span className="badge">
          <Clock size={12} /> {course.hours} horas
        </span>
      </div>

      <h3 style={{ marginBottom: '0.75rem', fontSize: '1.35rem' }}>{course.title}</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.5 }}>
        {course.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {role === 'user' ? 'Disponível' : 'Acesso Liberado'}
        </span>

        <Link
          href={`/cursos/${course.slug}`}
          className="btn btn-sm btn-primary"
        >
          <span>{role === 'user' ? 'Acessar Curso' : 'Ver Curso'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
