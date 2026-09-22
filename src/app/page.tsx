'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLMS } from '@/context/LMSContext';
import CourseCard from '@/components/CourseCard';
import { Sparkles, ArrowRight, BookOpen, Award, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { role } = useAuth();
  const { courses } = useLMS();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', paddingTop: '1rem', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <span className="badge badge-indigo" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
            <Sparkles size={14} /> Nova Plataforma LMS em Next.js 16
          </span>
        </div>

        <h1 style={{ marginBottom: '1.25rem', maxWidth: '750px', margin: '0 auto 1.25rem' }}>
          Domine o desenvolvimento web moderno do zero ao avançado
        </h1>

        <p style={{ fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Cursos práticos e objetivos de Frontend, Backend, Bancos de Dados e Arquitetura com certificação imediata.
        </p>

        <div
          className="hero-buttons"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
        >
          <Link href="/cursos" className="btn btn-primary btn-lg">
            <span>Explorar Catálogo</span>
            <ArrowRight size={18} />
          </Link>
          {role === 'public' ? (
            <Link href="/login" className="btn btn-lg">
              <span>Acessar Conta</span>
            </Link>
          ) : (
            <Link href="/certificados" className="btn btn-lg">
              <Award size={18} />
              <span>Meus Certificados</span>
            </Link>
          )}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="responsive-grid">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <BookOpen size={20} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Aulas 100% Práticas</h3>
          <p style={{ fontSize: '0.85rem' }}>
            Vídeos didáticos e objetivos com código direto ao ponto e material de apoio.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle size={20} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Acompanhamento de Progresso</h3>
          <p style={{ fontSize: '0.85rem' }}>
            Marque aulas concluídas e retome exatamente de onde parou em qualquer dispositivo.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#22d3ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '0.4rem' }}>
              Trilhas de Aprendizado
            </span>
            <h2>Cursos em Destaque</h2>
          </div>
          <Link href="/cursos" className="btn btn-sm">
            <span>Ver Todos ({courses.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="responsive-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
