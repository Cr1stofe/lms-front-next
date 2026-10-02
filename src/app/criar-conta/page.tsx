import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Criar Conta Gratuita',
  description: 'Cadastre-se gratuitamente na Veltro LMS para acessar cursos práticos e emitir certificados de conclusão.',
  alternates: {
    canonical: '/criar-conta',
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
