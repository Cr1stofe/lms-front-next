'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { resetPasswordSchema } from '@/lib/schemas/auth';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from '@/styles/auth-forms.module.scss';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

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
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Redefinir Senha</h1>
          <p className={styles.subtitle}>Crie uma nova senha de acesso</p>
        </div>

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
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Senha Alterada com Sucesso!</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Sua senha foi redefinida. Agora você já pode entrar na sua conta.
            </p>
            <Link href="/login" className={styles.submitBtn} style={{ margin: 0, display: 'inline-flex' }}>
              Ir para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {!token && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>Nenhum token fornecido na URL.</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="password">
                Nova Senha (Mínimo 6 caracteres)
              </label>
              <input
                id="password"
                type="password"
                className={styles.formInput}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="confirm-password">
                Confirmar Nova Senha
              </label>
              <input
                id="confirm-password"
                type="password"
                className={styles.formInput}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !token}
            >
              <KeyRound size={18} />
              <span>{loading ? 'Salvando...' : 'Salvar Nova Senha'}</span>
            </button>

            <div className={styles.footerLinks}>
              <Link href="/login">Voltar para o Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="glass-card text-center" style={{ padding: '3rem' }}>Carregando formulário...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
