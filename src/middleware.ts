import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('lms_role')?.value?.toLowerCase() || 'public';

  const isCertificadosRoute = pathname.startsWith('/certificados');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/criar-conta';

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

  if (isCertificadosRoute) {
    if (role === 'public') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

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
