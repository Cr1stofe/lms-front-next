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
  Award,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import styles from './course-detail.module.scss';
import { API_BASE } from '@/lib/api-client';

interface CourseDetailsProps {
  params: Promise<{ slug: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailsProps) {
  const { slug } = use(params);
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = role === 'user' || role === 'admin' || role === 'editor';

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState<CompletedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [certificateId, setCertificateId] = useState<string>('');

  const loadCourseData = useCallback(async () => {
    setLoading(true);
    const data = await lmsService.getCourseBySlug(slug);
    if (data) {
      setCourse(data.course);
      setLessons(data.lessons || []);
      setCompleted(data.completed || []);
      setCertificateId(data.certificate || '');
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

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
        <p>Carregando curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="glass-card text-center animate-fade-in"
        style={{ padding: '3.5rem 1.5rem' }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Curso não encontrado</h2>
        <p style={{ marginBottom: '2rem' }}>
          O curso com identificador &quot;{slug}&quot; não existe ou foi
          removido.
        </p>
        <Link href="/cursos" className="btn btn-primary">
          <ArrowLeft size={16} /> Voltar para o Catálogo
        </Link>
      </div>
    );
  }

  const completedCount = completed.length;
  const progress =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;
  const isCompleted = progress >= 100;
  const firstUncompletedLesson =
    lessons.find(
      (l) => !completed.some((c) => c.lesson_id == l.id || c.lessonId == l.id),
    ) || lessons[0];

  const firstFreeLesson = lessons.find(
    (l) => Boolean(l.free) && l.free !== 0,
  );

  const handleReset = async () => {
    if (confirm('Tem certeza que deseja reiniciar o progresso deste curso?')) {
      const ok = await lmsService.resetCourseProgress(course.id);
      if (ok) {
        await loadCourseData();
      }
    }
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumb}>
        <Link href="/cursos">Cursos</Link>
        <ChevronRight size={14} />
        <span className={styles.current}>{course.title}</span>
      </nav>

      {/* Course Hero Card */}
      <div className={styles.heroCard}>
        <div className={styles.badgesRow}>
          <span className={styles.badgeIndigo}>
            <BookOpen size={12} /> {lessons.length} aulas
          </span>
          <span className={styles.badgeDefault}>
            <Clock size={12} /> {course.hours} horas
          </span>
          {isCompleted && (
            <span className={styles.badgeEmerald}>
              <CheckCircle2 size={12} /> 100% Concluído
            </span>
          )}
        </div>

        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.description}>{course.description}</p>

        {role === 'user' && (
          <div className={styles.progressContainer}>
            <ProgressBar progress={progress} />
            <div className={styles.progressMeta}>
              <span style={{ color: 'var(--text-muted)' }}>
                {completedCount} de {lessons.length} aulas completadas
              </span>
              {completedCount > 0 && (
                <button onClick={handleReset} className={styles.resetBtn}>
                  <RotateCcw size={12} /> Reiniciar Progresso
                </button>
              )}
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          {isCompleted ? (
            <>
              {certificateId ? (
                <a
                  href={`${API_BASE}/lms/certificate/${certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.certificateBtn}
                >
                  <Award size={18} />
                  <span>Ver Certificado</span>
                </a>
              ) : (
                <Link href="/certificados" className={styles.certificateBtn}>
                  <Award size={18} />
                  <span>Ver Certificados</span>
                </Link>
              )}
              {lessons[0] && (
                <Link
                  href={`/aula/${course.slug}/${lessons[0].slug}`}
                  className={styles.secondaryBtn}
                >
                  <Play size={16} />
                  <span>Rever Aulas</span>
                </Link>
              )}
            </>
          ) : isAuthenticated ? (
            firstUncompletedLesson && (
              <Link
                href={`/aula/${course.slug}/${firstUncompletedLesson.slug}`}
                className={styles.startBtn}
              >
                <Play size={18} />
                <span>
                  {progress > 0 ? 'Continuar de Onde Parou' : 'Iniciar Curso'}
                </span>
              </Link>
            )
          ) : firstFreeLesson ? (
            <>
              <Link
                href={`/aula/${course.slug}/${firstFreeLesson.slug}`}
                className={styles.startBtn}
              >
                <Play size={18} />
                <span>Assistir Aula Grátis</span>
              </Link>
              <Link
                href={`/login?redirect=/cursos/${course.slug}`}
                className={styles.secondaryBtn}
              >
                <LogIn size={16} />
                <span>Entrar na Plataforma</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/login?redirect=/cursos/${course.slug}`}
                className={styles.startBtn}
              >
                <LogIn size={18} />
                <span>Fazer Login para Assistir</span>
              </Link>
              <Link href="/criar-conta" className={styles.secondaryBtn}>
                <UserPlus size={16} />
                <span>Criar Conta Grátis</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Curriculum / Lessons List */}
      <div>
        <div className={styles.curriculumHeader}>
          <h2>Grade Curricular</h2>
          <span className={styles.curriculumCount}>{lessons.length} aulas</span>
        </div>

        <div className={styles.lessonsList}>
          {lessons.map((lesson, idx) => {
            const isLessonDone = completed.some(
              (x) => x.lesson_id == lesson.id || x.lessonId == lesson.id,
            );
            const isFree = Boolean(lesson.free) && lesson.free !== 0;
            const hasAccess = isAuthenticated || isFree;

            if (hasAccess) {
              return (
                <Link
                  key={lesson.id}
                  href={`/aula/${course.slug}/${lesson.slug}`}
                  className={styles.lessonItem}
                >
                  <div className={styles.lessonLeft}>
                    <div
                      className={`${styles.lessonNumber} ${isLessonDone ? styles.done : ''}`}
                    >
                      {isLessonDone ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>

                    <div className={styles.lessonText}>
                      <h3
                        className={`${styles.lessonTitle} ${isLessonDone ? styles.done : ''}`}
                      >
                        {lesson.title}
                        {!isAuthenticated && isFree && (
                          <span className={styles.freeTag}>Grátis</span>
                        )}
                      </h3>
                      <p className={styles.lessonDesc}>{lesson.description}</p>
                    </div>
                  </div>

                  <div className={styles.lessonRight}>
                    <span className={styles.lessonDuration}>
                      {secToMin(lesson.seconds)}
                    </span>
                    <div className={styles.chevronWrapper}>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            }

            // Non-free lesson for unauthenticated user (Locked)
            return (
              <div
                key={lesson.id}
                className={`${styles.lessonItem} ${styles.locked}`}
                title="Faça login para assistir esta aula"
              >
                <div className={styles.lessonLeft}>
                  <div className={`${styles.lessonNumber} ${styles.locked}`}>
                    <Lock size={14} />
                  </div>

                  <div className={styles.lessonText}>
                    <h3 className={`${styles.lessonTitle} ${styles.locked}`}>
                      {lesson.title}
                      <span className={styles.lockedTag}>Bloqueada</span>
                    </h3>
                    <p className={styles.lessonDesc}>{lesson.description}</p>
                  </div>
                </div>

                <div className={styles.lessonRight}>
                  <span className={styles.lessonDuration}>
                    {secToMin(lesson.seconds)}
                  </span>
                  <div className={`${styles.chevronWrapper} ${styles.locked}`}>
                    <Lock size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

