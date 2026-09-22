'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { forgotPasswordSchema } from '@/lib/schemas/auth';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Informe um e-mail válido');
      return;
    }

    setLoading(true);
    await requestPasswordReset(validation.data.email);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="container-narrow animate-fade-in" style={{ paddingTop: '1.5rem' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Recuperar Senha</h1>
          <p style={{ fontSize: '0.9rem' }}>Informe seu e-mail para receber as instruções de recuperação</p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>E-mail Enviado!</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Se o e-mail <strong>{email}</strong> estiver cadastrado, enviamos um link para redefinição.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/resetar-senha?token=demo-token-123" className="btn btn-primary">
                Simular link de redefinição recebido
              </Link>
              <Link href="/login" className="btn">
                Voltar para o Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#f87171',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email-forgot">
                E-mail Cadastrado
              </label>
              <input
                id="email-forgot"
                type="email"
                className="form-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1.5rem' }} disabled={loading}>
              <Mail size={18} />
              <span>{loading ? 'Enviando...' : 'Enviar Link de Recuperação'}</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={14} /> Voltar para o Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
