'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { lmsService } from '@/services/lmsService';
import { User } from '@/lib/types';
import { Search, Shield, User as UserIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import styles from '@/styles/admin.module.scss';

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await lmsService.searchUsers(query, page);
    setUsers(result.users);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [query, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminCard}>
        <div className={styles.headerRow}>
          <div className={styles.titleWrapper}>
            <span className={styles.badgeIndigo}>
              Painel Administrativo
            </span>
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
              const isAdmin = String(user.role).toLowerCase() === 'admin' || String(user.role).toLowerCase() === 'editor';

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

                    <div>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </div>

                  {user.role && (
                    <span className={isAdmin ? styles.badgeIndigo : styles.badgeEmerald}>
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-sm"
              style={{ minWidth: 36, padding: '0.4rem 0.6rem' }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`btn btn-sm ${p === page ? 'btn-primary' : ''}`}
                style={{ minWidth: 36, padding: '0.4rem 0.75rem' }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-sm"
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

