import { describe, it, expect } from 'vitest';
import { resolveVideoUrl } from './api-client';

describe('api-client: resolveVideoUrl', () => {
  it('should return empty string when path is null or empty', () => {
    expect(resolveVideoUrl('')).toBe('');
    expect(resolveVideoUrl(null as unknown as string)).toBe('');
  });

  it('should keep absolute URLs (http/https) intact', () => {
    expect(resolveVideoUrl('https://example.com/video.mp4')).toBe('https://example.com/video.mp4');
    expect(resolveVideoUrl('http://cdn.example.com/stream.m3u8')).toBe('http://cdn.example.com/stream.m3u8');
  });

  it('should resolve relative storage paths to BFF /api/files endpoint', () => {
    expect(resolveVideoUrl('files/courses/intro.mp4')).toBe('/api/files/courses/intro.mp4');
    expect(resolveVideoUrl('/files/courses/intro.mp4')).toBe('/api/files/courses/intro.mp4');
    expect(resolveVideoUrl('private/lesson-1.mp4')).toBe('/api/files/private/lesson-1.mp4');
  });
});
