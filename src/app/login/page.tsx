'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { loginSchema } from '@/lib/schemas/auth';
import { LogIn, AlertCircle } from 'lucide-react';
import styles from '@/styles/auth-forms.module.scss';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);

    try {
      const res = await login(validation.data.email, validation.data.password);
      if (res.success) {
        let destination = '/cursos';
        if (redirectUrl) {
          destination = redirectUrl;
        } else if (res.role === 'admin' || res.role === 'editor') {
          destination = '/admin/cursos';
        }
        
        window.location.href = destination;
      } else {
        setError(res.error || 'Credenciais inválidas');
        setLoading(false);
      }
    } catch {
      setError('Falha ao autenticar');
      setLoading(false);
    }
  };

  const handleQuickLogin = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Entrar na Conta</h1>
          <p className={styles.subtitle}>Acesse suas aulas, cursos e certificados</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.formLabel} htmlFor="password">
                Senha
              </label>
              <Link
                href="/perdeu-senha"
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
              >
                Esqueceu a senha?
              </Link>
            </div>
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
            <LogIn size={18} />
            <span>{loading ? 'Entrando...' : 'Entrar na Plataforma'}</span>
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className={styles.quickLoginArea}>
          <div className={styles.quickLoginLabel}>
            Acessos Rápidos de Demonstração
          </div>
          <div className={styles.quickLoginButtons}>
            <button
              type="button"
              className={styles.quickLoginBtn}
              onClick={() => handleQuickLogin('aluno@lms.com', 'aluno123')}
            >
              Preencher como Aluno
            </button>
            <button
              type="button"
              className={styles.quickLoginBtn}
              onClick={() => handleQuickLogin('admin@lms.com', 'admin123')}
            >
              Preencher como Admin
            </button>
          </div>
        </div>

        <div className={styles.footerLinks}>
          Não tem uma conta? <Link href="/criar-conta">Cadastre-se gratuitamente</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="glass-card text-center" style={{ padding: '3rem' }}>Carregando formulário...</div>}>
      <LoginForm />
    </Suspense>
  );
}
