'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home, BookOpen } from 'lucide-react';
import styles from '@/styles/error-pages.module.scss';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundGlow} />

      <div className={styles.contentBox}>
        <div className={`${styles.statusPill} ${styles.statusError}`}>
          <span className={styles.statusDot} />
          <span>Erro de Execução</span>
        </div>

        <div className={styles.heroIconContainer}>
          <AlertCircle size={40} />
        </div>

        <h1 className={styles.title}>Ocorreu uma falha inesperada</h1>
        <p className={styles.description}>
          Não foi possível processar a requisição no momento. Você pode tentar recarregar a página ou retornar para o início.
        </p>

        <div className={styles.actionsRow}>
          <button type="button" onClick={() => reset()} className={styles.primaryBtn}>
            <RotateCcw size={18} />
            <span>Recarregar Página</span>
          </button>
          <Link href="/" className={styles.secondaryBtn}>
            <Home size={18} />
            <span>Voltar ao Início</span>
          </Link>
        </div>

        <div className={styles.quickNav}>
          <div className={styles.quickNavTitle}>Para onde deseja ir?</div>
          <div className={styles.quickNavGrid}>
            <Link href="/cursos" className={styles.quickNavItem}>
              <BookOpen size={18} className={styles.quickNavIcon} />
              <span className={styles.quickNavLabel}>Ver Cursos</span>
            </Link>
            <Link href="/" className={styles.quickNavItem}>
              <Home size={18} className={styles.quickNavIcon} />
              <span className={styles.quickNavLabel}>Página Inicial</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
