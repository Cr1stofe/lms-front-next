import { Role, User } from '@/lib/types';
import { apiRequest } from '@/lib/api-client';

export interface SessionResponse {
  role: Role;
  title?: string;
  email?: string;
  name?: string;
  username?: string;
}

export interface LoginResponse {
  role?: Role;
  user?: User;
}

export const authService = {
  async getSession() {
    return apiRequest<SessionResponse>('/auth/session');
  },

  async login(email: string, password: string) {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name: string, username: string, email: string, password: string) {
    return apiRequest<{ id?: number | string; message?: string }>('/auth/user', {
      method: 'POST',
      body: JSON.stringify({ name, username, email, password }),
    });
  },

  async logout() {
    return apiRequest('/auth/logout', {
      method: 'DELETE',
    });
  },

  async forgotPassword(email: string) {
    return apiRequest('/auth/password/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, new_password: string) {
    return apiRequest('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ token, new_password }),
    });
  },
};
