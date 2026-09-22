'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import styles from '@/styles/error-pages.module.scss';
import '@/styles/globals.scss';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Critical application error:', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="app-container">
          <main className="main-content">
            <div className={styles.wrapper}>
              <div className={styles.backgroundGlow} />

              <div className={styles.contentBox}>
                <div className={`${styles.statusPill} ${styles.statusError}`}>
                  <span className={styles.statusDot} />
                  <span>Erro Crítico</span>
                </div>

                <div className={styles.heroIconContainer}>
                  <AlertTriangle size={40} />
                </div>

                <h1 className={styles.title}>Falha ao inicializar o sistema</h1>
                <p className={styles.description}>
                  Ocorreu um erro no nível raiz da aplicação. Tente reiniciar o sistema ou retorne à página inicial.
                </p>

                <div className={styles.actionsRow}>
                  <button type="button" onClick={() => reset()} className={styles.primaryBtn}>
                    <RotateCcw size={18} />
                    <span>Reiniciar Aplicação</span>
                  </button>
                  <a href="/" className={styles.secondaryBtn}>
                    <Home size={18} />
                    <span>Ir para o Início</span>
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
