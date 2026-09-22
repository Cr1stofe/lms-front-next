'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { lmsService } from '@/services/lmsService';
import { useAuthStore } from '@/stores/useAuthStore';
import { secToMin } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';
import { Course, Lesson, CompletedLesson } from '@/lib/types';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface CourseDetailsProps {
  params: Promise<{ slug: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailsProps) {
  const { slug } = use(params);
  const role = useAuthStore((state) => state.role);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState<CompletedLesson[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourseData = useCallback(async () => {
    setLoading(true);
    const data = await lmsService.getCourseBySlug(slug);
    if (data) {
      setCourse(data.course);
      setLessons(data.lessons || []);
      setCompleted(data.completed || []);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  if (loading) {
    return (
      <div className="glass-card text-center animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#818cf8' }} />
        <p>Carregando curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="glass-card text-center animate-fade-in" style={{ padding: '3.5rem 1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Curso não encontrado</h2>
        <p style={{ marginBottom: '2rem' }}>O curso com identificador &quot;{slug}&quot; não existe ou foi removido.</p>
        <Link href="/cursos" className="btn btn-primary">
          <ArrowLeft size={16} /> Voltar para o Catálogo
        </Link>
      </div>
    );
  }

  const completedCount = completed.length;
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const isCompleted = progress >= 100;
  const firstUncompletedLesson = lessons.find((l) => !completed.some((c) => c.lesson_id == l.id || c.lessonId == l.id)) || lessons[0];

  const handleReset = async () => {
    if (confirm('Tem certeza que deseja reiniciar o progresso deste curso?')) {
      const ok = await lmsService.resetCourseProgress(course.id);
      if (ok) {
        await loadCourseData();
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Breadcrumbs */}
      <nav className="breadcrumb">
        <Link href="/cursos">Cursos</Link>
        <ChevronRight size={14} />
        <span style={{ color: '#ffffff' }}>{course.title}</span>
      </nav>

      {/* Course Hero Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className="badge badge-indigo">
            <BookOpen size={12} /> {lessons.length} aulas
          </span>
          <span className="badge">
            <Clock size={12} /> {course.hours} horas
          </span>
          {isCompleted && (
            <span className="badge badge-emerald">
              <CheckCircle2 size={12} /> 100% Concluído
            </span>
          )}
        </div>

        <h1 style={{ marginBottom: '0.75rem', textAlign: 'left' }}>{course.title}</h1>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '720px', marginBottom: '1.75rem' }}>
          {course.description}
        </p>

        {role === 'user' && (
          <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <ProgressBar progress={progress} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {completedCount} de {lessons.length} aulas completadas
              </span>
              {completedCount > 0 && (
                <button
                  onClick={handleReset}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <RotateCcw size={12} /> Reiniciar Progresso
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {firstUncompletedLesson && (
            <Link
              href={`/aula/${course.slug}/${firstUncompletedLesson.slug}`}
              className="btn btn-primary btn-lg"
              style={{ width: 'auto' }}
            >
              <Play size={18} />
              <span>{progress > 0 && !isCompleted ? 'Continuar de Onde Parou' : 'Iniciar Curso'}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Curriculum / Lessons List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2>Grade Curricular</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lessons.length} aulas</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {lessons.map((lesson, idx) => {
            const isLessonDone = completed.some((x) => x.lesson_id == lesson.id || x.lessonId == lesson.id);

            return (
              <Link
                key={lesson.id}
                href={`/aula/${course.slug}/${lesson.slug}`}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: isLessonDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: isLessonDone ? '#34d399' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {isLessonDone ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.15rem', color: isLessonDone ? 'var(--text-secondary)' : '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lesson.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {secToMin(lesson.seconds)}
                  </span>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
