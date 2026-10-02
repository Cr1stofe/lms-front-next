import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Painel Administrativo',
    template: '%s | Painel Administrativo',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
