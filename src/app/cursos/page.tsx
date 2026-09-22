'use client';

import React, { useState } from 'react';
import { useLMSStore } from '@/stores/useLMSStore';
import { useAuthStore } from '@/stores/useAuthStore';
import CourseCard from '@/components/CourseCard';
import { Search, BookOpen, Clock, Award } from 'lucide-react';

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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Stats */}
      <div className="glass-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
              Catálogo de Aprendizagem
            </span>
            <h1 style={{ marginBottom: '0.5rem' }}>
              {role === 'USER' ? 'Meus Cursos e Trilhas' : 'Todos os Cursos'}
            </h1>
            <p style={{ fontSize: '0.95rem' }}>
              Acesse as aulas, acompanhe seu progresso e conquiste suas certificações.
            </p>
          </div>

          <div
            className="stats-container"
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flexShrink: 0 }}
          >
            <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '0.65rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-serif)' }}>{courses.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cursos</div>
            </div>
            <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '0.65rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-serif)' }}>{totalLessons}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aulas</div>
            </div>
            <div style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '0.65rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-serif)' }}>{totalHours}h</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Horas</div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ marginTop: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '3rem', background: 'rgba(9, 9, 11, 0.6)' }}
            placeholder="Pesquisar por título ou assunto (ex: JavaScript, HTML, PostgreSQL)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of courses */}
      {filtered.length > 0 ? (
        <div className="responsive-grid">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="glass-card text-center" style={{ padding: '3.5rem 1.5rem' }}>
          <BookOpen size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Nenhum curso encontrado</h3>
          <p style={{ fontSize: '0.9rem' }}>Nenhum resultado para o termo pesquisado: &quot;{search}&quot;</p>
        </div>
      )}
    </div>
  );
}
