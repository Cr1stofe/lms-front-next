import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.scss';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
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

import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Veltro LMS - Plataforma de Cursos Online',
    template: '%s | Veltro LMS',
  },
  description: 'Aprenda desenvolvimento web moderno do zero ao avançado com cursos práticos, projetos reais e certificação imediata.',
  applicationName: 'Veltro LMS',
  authors: [{ name: 'Veltro LMS Team', url: SITE_URL }],
  creator: 'Veltro LMS',
  publisher: 'Veltro LMS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  keywords: [
    'cursos online',
    'desenvolvimento web',
    'programação',
    'Next.js',
    'React',
    'TypeScript',
    'NestJS',
    'PostgreSQL',
    'certificados online',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Veltro LMS',
    title: 'Veltro LMS - Plataforma de Cursos Online',
    description: 'Aprenda desenvolvimento web moderno do zero ao avançado com cursos práticos, projetos reais e certificação imediata.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veltro LMS - Plataforma de Cursos Online',
    description: 'Aprenda desenvolvimento web moderno com cursos práticos e certificação.',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  other: {
    'geo.region': 'BR',
    'geo.placename': 'Brasil',
    'content-language': 'pt-BR',
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Veltro LMS',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: 'Plataforma de ensino online focada em desenvolvimento web e engenharia de software moderna.',
  sameAs: [],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Veltro LMS',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/cursos?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialRole = cookieStore.get('lms_role')?.value || 'public';

  return (
    <html lang="pt-BR" className={`${outfit.variable} ${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
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
