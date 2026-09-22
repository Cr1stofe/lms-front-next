import { create } from 'zustand';
import { Course } from '@/lib/types';
import { lmsService } from '@/services/lmsService';

interface LMSState {
  courses: Course[];
  loadingCourses: boolean;
  fetchCourses: () => Promise<Course[]>;
}

export const useLMSStore = create<LMSState>((set) => ({
  courses: [],
  loadingCourses: false,

  fetchCourses: async (): Promise<Course[]> => {
    set({ loadingCourses: true });
    try {
      const courses = await lmsService.getCourses();
      set({ courses, loadingCourses: false });
      return courses;
    } catch {
      set({ loadingCourses: false });
      return [];
    }
  },
}));

export const useLMS = useLMSStore;
