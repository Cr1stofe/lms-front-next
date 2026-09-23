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
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import styles from './lesson.module.scss';

interface LessonPageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export default function LessonPlayerPage({ params }: LessonPageProps) {
  const { courseSlug, lessonSlug } = use(params);
  const role = useAuthStore((state) => state.role);
  const isAuthenticated =
    role === 'user' || role === 'admin' || role === 'editor';

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
      <div
        className="glass-card text-center animate-fade-in"
        style={{ padding: '4rem 1.5rem' }}
      >
        <Loader2
          size={32}
          className="animate-spin"
          style={{ margin: '0 auto 1rem', color: '#818cf8' }}
        />
        <p>Carregando aula...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div
        className="glass-card text-center animate-fade-in"
        style={{ padding: '3.5rem 1.5rem' }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Aula não encontrada</h2>
        <p style={{ marginBottom: '2rem' }}>
          A aula requisitada não foi localizada.
        </p>
        <Link href={`/cursos/${courseSlug}`} className="btn btn-primary">
          <ArrowLeft size={16} /> Voltar para o Curso
        </Link>
      </div>
    );
  }

  const isFree = Boolean(lesson.free) && lesson.free !== 0;
  const hasAccess = isAuthenticated || isFree;

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

  // If user is not authenticated and lesson is NOT free -> Render locked barrier card
  if (!hasAccess) {
    return (
      <div className={`animate-fade-in ${styles.container}`}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb}>
          <Link href="/cursos">Cursos</Link>
          <ChevronRight size={14} />
          <Link href={`/cursos/${courseSlug}`}>{courseSlug}</Link>
          <ChevronRight size={14} />
          <span className={styles.current}>{lesson.title}</span>
        </nav>

        {/* Lesson Header */}
        <div className={styles.headerRow}>
          <div>
            <span className={styles.badgeIndigo}>
              Aula {lesson.order} • {secToMin(lesson.seconds)}
            </span>
            <h1 className={styles.title}>{lesson.title}</h1>
          </div>

          <span className={styles.badgeLocked}>
            <Lock size={14} /> Conteúdo Bloqueado
          </span>
        </div>

        {/* Locked Access Barrier */}
        <div className={styles.lockBarrierCard}>
          <div className={styles.lockIconWrapper}>
            <Lock size={34} />
          </div>

          <h2 className={styles.lockTitle}>Conteúdo Exclusivo para Alunos</h2>
          <p className={styles.lockDescription}>
            A aula <strong>&ldquo;{lesson.title}&rdquo;</strong> é restrita para
            alunos da plataforma. Faça login com sua conta ou crie um cadastro
            gratuito para liberar o acesso imediato e registrar seu progresso.
          </p>

          <div className={styles.lockActions}>
            <Link
              href={`/login?redirect=/aula/${courseSlug}/${lessonSlug}`}
              className="btn btn-primary btn-lg"
            >
              <LogIn size={18} />
              <span>Fazer Login para Assistir</span>
            </Link>

            <Link href="/criar-conta" className="btn btn-lg">
              <UserPlus size={18} />
              <span>Criar Conta Gratuita</span>
            </Link>

            <Link href={`/cursos/${courseSlug}`} className="btn btn-sm">
              <ArrowLeft size={16} />
              <span>Voltar para o Curso</span>
            </Link>
          </div>
        </div>

        {/* Lesson Description */}
        {lesson.description && (
          <div className={styles.aboutCard}>
            <h3 className={styles.aboutTitle}>Sobre esta aula</h3>
            <p className={styles.aboutDescription}>{lesson.description}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb}>
        <Link href="/cursos">Cursos</Link>
        <ChevronRight size={14} />
        <Link href={`/cursos/${courseSlug}`}>{courseSlug}</Link>
        <ChevronRight size={14} />
        <span className={styles.current}>{lesson.title}</span>
      </nav>

      {/* Lesson Header */}
      <div className={styles.headerRow}>
        <div>
          <span className={styles.badgeIndigo}>
            Aula {lesson.order} • {secToMin(lesson.seconds)}
          </span>
          <h1 className={styles.title}>{lesson.title}</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {!isAuthenticated && isFree && (
            <span className={styles.badgeFree}>
              Aula Demonstrativa (Grátis)
            </span>
          )}
          {completed && (
            <span className={styles.badgeEmerald}>
              <CheckCircle2 size={15} /> Aula Concluída
            </span>
          )}
        </div>
      </div>

      {/* Video Player */}
      <VideoPlayer src={videoUrl} title={lesson.title} />

      {/* Navigation & Completion Bar */}
      <div className={styles.controlsCard}>
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          {lesson.prev ? (
            <Link
              href={`/aula/${courseSlug}/${lesson.prev}`}
              className={styles.navBtn}
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </Link>
          ) : (
            <div style={{ width: 80 }} />
          )}
        </div>

        <div
          style={{
            flex: '2 1 auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {role === 'user' && (
            <button
              onClick={handleComplete}
              disabled={completing || completed}
              className={
                completed ? styles.completeBtnDone : styles.completeBtn
              }
            >
              <CheckCircle2 size={18} />
              <span>
                {completed
                  ? 'Concluída ✓'
                  : completing
                    ? 'Salvando...'
                    : 'Completar Aula'}
              </span>
            </button>
          )}
        </div>

        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {lesson.next ? (
            <Link
              href={`/aula/${courseSlug}/${lesson.next}`}
              className={styles.navBtnPrimary}
            >
              <span>Próxima</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <Link
              href={`/cursos/${courseSlug}`}
              className={styles.navBtnPrimary}
            >
              <span>Ver Grade</span>
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Lesson Description */}
      {lesson.description && (
        <div className={styles.aboutCard}>
          <h3 className={styles.aboutTitle}>Sobre esta aula</h3>
          <p className={styles.aboutDescription}>{lesson.description}</p>
        </div>
      )}
    </div>
  );
}
