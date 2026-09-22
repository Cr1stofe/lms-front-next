'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        let destination = '/cursos';
        if (redirectUrl) {
          destination = redirectUrl;
        } else if (res.role === 'admin' || res.role === 'editor') {
          destination = '/admin/cursos';
        }
        
        // Redireciona e atualiza a aplicação
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

  return (
    <div className="container-narrow animate-fade-in" style={{ paddingTop: '1.5rem' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Login Conta</h1>
          <p style={{ fontSize: '0.9rem' }}>Entre com seu e-mail e senha cadastrados</p>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password">
                Senha
              </label>
              <Link href="/perdeu-senha" style={{ fontSize: '0.75rem', color: '#818cf8' }}>
                Recuperar Senha
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1.5rem' }} disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Entrando...' : 'Login'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Não possui conta?{' '}
          <Link href="/criar-conta" style={{ color: '#818cf8', fontWeight: 600 }}>
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center" style={{ padding: '3rem' }}>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
