'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await requestPasswordReset(email);
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
