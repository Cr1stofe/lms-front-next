import type { Metadata } from 'next';
import CertificatesClient from './CertificatesClient';

export const metadata: Metadata = {
  title: 'Meus Certificados',
  description: 'Gerencie e visualize seus certificados de conclusão de cursos na Veltro LMS.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CertificatesPage() {
  return <CertificatesClient />;
}
