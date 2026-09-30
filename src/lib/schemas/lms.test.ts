import { describe, it, expect } from 'vitest';
import { upsertCourseSchema, upsertLessonSchema } from './lms';

describe('lms schemas: upsertCourseSchema', () => {
  it('should validate valid course input data', () => {
    const result = upsertCourseSchema.safeParse({
      slug: 'javascript-mastery',
      title: 'JavaScript Mastery: Zero to Hero',
      description: 'Advanced course covering modern JavaScript ES2024 and TypeScript.',
      hours: 40,
    });
    expect(result.success).toBe(true);
  });

  it('should reject slugs with uppercase letters, spaces, or special characters', () => {
    const result = upsertCourseSchema.safeParse({
      slug: 'Javascript Mastery!',
      title: 'Valid Course Title',
      description: 'Valid course description with enough characters',
      hours: 10,
    });
    expect(result.success).toBe(false);
  });

  it('should reject zero or negative course hours', () => {
    const result = upsertCourseSchema.safeParse({
      slug: 'valid-slug',
      title: 'Valid Course',
      description: 'Valid description',
      hours: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('lms schemas: upsertLessonSchema', () => {
  it('should validate lesson with all mandatory fields', () => {
    const result = upsertLessonSchema.safeParse({
      courseSlug: 'javascript-mastery',
      slug: 'intro-to-js-engines',
      title: 'Introduction to JavaScript Engines',
      description: 'Understanding V8, SpiderMonkey, and event loop architecture.',
      seconds: 600,
      order: 1,
      free: 1,
      video: 'videos/js-intro.mp4',
    });
    expect(result.success).toBe(true);
  });

  it('should reject lessons without course parent or video path', () => {
    const result = upsertLessonSchema.safeParse({
      courseSlug: '',
      slug: 'lesson-1',
      title: 'Lesson 1',
      description: 'Description',
      seconds: 300,
      order: 1,
      free: 0,
      video: '',
    });
    expect(result.success).toBe(false);
  });
});
