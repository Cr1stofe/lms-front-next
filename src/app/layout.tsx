import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.scss';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SessionInitializer from '@/components/SessionInitializer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tiny LMS - Plataforma de Cursos Online',
  description: 'Aprenda desenvolvimento web moderno com cursos práticos e objetivos.',
  icons: {
    icon: '/favicon.svg',
  },
};

import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialRole = cookieStore.get('lms_role')?.value || 'public';

  return (
    <html lang="pt-BR" className={`${outfit.variable} ${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <body>
        <SessionInitializer initialRole={initialRole} />
        <Toaster position="top-right" richColors theme="dark" closeButton />
        <div className="app-container">
          <Navbar initialRole={initialRole} />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
