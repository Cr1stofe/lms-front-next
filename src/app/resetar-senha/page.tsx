'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/schemas/auth';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from '@/styles/auth-forms.module.scss';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (token) {
      setValue('token', token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError('');

    try {
      await resetPassword(data.token, data.password);
      setSuccess(true);
    } catch {
      setServerError('Falha ao redefinir a senha');
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
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {serverError && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>{serverError}</span>
              </div>
            )}

            {!token && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>Nenhum token fornecido na URL.</span>
              </div>
            )}

            <input type="hidden" {...register('token')} />
            {errors.token && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>{errors.token.message}</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="password">
                Nova Senha (Mínimo 6 caracteres)
              </label>
              <input
                id="password"
                type="password"
                className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="confirm-password">
                Confirmar Nova Senha
              </label>
              <input
                id="confirm-password"
                type="password"
                className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`}
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting || !token}
            >
              <KeyRound size={18} />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}</span>
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
