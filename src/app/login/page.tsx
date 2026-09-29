'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { loginSchema, LoginInput } from '@/lib/schemas/auth';
import { LogIn, AlertCircle } from 'lucide-react';
import styles from '@/styles/auth-forms.module.scss';

function LoginForm() {
  const [serverError, setServerError] = useState('');
  const login = useAuthStore((state) => state.login);
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get('redirect');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError('');

    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        let destination = '/cursos';
        if (redirectUrl) {
          destination = redirectUrl;
        } else if (res.role === 'admin' || res.role === 'editor') {
          destination = '/admin/cursos';
        }

        router.push(destination);
        router.refresh();
      } else {
        setServerError(res.error || 'Credenciais inválidas');
      }
    } catch {
      setServerError('Falha ao autenticar');
    }
  };

  const handleQuickLogin = (userEmail: string, userPass: string) => {
    setValue('email', userEmail, { shouldValidate: true });
    setValue('password', userPass, { shouldValidate: true });
    setServerError('');
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.glowingDot} />
            <span>Veltro LMS</span>
          </div>

          <h1 className={styles.title}>Entrar na Conta</h1>
          <p className={styles.subtitle}>
            Acesse seus cursos, aulas e certificados na plataforma
          </p>
        </div>

        {serverError && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
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

          <div className={styles.formGroup}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label className={styles.formLabel} htmlFor="password">
                Senha
              </label>
              <Link
                href="/perdeu-senha"
                style={{ fontSize: '0.78rem', color: '#64748b' }}
              >
                Esqueceu a senha?
              </Link>
            </div>
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

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            <LogIn size={18} />
            <span>{isSubmitting ? 'Autenticando...' : 'Entrar na Plataforma'}</span>
          </button>
        </form>

        <div className={styles.quickLoginArea}>
          <div className={styles.quickLoginLabel}>
            Acessos Rápidos de Demonstração
          </div>
          <div className={styles.quickLoginButtons}>
            <button
              type="button"
              className={styles.quickLoginBtn}
              onClick={() => handleQuickLogin('aluno@lms.com', 'P@ssw0rd123')}
            >
              Aluno
            </button>
            <button
              type="button"
              className={styles.quickLoginBtn}
              onClick={() => handleQuickLogin('editor@lms.com', 'P@ssw0rd123')}
            >
              Editor
            </button>
            <button
              type="button"
              className={styles.quickLoginBtn}
              onClick={() => handleQuickLogin('admin@lms.com', 'P@ssw0rd123')}
            >
              Admin
            </button>
          </div>
        </div>

        <div className={styles.footerLinks}>
          Não tem uma conta?{' '}
          <Link href="/criar-conta">Cadastre-se gratuitamente</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="glass-card text-center" style={{ padding: '3rem' }}>
          Carregando formulário...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
