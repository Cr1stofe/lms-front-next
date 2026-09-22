'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, showLabel = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <span>Progresso</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: 6,
          borderRadius: 9999,
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${clamped}%`,
            background: clamped >= 100 ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' : 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)',
            borderRadius: 9999,
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: clamped > 0 ? '0 0 10px rgba(99, 102, 241, 0.5)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
