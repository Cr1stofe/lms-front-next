import { ImageResponse } from 'next/og';

export const alt = 'Veltro LMS - Plataforma de Cursos Online';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          background: '#f1f5f9',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '30%',
            width: '40%',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '50px 60px',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="46" height="46">
                <defs>
                  <linearGradient id="og-grad-global" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="#0f172a" />
                <path d="M16 6L6 11L16 16L26 11L16 6Z" fill="url(#og-grad-global)" />
                <path d="M6 14.5L16 19.5L26 14.5" stroke="url(#og-grad-global)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M6 18L16 23L26 18" stroke="url(#og-grad-global)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  VELTRO LMS
                </span>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.8px' }}>
                  PLATAFORMA DE ENSINO EM TECNOLOGIA
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.3px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#2563eb',
                }}
              />
              NOVA PLATAFORMA DE ENSINO
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '980px' }}>
            <h1
              style={{
                fontSize: '50px',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-1.5px',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Domine o Desenvolvimento Web do Zero ao Avançado
            </h1>

            <p
              style={{
                fontSize: '21px',
                color: '#475569',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              Cursos práticos de Next.js, React 19, TypeScript, NestJS e Arquitetura Corporativa com certificação imediata.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: '#eff6ff',
                  border: '1px solid #dbeafe',
                  color: '#1e40af',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
                <span style={{ fontSize: '18px' }}>•</span> Aulas 100% Práticas
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
                <span style={{ fontSize: '18px' }}>•</span> Projetos Reais de Alto Nível
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  color: '#075985',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
                <span style={{ fontSize: '18px' }}>•</span> Certificado com Validador
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 22px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              Acessar Plataforma →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
