'use client';

import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, showLabel = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={styles.container}>
      {showLabel && (
        <div className={styles.labelRow}>
          <span>Progresso</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={styles.track}>
        <div
          className={`${styles.bar} ${clamped >= 100 ? styles.completed : ''}`}
          style={{
            width: `${clamped}%`,
            boxShadow: clamped > 0 ? undefined : 'none',
          }}
        />
      </div>
    </div>
  );
}
