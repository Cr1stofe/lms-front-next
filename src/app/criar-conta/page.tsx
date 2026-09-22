'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { registerSchema } from '@/lib/schemas/auth';
import { UserPlus, AlertCircle } from 'lucide-react';
import styles from '@/styles/auth-forms.module.scss';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = registerSchema.safeParse({ name, username, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);

    try {
      const res = await register(
        validation.data.name,
        validation.data.username,
        validation.data.email,
        validation.data.password
      );
      if (res.success) {
        router.push('/login');
      } else {
        setError(res.error || 'Erro ao criar conta');
      }
    } catch {
      setError('Falha ao processar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar Conta</h1>
          <p className={styles.subtitle}>Cadastre-se para acessar gratuitamente os cursos</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              className={styles.formInput}
              placeholder="Ex: Maria da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="username">
              Nome de Usuário
            </label>
            <input
              id="username"
              type="text"
              className={styles.formInput}
              placeholder="ex: mariasilva"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className={styles.formInput}
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Senha (Mínimo 6 caracteres)
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

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Cadastrando...' : 'Criar Conta Gratuita'}</span>
          </button>
        </form>

        <div className={styles.footerLinks}>
          Já tem uma conta? <Link href="/login">Fazer Login</Link>
        </div>
      </div>
    </div>
  );
}
