'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { lmsService } from '@/services/lmsService';
import { useAuthStore } from '@/stores/useAuthStore';
import VideoPlayer from '@/components/VideoPlayer';
import { secToMin } from '@/lib/utils';
import { resolveVideoUrl } from '@/lib/api-client';
import { Lesson } from '@/lib/types';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface LessonPageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export default function LessonPlayerPage({ params }: LessonPageProps) {
  const { courseSlug, lessonSlug } = use(params);
  const role = useAuthStore((state) => state.role);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);

  const loadLesson = useCallback(async () => {
    setLoading(true);
    const data = await lmsService.getLessonBySlugs(courseSlug, lessonSlug);
    if (data) {
      setLesson(data);
      setCompleted(Boolean(data.completed));
    }
    setLoading(false);
  }, [courseSlug, lessonSlug]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  if (loading) {
    return (
      <div className="glass-card text-center animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#818cf8' }} />
        <p>Carregando aula...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="glass-card text-center animate-fade-in" style={{ padding: '3.5rem 1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Aula não encontrada</h2>
        <p style={{ marginBottom: '2rem' }}>A aula requisitada não foi localizada.</p>
        <Link href={`/cursos/${courseSlug}`} className="btn btn-primary">
          <ArrowLeft size={16} /> Voltar para o Curso
        </Link>
      </div>
    );
  }

  const handleComplete = async () => {
    const courseId = lesson.course_id || lesson.courseId;
    if (!courseId || completed) return;
    setCompleting(true);
    const success = await lmsService.completeLesson(courseId, lesson.id);
    if (success) {
      setCompleted(true);
    }
    setCompleting(false);
  };

  const videoUrl = resolveVideoUrl(lesson.video);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link href="/cursos">Cursos</Link>
        <ChevronRight size={14} />
        <Link href={`/cursos/${courseSlug}`}>{courseSlug}</Link>
        <ChevronRight size={14} />
        <span style={{ color: '#ffffff' }}>{lesson.title}</span>
      </nav>

      {/* Lesson Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
        <div>
          <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>
            Aula {lesson.order} • {secToMin(lesson.seconds)}
          </span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', textAlign: 'left' }}>{lesson.title}</h1>
        </div>

        {completed && (
          <span className="badge badge-emerald" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            <CheckCircle2 size={15} /> Aula Concluída
          </span>
        )}
      </div>

      {/* Video Player */}
      <VideoPlayer src={videoUrl} title={lesson.title} />

      {/* Navigation & Completion Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-start' }}>
          {lesson.prev ? (
            <Link href={`/aula/${courseSlug}/${lesson.prev}`} className="btn btn-sm" style={{ width: '100%', maxWidth: 160 }}>
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </Link>
          ) : (
            <div style={{ width: 80 }} />
          )}
        </div>

        <div style={{ flex: '2 1 auto', display: 'flex', justifyContent: 'center' }}>
          {role === 'user' && (
            <button
              onClick={handleComplete}
              disabled={completing || completed}
              className={`btn ${completed ? 'btn-emerald' : 'btn-primary'}`}
              style={{ width: '100%', maxWidth: 240 }}
            >
              <CheckCircle2 size={18} />
              <span>{completed ? 'Concluída ✓' : completing ? 'Salvando...' : 'Completar Aula'}</span>
            </button>
          )}
        </div>

        <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end' }}>
          {lesson.next ? (
            <Link href={`/aula/${courseSlug}/${lesson.next}`} className="btn btn-sm btn-primary" style={{ width: '100%', maxWidth: 160 }}>
              <span>Próxima</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <Link href={`/cursos/${courseSlug}`} className="btn btn-sm" style={{ width: '100%', maxWidth: 160 }}>
              <span>Ver Grade</span>
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Lesson Description */}
      {lesson.description && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Sobre esta aula</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            {lesson.description}
          </p>
        </div>
      )}
    </div>
  );
}
