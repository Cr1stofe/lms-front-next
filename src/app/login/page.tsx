import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Entrar na Conta',
  description: 'Acesse sua conta no Veltro LMS para assistir às aulas, acompanhar seu progresso e emitir certificados.',
  alternates: {
    canonical: '/login',
  },
};

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
