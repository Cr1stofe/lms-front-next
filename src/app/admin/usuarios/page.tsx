'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { lmsService } from '@/services/lmsService';
import { User } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Search,
  Shield,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import styles from '@/styles/admin.module.scss';

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 600);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await lmsService.searchUsers(debouncedQuery, page);
      setUsers(result.users || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch {
      setUsers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminCard}>
        <div className={styles.headerRow}>
          <div className={styles.titleWrapper}>
            <span className={styles.badgeIndigo}>Painel Administrativo</span>
            <h1>Usuários</h1>
            <p>Busca e listagem de usuários cadastrados no sistema.</p>
          </div>

          <div className={styles.statBadge}>
            <div className={styles.statNumber}>{total}</div>
            <div className={styles.statLabel}>Total de Usuários</div>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <div className={styles.searchIcon}>
            <Search size={18} />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por nome ou e-mail..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={32} className={`animate-spin ${styles.spinner}`} />
            <p>Buscando usuários...</p>
          </div>
        ) : (
          <div className={styles.userList}>
            {users.map((user, idx) => {
              const isAdmin =
                String(user.role).toLowerCase() === 'admin' ||
                String(user.role).toLowerCase() === 'editor';

              return (
                <div
                  key={user.id || user.email || idx}
                  className={styles.userItem}
                >
                  <div className={styles.userInfo}>
                    <div
                      className={`${styles.avatar} ${isAdmin ? styles.avatarAdmin : styles.avatarUser}`}
                    >
                      {isAdmin ? <Shield size={20} /> : <UserIcon size={20} />}
                    </div>

                    <div className={styles.userDetails}>
                      <div className={styles.userName} title={user.name}>
                        {user.name}
                      </div>
                      <div className={styles.userEmail} title={user.email}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {user.role && (
                    <span
                      className={
                        isAdmin ? styles.badgeIndigo : styles.badgeEmerald
                      }
                    >
                      {String(user.role).toUpperCase()}
                    </span>
                  )}
                </div>
              );
            })}

            {users.length === 0 && (
              <div className={styles.emptyState}>
                Nenhum usuário localizado.
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-sm"
              aria-label="Página anterior"
              style={{ minWidth: 36, padding: '0.4rem 0.6rem' }}
            >
              <ChevronLeft size={16} />
            </button>

            {(() => {
              const pages: (number | string)[] = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else if (page <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
              } else if (page >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
              } else {
                pages.push(1, '...', page, '...', totalPages);
              }

              return pages.map((p, idx) => {
                if (typeof p === 'string') {
                  return (
                    <span
                      key={`dots-${idx}`}
                      style={{
                        padding: '0.4rem 0.5rem',
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        userSelect: 'none',
                      }}
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : ''}`}
                    style={{ minWidth: 36, padding: '0.4rem 0.75rem' }}
                  >
                    {p}
                  </button>
                );
              });
            })()}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-sm"
              aria-label="Próxima página"
              style={{ minWidth: 36, padding: '0.4rem 0.6rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
