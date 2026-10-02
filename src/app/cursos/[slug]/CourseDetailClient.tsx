'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { lmsService } from '@/services/lmsService';
import { useAuthStore } from '@/stores/useAuthStore';
import { secToMin } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';
import { Course, Lesson, CompletedLesson } from '@/lib/types';
import { toast } from 'sonner';
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
  AlertTriangle,
} from 'lucide-react';
import styles from './course-detail.module.scss';
import { API_BASE } from '@/lib/api-client';

interface CourseDetailClientProps {
  slug: string;
}

export default function CourseDetailClient({ slug }: CourseDetailClientProps) {
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = role === 'user' || role === 'admin' || role === 'editor';

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState<CompletedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [certificateId, setCertificateId] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          style={{ margin: '0 auto 1rem', color: '#2563eb' }}
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

  const handleResetConfirm = async () => {
    if (!course) return;
    try {
      setIsResetting(true);
      const ok = await lmsService.resetCourseProgress(course.id);
      if (ok) {
        toast.success('Progresso do curso reiniciado com sucesso!');
        setShowResetModal(false);
        await loadCourseData();
      } else {
        toast.error('Não foi possível reiniciar o progresso.');
      }
    } catch {
      toast.error('Erro ao reiniciar o progresso.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className={`animate-fade-in ${styles.container}`}>
        <nav className={styles.breadcrumb}>
          <Link href="/cursos">Cursos</Link>
          <ChevronRight size={14} />
          <span className={styles.current}>{course.title}</span>
        </nav>

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
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className={styles.resetBtn}
                  >
                    <RotateCcw size={12} /> Reiniciar Progresso
                  </button>
                )}
              </div>
            </div>
          )}

          <div className={styles.actionsRow}>
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
                    <Play size={18} />
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
                  <LogIn size={18} />
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
                  <UserPlus size={18} />
                  <span>Criar Conta Grátis</span>
                </Link>
              </>
            )}
          </div>
        </div>

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

      {mounted && showResetModal && createPortal(
        <div
          className={styles.modalOverlay}
          onClick={() => !isResetting && setShowResetModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIconWrapper}>
              <AlertTriangle size={28} />
            </div>

            <h3 id="reset-modal-title" className={styles.modalTitle}>
              Reiniciar progresso?
            </h3>
            <p className={styles.modalDescription}>
              Você está prestes a resetar o progresso de todas as aulas concluídas deste curso. Essa ação não poderá ser desfeita.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancelBtn}
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.modalConfirmBtn}
                onClick={handleResetConfirm}
                disabled={isResetting}
              >
                {isResetting ? 'Reiniciando...' : 'Sim, Reiniciar Progresso'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
