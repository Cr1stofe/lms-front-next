import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { authService } from '@/services/authService';

vi.mock('@/services/authService', () => ({
  authService: {
    getSession: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

describe('store: useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      role: 'public',
      loading: false,
      isHydrated: false,
    });
  });

  it('should authenticate user successfully on valid login', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      data: {
        user: {
          name: 'Henrique Barros',
          username: 'henrique',
          email: 'student@example.com',
          role: 'user',
        },
      },
      response: new Response(),
    });

    const res = await useAuthStore.getState().login('student@example.com', 'P@ssw0rd123');

    expect(res.success).toBe(true);
    expect(res.role).toBe('user');
    expect(useAuthStore.getState().user?.email).toBe('student@example.com');
    expect(useAuthStore.getState().role).toBe('user');
  });

  it('should return error message when login credentials fail', async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(new Error('Invalid credentials'));

    const res = await useAuthStore.getState().login('wrong@example.com', '123');

    expect(res.success).toBe(false);
    expect(res.error).toBe('Invalid credentials');
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().role).toBe('public');
  });

  it('should clear authentication state upon logout', async () => {
    useAuthStore.setState({
      user: {
        name: 'Admin',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
      },
      role: 'admin',
    });

    vi.mocked(authService.logout).mockResolvedValueOnce({
      data: { success: true },
      response: new Response(),
    });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().role).toBe('public');
  });
});
