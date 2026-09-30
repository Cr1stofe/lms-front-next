import { describe, it, expect } from 'vitest';
import { secToMin, formatDate, generateId, slugify } from './utils';

describe('utils: secToMin', () => {
  it('should format 0 seconds as "00:00"', () => {
    expect(secToMin(0)).toBe('00:00');
  });

  it('should format seconds under 60 with leading zeros', () => {
    expect(secToMin(45)).toBe('00:45');
    expect(secToMin(9)).toBe('00:09');
  });

  it('should format minutes and seconds with 2-digit padding', () => {
    expect(secToMin(125)).toBe('02:05');
    expect(secToMin(3600)).toBe('60:00');
  });

  it('should handle invalid or negative values returning "00:00"', () => {
    expect(secToMin(-10)).toBe('00:00');
    expect(secToMin(NaN)).toBe('00:00');
    expect(secToMin(null as unknown as number)).toBe('00:00');
  });
});

describe('utils: formatDate', () => {
  it('should format valid ISO date strings', () => {
    expect(formatDate('2026-09-30T12:00:00.000Z')).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('should return empty string for empty date inputs', () => {
    expect(formatDate('')).toBe('');
  });
});

describe('utils: generateId', () => {
  it('should generate unique IDs with custom prefixes', () => {
    const id1 = generateId('cert');
    const id2 = generateId('cert');
    expect(id1).toMatch(/^cert-/);
    expect(id1).not.toBe(id2);
  });
});

describe('utils: slugify', () => {
  it('should convert accented text and spaces into clean slugs', () => {
    expect(slugify('Introdução ao React & Next.js')).toBe('introducao-ao-react-nextjs');
    expect(slugify('Curso Completo de NestJS 11')).toBe('curso-completo-de-nestjs-11');
  });

  it('should trim leading/trailing hyphens and remove consecutive special characters', () => {
    expect(slugify('  ---TypeScript Avançado---  ')).toBe('typescript-avancado');
  });
});
