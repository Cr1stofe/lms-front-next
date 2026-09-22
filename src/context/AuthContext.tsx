'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '@/lib/types';
import { apiRequest } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  loading: boolean;
  refreshSession: () => Promise<Role>;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: Role; error?: string }>;
  register: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('public');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<Role> => {
    try {
      const { data } = await apiRequest<{ role: Role; title?: string; email?: string; name?: string; username?: string }>('/auth/session');
      const userRole = (data?.role || 'public').toLowerCase() as Role;
      setRole(userRole);
      if (userRole !== 'public') {
        setUser({
          name: data?.name || (userRole === 'admin' ? 'Administrador' : 'Aluno'),
          username: data?.username || (userRole === 'admin' ? 'admin' : 'aluno'),
          email: data?.email || (userRole === 'admin' ? 'admin@lms.com' : 'aluno@lms.com'),
          role: userRole,
        });
      } else {
        setUser(null);
      }
      return userRole;
    } catch {
      setRole('public');
      setUser(null);
      return 'public';
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    try {
      await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const activeRole = await refreshSession();
      return { success: true, role: activeRole };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao realizar login' };
    }
  };

  const register = async (name: string, username: string, email: string, password: string) => {
    try {
      await apiRequest('/auth/user', {
        method: 'POST',
        body: JSON.stringify({ name, username, email, password }),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao criar conta' };
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Erro ao efetuar logout', e);
    } finally {
      setRole('public');
      setUser(null);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await apiRequest('/auth/password/forgot', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao solicitar recuperação' };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await apiRequest('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: password }),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao redefinir senha' };
    }
  };

  const isAuthenticated = role !== 'public';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        refreshSession,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
