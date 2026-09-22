'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './Navbar.module.scss';
import {
  BookOpen,
  Award,
  Users,
  PlusCircle,
  LogOut,
  Video,
  LogIn,
  UserPlus,
  Menu,
  X,
  Shield,
  User as UserIcon,
} from 'lucide-react';

export default function Navbar() {
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <BookOpen size={16} color="#ffffff" />
          </div>
          <span>Tiny LMS</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={styles.menu}>
          {currentRole === 'public' && (
            <>
              <Link href="/cursos" className={`${styles.navLink} ${pathname === '/cursos' ? styles.active : ''}`}>
                Cursos
              </Link>
              <Link href="/login" className={`${styles.navLink} ${pathname === '/login' ? styles.active : ''}`}>
                <LogIn size={14} /> Login
              </Link>
              <Link href="/criar-conta" className={`${styles.navLink} ${pathname === '/criar-conta' ? styles.active : ''}`}>
                <UserPlus size={14} /> Criar Conta
              </Link>
            </>
          )}

          {currentRole === 'user' && (
            <>
              <Link
                href="/cursos"
                className={`${styles.navLink} ${pathname.startsWith('/cursos') || pathname.startsWith('/aula') ? styles.active : ''}`}
              >
                <BookOpen size={14} /> Cursos
              </Link>
              <Link
                href="/certificados"
                className={`${styles.navLink} ${pathname.startsWith('/certificados') ? styles.active : ''}`}
              >
                <Award size={14} /> Certificados
              </Link>
              <button onClick={handleLogout} className={styles.navLink}>
                <LogOut size={14} /> Sair
              </button>
            </>
          )}

          {(currentRole === 'admin' || currentRole === 'editor') && (
            <>
              <Link
                href="/admin/cursos"
                className={`${styles.navLink} ${pathname === '/admin/cursos' ? styles.active : ''}`}
              >
                <PlusCircle size={14} /> Cursos
              </Link>
              <Link
                href="/admin/aulas"
                className={`${styles.navLink} ${pathname === '/admin/aulas' ? styles.active : ''}`}
              >
                <Video size={14} /> Aulas
              </Link>
              <Link
                href="/admin/usuarios"
                className={`${styles.navLink} ${pathname === '/admin/usuarios' ? styles.active : ''}`}
              >
                <Users size={14} /> Usuários
              </Link>
              <button onClick={handleLogout} className={styles.navLink}>
                <LogOut size={14} /> Sair
              </button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu de navegação"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={styles.drawer}>
          {user && (
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                {currentRole === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{user.email}</div>
              </div>
            </div>
          )}

          <div className={styles.drawerLinks}>
            {currentRole === 'public' && (
              <>
                <Link
                  href="/cursos"
                  className={`${styles.drawerBtn} ${pathname === '/cursos' ? styles.active : ''}`}
                >
                  <BookOpen size={18} /> Cursos
                </Link>
                <Link
                  href="/login"
                  className={`${styles.drawerBtn} ${pathname === '/login' ? styles.active : ''}`}
                >
                  <LogIn size={18} /> Login
                </Link>
                <Link
                  href="/criar-conta"
                  className={`${styles.drawerBtn} ${pathname === '/criar-conta' ? styles.active : ''}`}
                >
                  <UserPlus size={18} /> Criar Conta
                </Link>
              </>
            )}

            {currentRole === 'user' && (
              <>
                <Link
                  href="/cursos"
                  className={`${styles.drawerBtn} ${pathname.startsWith('/cursos') ? styles.active : ''}`}
                >
                  <BookOpen size={18} /> Meus Cursos
                </Link>
                <Link
                  href="/certificados"
                  className={`${styles.drawerBtn} ${pathname.startsWith('/certificados') ? styles.active : ''}`}
                >
                  <Award size={18} /> Meus Certificados
                </Link>
                <button onClick={handleLogout} className={`${styles.drawerBtn} ${styles.danger}`}>
                  <LogOut size={18} /> Sair da Conta
                </button>
              </>
            )}

            {(currentRole === 'admin' || currentRole === 'editor') && (
              <>
                <Link
                  href="/admin/cursos"
                  className={`${styles.drawerBtn} ${pathname === '/admin/cursos' ? styles.active : ''}`}
                >
                  <PlusCircle size={18} /> Gerenciar Cursos
                </Link>
                <Link
                  href="/admin/aulas"
                  className={`${styles.drawerBtn} ${pathname === '/admin/aulas' ? styles.active : ''}`}
                >
                  <Video size={18} /> Gerenciar Aulas
                </Link>
                <Link
                  href="/admin/usuarios"
                  className={`${styles.drawerBtn} ${pathname === '/admin/usuarios' ? styles.active : ''}`}
                >
                  <Users size={18} /> Gestão de Usuários
                </Link>
                <button onClick={handleLogout} className={`${styles.drawerBtn} ${styles.danger}`}>
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
