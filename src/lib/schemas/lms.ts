import { z } from 'zod';

export const upsertCourseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, 'O slug deve ter no mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'O slug deve conter apenas letras minúsculas, números e hífens'),
  title: z.string().trim().min(3, 'O título do curso deve ter no mínimo 3 caracteres'),
  description: z.string().trim().min(5, 'A descrição deve ter no mínimo 5 caracteres'),
  lessons: z.coerce.number().int().min(0, 'A quantidade de aulas não pode ser negativa'),
  hours: z.coerce.number().int().min(1, 'A carga horária mínima é de 1 hora'),
});

export type UpsertCourseInput = z.infer<typeof upsertCourseSchema>;

export const upsertLessonSchema = z.object({
  courseSlug: z.string().trim().min(1, 'Selecione um curso válido'),
  slug: z
    .string()
    .trim()
    .min(2, 'O slug deve ter no mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'O slug deve conter apenas letras minúsculas, números e hífens'),
  title: z.string().trim().min(3, 'O título da aula deve ter no mínimo 3 caracteres'),
  description: z.string().trim().optional().default(''),
  seconds: z.coerce.number().int().min(1, 'A duração da aula em segundos deve ser maior que 0'),
  order: z.coerce.number().int().min(1, 'A ordem da aula deve ser no mínimo 1'),
  free: z.union([z.boolean(), z.number()]).transform((val) => (val === true || val === 1 ? 1 : 0)),
  video: z.string().trim().min(1, 'O vídeo da aula é obrigatório'),
});

export type UpsertLessonInput = z.infer<typeof upsertLessonSchema>;
