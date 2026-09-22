import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LMSProvider } from '@/context/LMSContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tiny LMS - Plataforma de Cursos Online',
  description: 'Aprenda desenvolvimento web moderno com cursos práticos e objetivos.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${plusJakarta.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <LMSProvider>
            <div className="app-container">
              <Navbar />
              <main className="main-content">{children}</main>
              <Footer />
            </div>
          </LMSProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
