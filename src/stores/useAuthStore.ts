import { create } from 'zustand';
import { User, Role } from '@/lib/types';
import { apiRequest } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  role: Role;
  loading: boolean;
  refreshSession: () => Promise<Role>;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: Role; error?: string }>;
  register: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: 'public',
  loading: true,

  refreshSession: async (): Promise<Role> => {
    try {
      const { data } = await apiRequest<{ role: Role; title?: string; email?: string; name?: string; username?: string }>('/auth/session');
      const userRole = (data?.role || 'public').toLowerCase() as Role;
      
      const userObj = userRole !== 'public' ? {
        name: data?.name || (userRole === 'admin' ? 'Administrador' : 'Aluno'),
        username: data?.username || (userRole === 'admin' ? 'admin' : 'aluno'),
        email: data?.email || (userRole === 'admin' ? 'admin@lms.com' : 'aluno@lms.com'),
        role: userRole,
      } : null;

      set({ role: userRole, user: userObj, loading: false });
      return userRole;
    } catch {
      set({ role: 'public', user: null, loading: false });
      return 'public';
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data } = await apiRequest<{ role?: Role; user?: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const activeRole = (data?.role || await get().refreshSession()) as Role;
      set({
        role: activeRole,
        user: data?.user || (activeRole !== 'public' ? {
          name: activeRole === 'admin' ? 'Administrador' : 'Aluno',
          username: activeRole === 'admin' ? 'admin' : 'aluno',
          email,
          role: activeRole,
        } : null),
        loading: false,
      });

      return { success: true, role: activeRole };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao realizar login' };
    }
  },

  register: async (name: string, username: string, email: string, password: string) => {
    try {
      await apiRequest('/auth/user', {
        method: 'POST',
        body: JSON.stringify({ name, username, email, password }),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao criar conta' };
    }
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Erro ao efetuar logout', e);
    } finally {
      set({ role: 'public', user: null, loading: false });
    }
  },

  requestPasswordReset: async (email: string) => {
    try {
      await apiRequest('/auth/password/forgot', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao solicitar recuperação' };
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      await apiRequest('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: password }),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao redefinir senha' };
    }
  },
}));

export const useAuth = useAuthStore;
