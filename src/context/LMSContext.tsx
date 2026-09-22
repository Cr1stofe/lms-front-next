'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Course, Lesson, Certificate, User, CourseDetailsResponse } from '@/lib/types';
import { apiRequest, API_BASE } from '@/lib/api-client';

interface LMSContextType {
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
  searchUsers: (query: string, page: number) => Promise<{ users: User[]; total: number; totalPages: number }>;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export function LMSProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const fetchCourses = useCallback(async (): Promise<Course[]> => {
    setLoadingCourses(true);
    try {
      const { data } = await apiRequest<Course[]>('/lms/courses');
      if (Array.isArray(data)) {
        setCourses(data);
        return data;
      }
      return [];
    } catch (e) {
      console.error('Erro ao carregar cursos da API', e);
      return [];
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const getCourseBySlug = async (slug: string): Promise<CourseDetailsResponse | null> => {
    try {
      const { data } = await apiRequest<CourseDetailsResponse>(`/lms/course/${slug}`);
      return data;
    } catch (e) {
      console.error('Erro ao buscar detalhes do curso', e);
      return null;
    }
  };

  const getLessonBySlugs = async (courseSlug: string, lessonSlug: string): Promise<Lesson | null> => {
    try {
      const { data } = await apiRequest<Lesson>(`/lms/lesson/${courseSlug}/${lessonSlug}`);
      return data;
    } catch (e) {
      console.error('Erro ao buscar aula', e);
      return null;
    }
  };

  const completeLesson = async (courseId: string | number, lessonId: string | number): Promise<boolean> => {
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
  };

  const resetCourseProgress = async (courseId: string | number): Promise<boolean> => {
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
  };

  const getCertificates = async (): Promise<Certificate[]> => {
    try {
      const { data } = await apiRequest<Certificate[]>('/lms/certificates');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Erro ao buscar certificados', e);
      return [];
    }
  };

  const upsertCourse = async (courseData: {
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
    await fetchCourses();
    return data;
  };

  const getAdminLessons = async (): Promise<Lesson[]> => {
    try {
      const { data } = await apiRequest<Lesson[]>('/lms/lessons');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Erro ao buscar aulas no painel admin', e);
      return [];
    }
  };

  const upsertLesson = async (lessonData: {
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
  };

  const uploadLessonVideo = async (file: File, isFree: boolean): Promise<string> => {
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
  };

  const searchUsers = async (query: string, page = 1): Promise<{ users: User[]; total: number; totalPages: number }> => {
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
  };

  return (
    <LMSContext.Provider
      value={{
        courses,
        loadingCourses,
        fetchCourses,
        getCourseBySlug,
        getLessonBySlugs,
        completeLesson,
        resetCourseProgress,
        getCertificates,
        upsertCourse,
        getAdminLessons,
        upsertLesson,
        uploadLessonVideo,
        searchUsers,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS deve ser usado dentro de um LMSProvider');
  }
  return context;
}
