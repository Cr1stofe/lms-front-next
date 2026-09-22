'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { BookOpen, Award, Users, PlusCircle, LogOut, Video, LogIn, UserPlus, Menu, X, Shield, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    window.location.href = '/login';
  };

  const currentRole = (role || 'public').toLowerCase();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
              flexShrink: 0,
            }}
          >
            <BookOpen size={16} color="#ffffff" />
          </div>
          <span>Tiny LMS</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-menu desktop-nav">
          {currentRole === 'public' && (
            <>
              <Link href="/cursos" className={`navbar-link ${pathname === '/cursos' ? 'active' : ''}`}>
                Cursos
              </Link>
              <Link href="/login" className={`navbar-link ${pathname === '/login' ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <LogIn size={14} /> Login
                </span>
              </Link>
              <Link href="/criar-conta" className={`navbar-link ${pathname === '/criar-conta' ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <UserPlus size={14} /> Criar Conta
                </span>
              </Link>
            </>
          )}

          {currentRole === 'user' && (
            <>
              <Link href="/cursos" className={`navbar-link ${pathname.startsWith('/cursos') || pathname.startsWith('/aula') ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <BookOpen size={14} /> Cursos
                </span>
              </Link>
              <Link href="/certificados" className={`navbar-link ${pathname.startsWith('/certificados') ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Award size={14} /> Certificados
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="navbar-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <LogOut size={14} /> Sair
              </button>
            </>
          )}

          {(currentRole === 'admin' || currentRole === 'editor') && (
            <>
              <Link href="/admin/cursos" className={`navbar-link ${pathname === '/admin/cursos' ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <PlusCircle size={14} /> Cursos
                </span>
              </Link>
              <Link href="/admin/aulas" className={`navbar-link ${pathname === '/admin/aulas' ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Video size={14} /> Aulas
                </span>
              </Link>
              <Link href="/admin/usuarios" className={`navbar-link ${pathname === '/admin/usuarios' ? 'active' : ''}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Users size={14} /> Usuários
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="navbar-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <LogOut size={14} /> Sair
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu de navegação"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 57,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(9, 9, 11, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 99,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out forwards',
          }}
        >
          {user && (
            <div
              style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {currentRole === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentRole === 'public' && (
              <>
                <Link
                  href="/cursos"
                  className={`btn btn-lg ${pathname === '/cursos' ? 'btn-primary' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <BookOpen size={18} /> Cursos
                </Link>
                <Link
                  href="/login"
                  className={`btn btn-lg ${pathname === '/login' ? 'btn-primary' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <LogIn size={18} /> Login
                </Link>
                <Link
                  href="/criar-conta"
                  className={`btn btn-lg ${pathname === '/criar-conta' ? 'btn-primary' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <UserPlus size={18} /> Criar Conta
                </Link>
              </>
            )}

            {currentRole === 'user' && (
              <>
                <Link
                  href="/cursos"
                  className={`btn btn-lg ${pathname.startsWith('/cursos') ? 'btn-primary' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <BookOpen size={18} /> Meus Cursos
                </Link>
                <Link
                  href="/certificados"
                  className={`btn btn-lg ${pathname.startsWith('/certificados') ? 'btn-primary' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <Award size={18} /> Meus Certificados
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-lg btn-danger"
                  style={{ width: '100%', justifyContent: 'flex-start', marginTop: '1rem' }}
                >
                  <LogOut size={18} /> Sair da Conta
                </button>
              </>
            )}

            {(currentRole === 'admin' || currentRole === 'editor') && (
              <>
                <Link
                  href="/admin/cursos"
                  className={`btn btn-lg ${pathname === '/admin/cursos' ? 'btn-primary' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <PlusCircle size={18} /> Gerenciar Cursos
                </Link>
                <Link
                  href="/admin/aulas"
                  className={`btn btn-lg ${pathname === '/admin/aulas' ? 'btn-primary' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <Video size={18} /> Gerenciar Aulas
                </Link>
                <Link
                  href="/admin/usuarios"
                  className={`btn btn-lg ${pathname === '/admin/usuarios' ? 'btn-primary' : ''}`}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <Users size={18} /> Gestão de Usuários
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-lg btn-danger"
                  style={{ width: '100%', justifyContent: 'flex-start', marginTop: '1rem' }}
                >
                  <LogOut size={18} /> Sair da Conta
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
