import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  username: z
    .string()
    .trim()
    .min(3, 'O usuário deve ter no mínimo 3 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'O usuário deve conter apenas letras, números, pontos, hífens ou underlines'),
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token de recuperação inválido'),
    password: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const backendResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token de recuperação obrigatório'),
  new_password: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
});

export type BackendResetPasswordInput = z.infer<typeof backendResetPasswordSchema>;

