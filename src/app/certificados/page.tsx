'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { lmsService } from '@/services/lmsService';
import { API_BASE } from '@/lib/api-client';
import { Certificate } from '@/lib/types';
import { Award, ExternalLink, Loader2, BookOpen } from 'lucide-react';
import styles from './certificados.module.scss';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCerts() {
      setLoading(true);
      const data = await lmsService.getCertificates();
      setCertificates(data);
      setLoading(false);
    }
    loadCerts();
  }, []);

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      {/* Header */}
      <div className={styles.headerCard}>
        <div className={styles.headerContent}>
          <div>
            <span className={styles.badgeEmerald}>
              <Award size={12} /> Conquistas
            </span>
            <h1 className={styles.title}>Meus Certificados</h1>
            <p style={{ fontSize: '0.95rem' }}>
              Certificados emitidos após a conclusão dos seus cursos.
            </p>
          </div>

          <div className={styles.statsCounter}>
            <div className={styles.statsNumber}>
              {certificates.length}
            </div>
            <div className={styles.statsLabel}>Certificados</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-card text-center" style={{ padding: '3rem' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#818cf8' }} />
          <p>Carregando certificados...</p>
        </div>
      ) : certificates.length > 0 ? (
        <div className={styles.list}>
          {certificates.map((cert) => {
            const formattedDate = cert.completed
              ? cert.completed.slice(0, 10).split('-').reverse().join('/')
              : '';
            const certUrl = `${API_BASE}/lms/certificate/${cert.id}`;

            return (
              <div
                key={cert.id}
                className={styles.certCard}
              >
                <div className={styles.certLeft}>
                  <div className={styles.certIconWrapper}>
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className={styles.certTitle}>{cert.title}</h3>
                    <p className={styles.certDate}>
                      Concluído em: {formattedDate}
                    </p>
                  </div>
                </div>

                <a
                  href={certUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                >
                  <span>Baixar Certificado PDF</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <Award size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Nenhum certificado emitido ainda</h2>
          <p style={{ maxWidth: 460, margin: '0 auto 2rem', fontSize: '0.9rem' }}>
            Complete 100% das aulas de um curso para emitir o seu certificado.
          </p>
          <Link href="/cursos" className={styles.exploreBtn}>
            <BookOpen size={18} />
            <span>Explorar Cursos</span>
          </Link>
        </div>
      )}
    </div>
  );
}
