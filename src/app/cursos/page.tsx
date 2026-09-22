'use client';

import React, { useState } from 'react';
import { useLMSStore } from '@/stores/useLMSStore';
import { useAuthStore } from '@/stores/useAuthStore';
import CourseCard from '@/components/CourseCard';
import { Search, BookOpen } from 'lucide-react';
import styles from './cursos.module.scss';

export default function CoursesPage() {
  const courses = useLMSStore((state) => state.courses);
  const role = useAuthStore((state) => state.role);
  const [search, setSearch] = useState('');

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  const totalHours = courses.reduce((acc, c) => acc + (c.hours || 0), 0);
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessons || 0), 0);

  return (
    <div className={`animate-fade-in ${styles.pageContainer}`}>
      {/* Header & Stats */}
      <div className={styles.headerCard}>
        <div className={styles.headerContent}>
          <div className={styles.titleArea}>
            <span className={styles.badge}>
              Catálogo de Aprendizagem
            </span>
            <h1 style={{ marginBottom: '0.5rem' }}>
              {role === 'user' ? 'Meus Cursos e Trilhas' : 'Todos os Cursos'}
            </h1>
            <p style={{ fontSize: '0.95rem' }}>
              Acesse as aulas, acompanhe seu progresso e conquiste suas certificações.
            </p>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <div className={styles.statNumberIndigo}>{courses.length}</div>
              <div className={styles.statLabel}>Cursos</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumberCyan}>{totalLessons}</div>
              <div className={styles.statLabel}>Aulas</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumberEmerald}>{totalHours}h</div>
              <div className={styles.statLabel}>Horas</div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <Search size={18} />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Pesquisar por título ou assunto (ex: JavaScript, HTML, PostgreSQL)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of courses */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <BookOpen size={44} className={styles.emptyIcon} />
          <h3 style={{ marginBottom: '0.5rem' }}>Nenhum curso encontrado</h3>
          <p style={{ fontSize: '0.9rem' }}>Nenhum resultado para o termo pesquisado: &quot;{search}&quot;</p>
        </div>
      )}
    </div>
  );
}
