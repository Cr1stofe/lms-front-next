import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Navbar from './Navbar';
import { useAuthStore } from '@/stores/useAuthStore';

describe('component: Navbar', () => {
  beforeEach(() => {
    useAuthStore.setState({
      role: 'public',
      user: null,
      isHydrated: true,
      loading: false,
    });
  });

  it('should render Veltro LMS brand and visitor links (Login / Register)', () => {
    render(<Navbar />);

    expect(screen.getByText('Veltro LMS')).toBeInTheDocument();
    expect(screen.getAllByText('Cursos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Criar Conta').length).toBeGreaterThan(0);
  });

  it('should render Certificates link and student username when authenticated as user', () => {
    useAuthStore.setState({
      role: 'user',
      user: {
        name: 'Henrique Barros',
        username: 'henrique',
        email: 'student@example.com',
        role: 'user',
      },
      isHydrated: true,
      loading: false,
    });

    render(<Navbar />);

    expect(screen.getAllByText('Certificados').length).toBeGreaterThan(0);
    expect(screen.getByText('Henrique Barros')).toBeInTheDocument();
  });

  it('should render administrative links (Cursos, Aulas, Usuários) when authenticated as admin', () => {
    useAuthStore.setState({
      role: 'admin',
      user: {
        name: 'Admin Master',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
      },
      isHydrated: true,
      loading: false,
    });

    render(<Navbar />);

    expect(screen.getAllByText('Usuários').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Aulas').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cursos').length).toBeGreaterThan(0);
    expect(screen.getByText('Admin Master')).toBeInTheDocument();
  });
});
