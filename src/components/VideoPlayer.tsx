'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  src?: string | null;
  title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);

  const isValidSrc = typeof src === 'string' && src.trim() !== '';

  return (
    <div className="video-wrapper">
      {isValidSrc && !hasError ? (
        <video
          key={src}
          className="video-element"
          controls
          preload="metadata"
          playsInline
          onError={() => setHasError(true)}
        >
          <source src={src} type="video/mp4" />
          Seu navegador não suporta reprodução de vídeos HTML5.
        </video>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'radial-gradient(circle, #181920 0%, #09090b 100%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: '#818cf8',
            }}
          >
            <Play size={24} style={{ marginLeft: 3 }} />
          </div>
          <h4 style={{ marginBottom: '0.5rem', color: '#ffffff' }}>{title}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 400 }}>
            {isValidSrc
              ? 'Não foi possível carregar o vídeo. Verifique se o arquivo está disponível.'
              : 'Nenhum arquivo de vídeo associado a esta aula.'}
          </p>
        </div>
      )}
    </div>
  );
}
