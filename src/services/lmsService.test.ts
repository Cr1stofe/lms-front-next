import { describe, it, expect, vi, beforeEach } from 'vitest';
import { lmsService } from './lmsService';
import * as apiClient from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({
  apiRequest: vi.fn(),
  API_BASE: '/api',
  resolveVideoUrl: vi.fn((url: string) => url),
}));

describe('service: lmsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return list of courses when getCourses resolves successfully', async () => {
    const mockCourses = [{ id: '1', title: 'React Pro', slug: 'react-pro', description: 'Desc', hours: 10, lessons: 5 }];
    vi.spyOn(apiClient, 'apiRequest').mockResolvedValueOnce({
      data: mockCourses,
      response: new Response(),
    });

    const courses = await lmsService.getCourses();
    expect(courses).toEqual(mockCourses);
  });

  it('should return null in getCourseBySlug when request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(apiClient, 'apiRequest').mockRejectedValueOnce(new Error('Course not found'));

    const course = await lmsService.getCourseBySlug('non-existent');
    expect(course).toBeNull();
  });

  it('should return true in completeLesson when endpoint succeeds', async () => {
    vi.spyOn(apiClient, 'apiRequest').mockResolvedValueOnce({
      data: { success: true },
      response: new Response(),
    });

    const result = await lmsService.completeLesson('1', '10');
    expect(result).toBe(true);
  });
});
