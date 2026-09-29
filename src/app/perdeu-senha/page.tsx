'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/schemas/auth';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from '@/styles/auth-forms.module.scss';

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [serverError, setServerError] = useState('');
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError('');
    try {
      await requestPasswordReset(data.email);
      setSubmittedEmail(data.email);
    } catch {
      setServerError('Falha ao solicitar recuperação de senha');
    }
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Recuperar Senha</h1>
          <p className={styles.subtitle}>
            Informe seu e-mail para receber as instruções de recuperação
          </p>
        </div>

        {submittedEmail ? (
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
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              E-mail Enviado!
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                color: 'var(--color-text-muted)',
              }}
            >
              Se o e-mail <strong>{submittedEmail}</strong> estiver cadastrado,
              enviamos as instruções com o link para redefinição da sua senha.
              Verifique sua caixa de entrada e spam.
            </p>
            <Link
              href="/login"
              className={styles.submitBtn}
              style={{ margin: 0, textDecoration: 'none' }}
            >
              Voltar para o Login
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

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="email-forgot">
                E-mail Cadastrado
              </label>
              <input
                id="email-forgot"
                type="email"
                className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                placeholder="seu.email@exemplo.com"
                {...register('email')}
              />
              {errors.email && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {errors.email.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              <Mail size={18} />
              <span>
                {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </span>
            </button>

            <div className={styles.footerLinks}>
              <Link
                href="/login"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={14} /> Voltar para o Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
