import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api').replace(/\/$/, '');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function extractSid(setCookieHeaders: string[]): string | null {
  for (const header of setCookieHeaders) {
    const match = header.match(/__Secure-sid=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, error: data?.title || data?.message || 'Credenciais inválidas' },
        { status: backendRes.status }
      );
    }

    const setCookieHeaders = backendRes.headers.getSetCookie
      ? backendRes.headers.getSetCookie()
      : [backendRes.headers.get('set-cookie')].filter(Boolean) as string[];

    const sid = extractSid(setCookieHeaders);

    let userRole = 'user';
    let userData: any = null;

    if (sid) {
      const sessionRes = await fetch(`${BACKEND_URL}/auth/session`, {
        headers: {
          Cookie: `__Secure-sid=${sid}`,
        },
      });

      if (sessionRes.ok) {
        userData = await sessionRes.json().catch(() => ({}));
        userRole = String(userData?.role || 'user').toLowerCase();
      }
    }

    const cookieStore = await cookies();

    if (sid) {
      cookieStore.set('__Secure-sid', sid, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    cookieStore.set('lms_role', userRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      role: userRole,
      user: {
        name: userData?.name || (userRole === 'admin' ? 'Administrador' : 'Aluno'),
        email: body.email,
        username: userData?.username || body.email.split('@')[0],
        role: userRole,
      },
    });
  } catch (error: any) {
    console.error('BFF Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Falha na comunicação com o servidor de autenticação' },
      { status: 500 }
    );
  }
}
