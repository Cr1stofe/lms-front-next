import React from 'react';
import Link from 'next/link';
import { Home, Compass, BookOpen, Award } from 'lucide-react';
import styles from '@/styles/error-pages.module.scss';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundGlow} />

      <div className={styles.contentBox}>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} />
          <span>Erro 404 • Rota Inexistente</span>
        </div>

        <div className={styles.heroCode}>404</div>

        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.description}>
          O link que você acessou pode estar quebrado ou ter sido movido. Utilize os atalhos abaixo para continuar explorando.
        </p>

        <div className={styles.actionsRow}>
          <Link href="/" className={styles.primaryBtn}>
            <Home size={18} />
            <span>Voltar ao Início</span>
          </Link>
          <Link href="/cursos" className={styles.secondaryBtn}>
            <Compass size={18} />
            <span>Explorar Cursos</span>
          </Link>
        </div>

        <div className={styles.quickNav}>
          <div className={styles.quickNavTitle}>Atalhos Recomendados</div>
          <div className={styles.quickNavGrid}>
            <Link href="/cursos" className={styles.quickNavItem}>
              <BookOpen size={18} className={styles.quickNavIcon} />
              <span className={styles.quickNavLabel}>Catálogo de Cursos</span>
            </Link>
            <Link href="/certificados" className={styles.quickNavItem}>
              <Award size={18} className={styles.quickNavIcon} />
              <span className={styles.quickNavLabel}>Meus Certificados</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
