import { describe, it, expect, vi, beforeEach } from 'vitest';
import robots from './robots';
import manifest from './manifest';
import sitemap from './sitemap';
import { SITE_URL } from '@/lib/config';

describe('SEO & Metadata Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('robots.ts', () => {
    it('should return valid robots rules with public allow and private disallow', () => {
      const config = robots();
      expect(config.rules).toBeDefined();
      expect(config.sitemap).toContain('/sitemap.xml');

      const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules;
      expect(rule.allow).toContain('/');
      expect(rule.allow).toContain('/cursos');
      expect(rule.disallow).toContain('/admin/*');
      expect(rule.disallow).toContain('/api/*');
    });
  });

  describe('manifest.ts', () => {
    it('should return valid PWA manifest configuration', () => {
      const config = manifest();
      expect(config.name).toBe('Veltro LMS - Plataforma de Cursos Online');
      expect(config.short_name).toBe('Veltro LMS');
      expect(config.display).toBe('standalone');
      expect(config.theme_color).toBe('#2563eb');
      expect(config.icons).toBeDefined();
    });
  });

  describe('sitemap.ts', () => {
    it('should return static sitemap entries when backend fetch fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValueOnce(new Error('Network error')),
      );

      const entries = await sitemap();
      const urls = entries.map((e) => e.url);

      expect(urls).toContain(SITE_URL);
      expect(urls).toContain(`${SITE_URL}/cursos`);
      expect(urls).toContain(`${SITE_URL}/login`);
      expect(urls).toContain(`${SITE_URL}/criar-conta`);
    });

    it('should include dynamic course pages when backend resolves', async () => {
      const mockCourses = [
        { id: '1', title: 'React 19 Pro', slug: 'react-19-pro', hours: 10 },
        { id: '2', title: 'NestJS Architecture', slug: 'nestjs-arch', hours: 15 },
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => mockCourses,
        }),
      );

      const entries = await sitemap();
      const urls = entries.map((e) => e.url);

      expect(urls.some((u) => u.endsWith('/cursos/react-19-pro'))).toBe(true);
      expect(urls.some((u) => u.endsWith('/cursos/nestjs-arch'))).toBe(true);
    });
  });
});
