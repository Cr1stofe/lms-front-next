'use client';

import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import styles from './VideoPlayer.module.scss';

interface VideoPlayerProps {
  src?: string | null;
  title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const isValidSrc = typeof src === 'string' && src.trim() !== '';

  return (
    <div className={styles.wrapper}>
      {isValidSrc && !hasError ? (
        <video
          key={src}
          src={src}
          className={styles.videoElement}
          controls
          preload="metadata"
          playsInline
          onError={() => setHasError(true)}
        >
          <source src={src} type="video/mp4" />
          Seu navegador não suporta reprodução de vídeos HTML5.
        </video>
      ) : (
        <div className={styles.fallback}>
          <div className={styles.playIconWrapper}>
            <Play size={24} style={{ marginLeft: 3 }} />
          </div>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.message}>
            {isValidSrc
              ? 'Não foi possível carregar o vídeo. Verifique se o arquivo está disponível e se você possui acesso.'
              : 'Nenhum arquivo de vídeo associado a esta aula.'}
          </p>
        </div>
      )}
    </div>
  );
}
