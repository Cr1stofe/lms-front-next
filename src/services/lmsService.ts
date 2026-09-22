import { Course, Lesson, Certificate, User, CourseDetailsResponse } from '@/lib/types';
import { apiRequest, API_BASE } from '@/lib/api-client';

export interface UpsertCourseDTO {
  slug: string;
  title: string;
  description: string;
  lessons: number;
  hours: number;
}

export interface UpsertLessonDTO {
  courseSlug: string;
  slug: string;
  title: string;
  description: string;
  seconds: number;
  order: number;
  free: number | boolean;
  video: string;
}

export interface SearchUsersResponse {
  users: User[];
  total: number;
  totalPages: number;
}

export const lmsService = {
  async getCourses(): Promise<Course[]> {
    try {
      const { data } = await apiRequest<Course[]>('/lms/courses');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Erro ao carregar cursos', e);
      return [];
    }
  },

  async getCourseBySlug(slug: string): Promise<CourseDetailsResponse | null> {
    try {
      const { data } = await apiRequest<CourseDetailsResponse>(`/lms/course/${slug}`);
      return data;
    } catch (e) {
      console.error('Erro ao carregar detalhes do curso', e);
      return null;
    }
  },

  async getLessonBySlugs(courseSlug: string, lessonSlug: string): Promise<Lesson | null> {
    try {
      const { data } = await apiRequest<Lesson>(`/lms/lesson/${courseSlug}/${lessonSlug}`);
      return data;
    } catch (e) {
      console.error('Erro ao carregar aula', e);
      return null;
    }
  },

  async completeLesson(courseId: string | number, lessonId: string | number): Promise<boolean> {
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

  async resetCourseProgress(courseId: string | number): Promise<boolean> {
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

  async getCertificates(): Promise<Certificate[]> {
    try {
      const { data } = await apiRequest<Certificate[]>('/lms/certificates');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Erro ao carregar certificados', e);
      return [];
    }
  },

  async upsertCourse(courseData: UpsertCourseDTO) {
    const { data } = await apiRequest('/lms/course', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
    return data;
  },

  async getAdminLessons(): Promise<Lesson[]> {
    try {
      const { data } = await apiRequest<Lesson[]>('/lms/lessons');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Erro ao buscar aulas no painel admin', e);
      return [];
    }
  },

  async upsertLesson(lessonData: UpsertLessonDTO) {
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

  async uploadLessonVideo(file: File, isFree: boolean): Promise<string> {
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

  async searchUsers(query: string, page = 1): Promise<SearchUsersResponse> {
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
};
