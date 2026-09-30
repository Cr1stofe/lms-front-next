import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLMSStore } from './useLMSStore';
import { lmsService } from '@/services/lmsService';

vi.mock('@/services/lmsService', () => ({
  lmsService: {
    getCourses: vi.fn(),
  },
}));

describe('store: useLMSStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useLMSStore.setState({
      courses: [],
      loadingCourses: false,
    });
  });

  it('should fetch and populate courses in state', async () => {
    const mockCourses = [
      {
        id: '1',
        title: 'Modern JavaScript',
        slug: 'modern-javascript',
        description: 'Complete course',
        hours: 20,
        lessons: 15,
      },
    ];

    vi.mocked(lmsService.getCourses).mockResolvedValueOnce(mockCourses);

    const result = await useLMSStore.getState().fetchCourses();

    expect(result).toEqual(mockCourses);
    expect(useLMSStore.getState().courses).toEqual(mockCourses);
    expect(useLMSStore.getState().loadingCourses).toBe(false);
  });

  it('should handle fetch failures gracefully by setting empty courses array', async () => {
    vi.mocked(lmsService.getCourses).mockRejectedValueOnce(new Error('Network error'));

    const result = await useLMSStore.getState().fetchCourses();

    expect(result).toEqual([]);
    expect(useLMSStore.getState().courses).toEqual([]);
    expect(useLMSStore.getState().loadingCourses).toBe(false);
  });
});
