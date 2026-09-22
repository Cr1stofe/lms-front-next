export type Role = 'admin' | 'editor' | 'user' | 'public' | 'ADMIN' | 'EDITOR' | 'USER';

export interface User {
  id?: string | number;
  name: string;
  username: string;
  email: string;
  role: Role;
  created?: string;
  createdAt?: string;
}

export interface Lesson {
  id: string | number;
  course_id?: string | number;
  courseId?: string | number;
  courseSlug?: string;
  title: string;
  slug: string;
  description: string;
  seconds: number;
  video: string;
  order: number;
  free: number | boolean;
  prev?: string | null;
  next?: string | null;
  completed?: boolean;
}

export interface CompletedLesson {
  id?: string | number;
  lesson_id?: string | number;
  lessonId?: string | number;
  course_id?: string | number;
  courseId?: string | number;
  user_id?: string | number;
  userId?: string | number;
  created?: string;
}

export interface Course {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  hours: number;
  lessons: number;
  created?: string;
}

export interface Certificate {
  id: string | number;
  title: string;
  completed: string;
  courseId?: string | number;
  courseSlug?: string;
  userId?: string | number;
  userName?: string;
}

export interface CourseDetailsResponse {
  course: Course;
  lessons: Lesson[];
  completed: CompletedLesson[];
}
