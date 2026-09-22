'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLMSStore } from '@/stores/useLMSStore';
import CourseCard from '@/components/CourseCard';
import { Sparkles, ArrowRight, BookOpen, Award, CheckCircle } from 'lucide-react';
import styles from './home.module.scss';

export default function HomePage() {
  const role = useAuthStore((state) => state.role);
  const courses = useLMSStore((state) => state.courses);

  return (
    <div className={`animate-fade-in ${styles.homeContainer}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <span className={styles.heroBadge}>
            <Sparkles size={14} /> Nova Plataforma LMS em Next.js 16
          </span>
        </div>

        <h1 className={styles.heroTitle}>
          Domine o desenvolvimento web moderno do zero ao avançado
        </h1>

        <p className={styles.heroSubtitle}>
          Cursos práticos e objetivos de Frontend, Backend, Bancos de Dados e Arquitetura com certificação imediata.
        </p>

        <div className={styles.heroActions}>
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
        </div>
      </section>

      {/* Feature Highlights */}
      <section className={styles.featureGrid}>
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
      </section>

      {/* Featured Courses */}
      <section>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionBadge}>
              Trilhas de Aprendizado
            </span>
            <h2>Cursos em Destaque</h2>
          </div>
          <Link href="/cursos" className={styles.btnSmall}>
            <span>Ver Todos ({courses.length})</span>
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
