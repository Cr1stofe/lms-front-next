import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import CourseCard from '@/components/CourseCard';
import { BACKEND_URL } from '@/lib/config';
import { Course } from '@/lib/types';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle,
  Shield,
  PlusCircle,
  Video,
  Users,
} from 'lucide-react';
import styles from './home.module.scss';

async function getFeaturedCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/lms/courses`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.error('Erro ao carregar cursos na home', e);
  }
  return [];
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const role = (cookieStore.get('lms_role')?.value || 'public').toLowerCase();
  const isAdmin = role === 'admin' || role === 'editor';
  const courses = await getFeaturedCourses();

  return (
    <div className={`animate-fade-in ${styles.homeContainer}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          {isAdmin ? (
            <span className={styles.heroBadge}>
              <Shield size={14} /> Painel de Controle Administrativo
            </span>
          ) : (
            <span className={styles.heroBadge}>
              <Sparkles size={14} /> Nova Plataforma LMS em Next.js 16
            </span>
          )}
        </div>

        <h1 className={styles.heroTitle}>
          {isAdmin
            ? 'Central de Gestão e Publicação de Cursos'
            : 'Domine o desenvolvimento web moderno do zero ao avançado'}
        </h1>

        <p className={styles.heroSubtitle}>
          {isAdmin
            ? 'Gerencie o catálogo completo, cadastre aulas em vídeo com controle de acesso e administre os alunos matriculados na plataforma.'
            : 'Cursos práticos e objetivos de Frontend, Backend, Bancos de Dados e Arquitetura com certificação imediata.'}
        </p>

        <div className={styles.heroActions}>
          {isAdmin ? (
            <>
              <Link href="/admin/cursos" className={styles.btnPrimary}>
                <PlusCircle size={18} />
                <span>Gerenciar Cursos</span>
              </Link>
              <Link href="/admin/aulas" className={styles.btnSecondary}>
                <Video size={18} />
                <span>Gerenciar Aulas</span>
              </Link>
              <Link href="/admin/usuarios" className={styles.btnSecondary}>
                <Users size={18} />
                <span>Gestão de Usuários</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/cursos" className={styles.btnPrimary}>
                <span>Explorar Catálogo</span>
                <ArrowRight size={18} />
              </Link>
              {role === 'public' ? (
                <Link href="/login" className={styles.btnSecondary}>
                  <span>Acessar Conta</span>
                </Link>
              ) : (
                <Link href="/certificados" className={styles.btnSecondary}>
                  <Award size={18} />
                  <span>Meus Certificados</span>
                </Link>
              )}
            </>
          )}
        </div>
      </section>

      {/* Feature Highlights / Admin Shortcut Modules */}
      <section className={styles.featureGrid}>
        {isAdmin ? (
          <>
            <Link href="/admin/cursos" className={styles.featureCardInteractive}>
              <div>
                <div className={styles.featureIconIndigo}>
                  <BookOpen size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Catálogo de Cursos</h3>
                <p style={{ fontSize: '0.85rem' }}>
                  Crie novas trilhas, edite descrições, carga horária e publique conteúdo para os alunos.
                </p>
              </div>
              <span className={styles.cardActionLink}>
                Acessar Cursos <ArrowRight size={14} />
              </span>
            </Link>

            <Link href="/admin/aulas" className={styles.featureCardInteractive}>
              <div>
                <div className={styles.featureIconEmerald}>
                  <Video size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Aulas & Vídeos</h3>
                <p style={{ fontSize: '0.85rem' }}>
                  Cadastre aulas em vídeo, faça upload de arquivos e defina permissões (gratuita ou restrita).
                </p>
              </div>
              <span className={styles.cardActionLink}>
                Acessar Aulas <ArrowRight size={14} />
              </span>
            </Link>

            <Link href="/admin/usuarios" className={styles.featureCardInteractive}>
              <div>
                <div className={styles.featureIconCyan}>
                  <Users size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Base de Usuários</h3>
                <p style={{ fontSize: '0.85rem' }}>
                  Pesquise alunos e administradores cadastrados e monitore contas ativas no sistema.
                </p>
              </div>
              <span className={styles.cardActionLink}>
                Gerenciar Usuários <ArrowRight size={14} />
              </span>
            </Link>
          </>
        ) : (
          <>
            <div className={styles.featureCard}>
              <div className={styles.featureIconIndigo}>
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Aulas 100% Práticas</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Vídeos didáticos e objetivos com código direto ao ponto e material de apoio.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconEmerald}>
                <CheckCircle size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Acompanhamento de Progresso</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Marque aulas concluídas e retome exatamente de onde parou em qualquer dispositivo.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconCyan}>
                <Award size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Certificado Autêntico</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Ao concluir 100% de um curso, receba seu certificado com código verificador exclusivo.
              </p>
            </div>
          </>
        )}
      </section>

      {/* Course Catalog Preview */}
      <section>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionBadge}>
              {isAdmin ? 'Visão Geral da Plataforma' : 'Trilhas de Aprendizado'}
            </span>
            <h2>{isAdmin ? 'Cursos Ativos na Plataforma' : 'Cursos em Destaque'}</h2>
          </div>
          <Link href="/cursos" className={styles.btnSmall}>
            <span>Ver Catálogo Completo ({courses.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}

