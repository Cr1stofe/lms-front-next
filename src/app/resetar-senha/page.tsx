'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { resetPasswordSchema } from '@/lib/schemas/auth';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = resetPasswordSchema.safeParse({ token, password, confirmPassword });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Preencha os campos corretamente');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(validation.data.token, validation.data.password);
      setSuccess(true);
    } catch {
      setError('Falha ao redefinir a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow animate-fade-in" style={{ paddingTop: '1.5rem' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Redefinir Senha</h1>
          <p style={{ fontSize: '0.9rem' }}>Digite sua nova senha para acessar a conta</p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
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
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Senha Alterada!</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Sua senha foi redefinida com sucesso. Você já pode fazer login.
            </p>
            <Link href="/login" className="btn btn-primary btn-full">
              Ir para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">
                Nova Senha
              </label>
              <input
                id="new-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                Confirmar Nova Senha
              </label>
              <input
                id="confirm-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1.5rem' }} disabled={loading}>
              <KeyRound size={18} />
              <span>{loading ? 'Salvando...' : 'Salvar Nova Senha'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center" style={{ padding: '3rem' }}>Carregando formulário...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
