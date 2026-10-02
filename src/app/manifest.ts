import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Veltro LMS - Plataforma de Cursos Online',
    short_name: 'Veltro LMS',
    description: 'Plataforma de ensino online com cursos práticos de desenvolvimento web e engenharia de software.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
