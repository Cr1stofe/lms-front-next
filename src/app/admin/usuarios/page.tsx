'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLMSStore } from '@/stores/useLMSStore';
import { User } from '@/lib/types';
import { Search, Users, Shield, User as UserIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const searchUsers = useLMSStore((state) => state.searchUsers);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await searchUsers(query, page);
    setUsers(result.users);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [query, page, searchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
              Painel Administrativo
            </span>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Usuários</h1>
            <p style={{ fontSize: '0.95rem' }}>Busca e listagem de usuários cadastrados no sistema.</p>
          </div>

          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-serif)' }}>
              {total}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total de Usuários</div>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: '2rem' }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '3rem', background: 'rgba(9, 9, 11, 0.6)' }}
            placeholder="Buscar por nome ou e-mail..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* Users List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#818cf8' }} />
            <p>Buscando usuários...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {users.map((user, idx) => {
              const isAdmin = String(user.role).toLowerCase() === 'admin' || String(user.role).toLowerCase() === 'editor';

              return (
                <div
                  key={user.id || user.email || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.15rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: isAdmin ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: isAdmin ? '#818cf8' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isAdmin ? <Shield size={20} /> : <UserIcon size={20} />}
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '1.05rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>

                  {user.role && (
                    <span className={`badge ${isAdmin ? 'badge-indigo' : 'badge-emerald'}`}>
                      {String(user.role).toUpperCase()}
                    </span>
                  )}
                </div>
              );
            })}

            {users.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                Nenhum usuário localizado.
              </div>
            )}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
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
