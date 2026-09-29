'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { registerSchema, RegisterInput } from '@/lib/schemas/auth';
import { UserPlus, AlertCircle } from 'lucide-react';
import styles from '@/styles/auth-forms.module.scss';

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const registerUser = useAuthStore((state) => state.register);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError('');

    try {
      const res = await registerUser(
        data.name,
        data.username,
        data.email,
        data.password
      );
      if (res.success) {
        router.push('/login');
      } else {
        setServerError(res.error || 'Erro ao criar conta');
      }
    } catch {
      setServerError('Falha ao processar cadastro');
    }
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar Conta</h1>
          <p className={styles.subtitle}>Cadastre-se para acessar gratuitamente os cursos</p>
        </div>

        {serverError && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
              placeholder="Ex: Maria da Silva"
              {...register('name')}
            />
            {errors.name && (
              <span className={styles.fieldError}>
                <AlertCircle size={12} />
                {errors.name.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="username">
              Nome de Usuário
            </label>
            <input
              id="username"
              type="text"
              className={`${styles.formInput} ${errors.username ? styles.inputError : ''}`}
              placeholder="ex: mariasilva"
              {...register('username')}
            />
            {errors.username && (
              <span className={styles.fieldError}>
                <AlertCircle size={12} />
                {errors.username.message}
              </span>
            )}
          </div>

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
            <label className={styles.formLabel} htmlFor="password">
              Senha (Mínimo 6 caracteres)
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

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            <UserPlus size={18} />
            <span>{isSubmitting ? 'Cadastrando...' : 'Criar Conta Gratuita'}</span>
          </button>
        </form>

        <div className={styles.footerLinks}>
          Já tem uma conta? <Link href="/login">Fazer Login</Link>
        </div>
      </div>
    </div>
  );
}
