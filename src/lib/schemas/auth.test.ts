import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth';

describe('auth schemas: loginSchema', () => {
  it('should validate valid user credentials', () => {
    const result = loginSchema.safeParse({
      email: 'student@example.com',
      password: 'P@ssw0rd123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format and empty passwords', () => {
    const invalidEmail = loginSchema.safeParse({
      email: 'not-an-email',
      password: '123',
    });
    expect(invalidEmail.success).toBe(false);

    const emptyPass = loginSchema.safeParse({
      email: 'student@example.com',
      password: '',
    });
    expect(emptyPass.success).toBe(false);
  });
});

describe('auth schemas: registerSchema', () => {
  it('should validate complete and correct registration data', () => {
    const result = registerSchema.safeParse({
      name: 'Henrique Barros',
      username: 'henrique.barros',
      email: 'henrique@example.com',
      password: 'P@ssw0rd123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject usernames containing invalid characters or spaces', () => {
    const result = registerSchema.safeParse({
      name: 'Henrique Barros',
      username: 'henrique barros!',
      email: 'henrique@example.com',
      password: 'P@ssw0rd123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject passwords shorter than 6 characters', () => {
    const result = registerSchema.safeParse({
      name: 'Henrique Barros',
      username: 'henrique',
      email: 'henrique@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('auth schemas: forgotPasswordSchema', () => {
  it('should validate valid email for password recovery request', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'student@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email in recovery request', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'invalid-email',
    });
    expect(result.success).toBe(false);
  });
});

describe('auth schemas: resetPasswordSchema', () => {
  it('should validate when password and confirmation match', () => {
    const result = resetPasswordSchema.safeParse({
      token: 'valid-crypto-token-123',
      password: 'NewStrongPassword123',
      confirmPassword: 'NewStrongPassword123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject when password confirmation does not match', () => {
    const result = resetPasswordSchema.safeParse({
      token: 'valid-crypto-token-123',
      password: 'NewStrongPassword123',
      confirmPassword: 'DifferentPassword456',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('As senhas não coincidem');
    }
  });
});
