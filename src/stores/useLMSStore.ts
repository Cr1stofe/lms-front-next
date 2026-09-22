import { create } from 'zustand';
import { Course, Lesson, Certificate, User, CourseDetailsResponse } from '@/lib/types';
import { apiRequest, API_BASE } from '@/lib/api-client';

interface LMSState {
  courses: Course[];
  loadingCourses: boolean;
  fetchCourses: () => Promise<Course[]>;
  getCourseBySlug: (slug: string) => Promise<CourseDetailsResponse | null>;
  getLessonBySlugs: (courseSlug: string, lessonSlug: string) => Promise<Lesson | null>;
  completeLesson: (courseId: string | number, lessonId: string | number) => Promise<boolean>;
  resetCourseProgress: (courseId: string | number) => Promise<boolean>;
  getCertificates: () => Promise<Certificate[]>;
  upsertCourse: (courseData: { slug: string; title: string; description: string; lessons: number; hours: number }) => Promise<any>;
  getAdminLessons: () => Promise<Lesson[]>;
  upsertLesson: (lessonData: {
    courseSlug: string;
    slug: string;
    title: string;
    description: string;
    seconds: number;
    order: number;
    free: number | boolean;
    video: string;
  }) => Promise<any>;
  uploadLessonVideo: (file: File, isFree: boolean) => Promise<string>;
  searchUsers: (query: string, page?: number) => Promise<{ users: User[]; total: number; totalPages: number }>;
}

export const useLMSStore = create<LMSState>((set, get) => ({
  courses: [],
  loadingCourses: false,

  fetchCourses: async (): Promise<Course[]> => {
    set({ loadingCourses: true });
    try {
      const { data } = await apiRequest<Course[]>('/lms/courses');
      const coursesList = Array.isArray(data) ? data : [];
      set({ courses: coursesList, loadingCourses: false });
      return coursesList;
    } catch (e) {
      console.error('Erro ao carregar cursos da API', e);
      set({ loadingCourses: false });
      return [];
    }
  },

  getCourseBySlug: async (slug: string): Promise<CourseDetailsResponse | null> => {
    try {
      const { data } = await apiRequest<CourseDetailsResponse>(`/lms/course/${slug}`);
      return data;
    } catch (e) {
      console.error('Erro ao buscar detalhes do curso', e);
      return null;
    }
  },

  getLessonBySlugs: async (courseSlug: string, lessonSlug: string): Promise<Lesson | null> => {
    try {
      const { data } = await apiRequest<Lesson>(`/lms/lesson/${courseSlug}/${lessonSlug}`);
      return data;
    } catch (e) {
      console.error('Erro ao buscar aula', e);
      return null;
    }
  },

  completeLesson: async (courseId: string | number, lessonId: string | number): Promise<boolean> => {
    try {
      await apiRequest('/lms/lesson/complete', {
        method: 'POST',
        body: JSON.stringify({ courseId, lessonId }),
      });
      return true;
    } catch (e) {
      console.error('Erro ao completar aula', e);
      return false;
    }
  },

  resetCourseProgress: async (courseId: string | number): Promise<boolean> => {
    try {
      await apiRequest('/lms/course/reset', {
        method: 'DELETE',
        body: JSON.stringify({ courseId }),
      });
      return true;
    } catch (e) {
      console.error('Erro ao resetar curso', e);
      return false;
    }
  },

  getCertificates: async (): Promise<Certificate[]> => {
    try {
      const { data } = await apiRequest<Certificate[]>('/lms/certificates');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Erro ao buscar certificados', e);
      return [];
    }
  },

  upsertCourse: async (courseData: {
    slug: string;
    title: string;
    description: string;
    lessons: number;
    hours: number;
  }) => {
    const { data } = await apiRequest('/lms/course', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
    await get().fetchCourses();
    return data;
  },

  getAdminLessons: async (): Promise<Lesson[]> => {
    try {
      const { data } = await apiRequest<Lesson[]>('/lms/lessons');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Erro ao buscar aulas no painel admin', e);
      return [];
    }
  },

  upsertLesson: async (lessonData: {
    courseSlug: string;
    slug: string;
    title: string;
    description: string;
    seconds: number;
    order: number;
    free: number | boolean;
    video: string;
  }) => {
    const payload = {
      ...lessonData,
      free: lessonData.free === true || lessonData.free === 1 ? 1 : 0,
    };
    const { data } = await apiRequest('/lms/lesson', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  },

  uploadLessonVideo: async (file: File, isFree: boolean): Promise<string> => {
    const url = `${API_BASE}/files/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-filename': file.name,
        'x-visibility': isFree ? 'public' : 'private',
      },
      body: file,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Falha no upload do arquivo: ${response.statusText}`);
    }

    const upload = await response.json();
    return upload.path;
  },

  searchUsers: async (query: string, page = 1): Promise<{ users: User[]; total: number; totalPages: number }> => {
    try {
      const { data, response } = await apiRequest<User[]>(`/auth/users/search?s=${encodeURIComponent(query)}&page=${page}`);
      const totalHeader = response.headers.get('x-total-count');
      const total = totalHeader ? Number(totalHeader) : (Array.isArray(data) ? data.length : 0);
      const totalPages = Math.max(1, Math.ceil(total / 5));
      return {
        users: Array.isArray(data) ? data : [],
        total,
        totalPages,
      };
    } catch (e) {
      console.error('Erro ao buscar usuários', e);
      return { users: [], total: 0, totalPages: 1 };
    }
  },
}));

export const useLMS = useLMSStore;
