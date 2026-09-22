'use client';

import React from 'react';
import { Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 1.5rem',
        marginTop: 'auto',
        background: 'rgba(9, 9, 11, 0.95)',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>© {new Date().getFullYear()} Tiny LMS</span>
          <span>•</span>
          <span>Next.js 16</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-emerald">
            <Database size={12} /> Backend API Conectado
          </span>
        </div>
      </div>
    </footer>
  );
}
