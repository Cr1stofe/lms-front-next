import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api').replace(/\/$/, '');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get('cookie') || '';

  const isCertificadosRoute = pathname.startsWith('/certificados');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/criar-conta';

  // Se for rota protegida e não houver cookies, redireciona imediatamente para o login
  if ((isCertificadosRoute || isAdminRoute) && !cookieHeader) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Valida a sessão no endpoint /auth/session da API
  let role = 'public';
  if (cookieHeader) {
    try {
      const res = await fetch(`${API_BASE}/auth/session`, {
        headers: {
          cookie: cookieHeader,
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const body = await res.json().catch(() => null);
        role = String(body?.role || '').toLowerCase();
      }
    } catch {
      // Se a requisição falhar, mantém role como 'public'
      role = 'public';
    }
  }

  // Proteção para rotas /admin/* (apenas admin ou editor)
  if (isAdminRoute) {
    if (role !== 'admin' && role !== 'editor') {
      if (role === 'user') {
        return NextResponse.redirect(new URL('/cursos', request.url));
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Proteção para rotas de certificados (requer usuário autenticado)
  if (isCertificadosRoute) {
    if (role === 'public') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redireciona usuários já autenticados que acessam /login ou /criar-conta
  if (isAuthRoute && role !== 'public') {
    if (role === 'admin' || role === 'editor') {
      return NextResponse.redirect(new URL('/admin/cursos', request.url));
    }
    return NextResponse.redirect(new URL('/cursos', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/certificados/:path*',
    '/admin/:path*',
    '/login',
    '/criar-conta',
  ],
};
