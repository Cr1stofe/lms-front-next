'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/LMSContext';
import { API_BASE } from '@/lib/api-client';
import { Certificate } from '@/lib/types';
import { Award, ExternalLink, Loader2, BookOpen } from 'lucide-react';

export default function CertificatesPage() {
  const { getCertificates } = useLMS();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCerts() {
      setLoading(true);
      const data = await getCertificates();
      setCertificates(data);
      setLoading(false);
    }
    loadCerts();
  }, [getCertificates]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
              <Award size={12} /> Conquistas
            </span>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Meus Certificados</h1>
            <p style={{ fontSize: '0.95rem' }}>
              Certificados emitidos após a conclusão dos seus cursos.
            </p>
          </div>

          <div
            style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-serif)' }}>
              {certificates.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Certificados</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-card text-center" style={{ padding: '3rem' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#818cf8' }} />
          <p>Carregando certificados...</p>
        </div>
      ) : certificates.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {certificates.map((cert) => {
            const formattedDate = cert.completed
              ? cert.completed.slice(0, 10).split('-').reverse().join('/')
              : '';
            const certUrl = `${API_BASE}/lms/certificate/${cert.id}`;

            return (
              <div
                key={cert.id}
                className="glass-card glass-card-interactive"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 1.75rem',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{cert.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Concluído em: {formattedDate}
                    </p>
                  </div>
                </div>

                <a
                  href={certUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <span>Baixar Certificado PDF</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <Award size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Nenhum certificado emitido ainda</h2>
          <p style={{ maxWidth: 460, margin: '0 auto 2rem', fontSize: '0.9rem' }}>
            Complete 100% das aulas de um curso para emitir o seu certificado.
          </p>
          <Link href="/cursos" className="btn btn-primary btn-lg">
            <BookOpen size={18} />
            <span>Explorar Cursos</span>
          </Link>
        </div>
      )}
    </div>
  );
}
