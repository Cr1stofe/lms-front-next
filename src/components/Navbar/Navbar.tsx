'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  AlertTriangle,
} from 'lucide-react';

interface NavbarProps {
  initialRole?: string;
}

export default function Navbar({ initialRole = 'public' }: NavbarProps) {
  const storeRole = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogoutModal) {
        setShowLogoutModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutModal]);

  const handleLogoutConfirm = useCallback(async () => {
    setIsLoggingOut(true);
    await logout();
    setShowLogoutModal(false);
    setMobileMenuOpen(false);
    setIsLoggingOut(false);
    window.location.href = '/login';
  }, [logout]);

  const activeRole = isHydrated ? storeRole : (initialRole as string);
  const currentRole = (activeRole || 'public').toLowerCase();
  const isAuthenticated = currentRole !== 'public';
  const isAdmin = currentRole === 'admin' || currentRole === 'editor';

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.container}>
          <Link href="/" className={styles.brand}>
            <div className={styles.brandIcon}>
              <BookOpen size={16} color="#ffffff" />
            </div>
            <span>Tiny LMS</span>
          </Link>

          <div className={styles.desktopNavWrapper}>
            <nav className={styles.menu}>
              {!isAuthenticated && (
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
                </>
              )}

              {isAdmin && (
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
                  {currentRole === 'admin' && (
                    <Link
                      href="/admin/usuarios"
                      className={`${styles.navLink} ${pathname === '/admin/usuarios' ? styles.active : ''}`}
                    >
                      <Users size={14} /> Usuários
                    </Link>
                  )}
                </>
              )}
            </nav>

            {isAuthenticated && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className={styles.userProfilePill} title={user?.email || 'Usuário conectado'}>
                  <div className={`${styles.userAvatarSmall} ${isAdmin ? styles.admin : ''}`}>
                    {isAdmin ? <Shield size={14} /> : <UserIcon size={14} />}
                  </div>
                  <span className={styles.userNameText}>
                    {user?.name || (isAdmin ? 'Administrador' : 'Aluno')}
                  </span>
                  <span className={`${styles.roleTag} ${isAdmin ? styles.admin : ''}`}>
                    {isAdmin ? 'Admin' : 'Aluno'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className={styles.navLink}
                  title="Encerrar sessão"
                  style={{ padding: '0.4rem 0.65rem' }}
                >
                  <LogOut size={15} />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={styles.drawer}>
            {user && (
              <div className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {isAdmin ? <Shield size={18} /> : <UserIcon size={18} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{user.email}</div>
                </div>
              </div>
            )}

            <div className={styles.drawerLinks}>
              {!isAuthenticated && (
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
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className={`${styles.drawerBtn} ${styles.danger}`}
                  >
                    <LogOut size={18} /> Sair da Conta
                  </button>
                </>
              )}

              {isAdmin && (
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
                  {currentRole === 'admin' && (
                    <Link
                      href="/admin/usuarios"
                      className={`${styles.drawerBtn} ${pathname === '/admin/usuarios' ? styles.active : ''}`}
                    >
                      <Users size={18} /> Gestão de Usuários
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className={`${styles.drawerBtn} ${styles.danger}`}
                  >
                    <LogOut size={18} /> Sair da Conta
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {showLogoutModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowLogoutModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIconWrapper}>
              <AlertTriangle size={28} />
            </div>

            <h3 id="logout-title" className={styles.modalTitle}>
              Deseja realmente sair?
            </h3>
            <p className={styles.modalDescription}>
              Você está prestes a encerrar sua sessão ativa. Para acessar suas aulas e certificados novamente, será necessário efetuar o login.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.logoutCancelBtn}
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.logoutConfirmBtn}
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Saindo...' : 'Sim, Sair da Conta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

