import { z } from 'zod';

export const upsertCourseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, 'O slug deve ter no mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'O slug deve conter apenas letras minúsculas, números e hífens'),
  title: z.string().trim().min(3, 'O título do curso deve ter no mínimo 3 caracteres'),
  description: z.string().trim().min(5, 'A descrição deve ter no mínimo 5 caracteres'),
  lessons: z
    .number()
    .int('A quantidade de aulas deve ser um número inteiro')
    .min(0, 'A quantidade de aulas não pode ser negativa'),
  hours: z
    .number()
    .int('A carga horária deve ser um número inteiro')
    .min(1, 'A carga horária mínima é de 1 hora'),
});

export type UpsertCourseInput = z.infer<typeof upsertCourseSchema>;

export const upsertLessonSchema = z.object({
  courseSlug: z.string().trim().min(1, 'O curso pai (course slug) é obrigatório'),
  slug: z
    .string()
    .trim()
    .min(2, 'O slug da aula deve ter no mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'O slug deve conter apenas letras minúsculas, números e hífens'),
  title: z.string().trim().min(3, 'O título da aula deve ter no mínimo 3 caracteres'),
  description: z.string().trim(),
  seconds: z
    .number()
    .int('A duração deve ser um número inteiro')
    .min(1, 'A duração da aula em segundos deve ser maior que 0'),
  order: z
    .number()
    .int('A ordem deve ser um número inteiro')
    .min(1, 'A ordem da aula deve ser no mínimo 1'),
  free: z.number().int().min(0).max(1),
  video: z.string().trim().min(1, 'Informe o caminho do vídeo ou selecione um arquivo para upload'),
});

export type UpsertLessonInput = z.infer<typeof upsertLessonSchema>;

export const searchUsersSchema = z.object({
  query: z.string().optional().default(''),
  page: z.number().int().min(1).default(1),
});

export type SearchUsersInput = z.infer<typeof searchUsersSchema>;
