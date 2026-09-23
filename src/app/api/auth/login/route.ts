import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginSchema } from '@/lib/schemas/auth';
import { BACKEND_URL } from '@/lib/config';

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
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Dados inválidos' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validation.data),
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
    let userData: Record<string, unknown> | null = null;

    if (sid) {
      const sessionRes = await fetch(`${BACKEND_URL}/auth/session`, {
        headers: {
          Cookie: `__Secure-sid=${sid}`,
        },
      });

      if (sessionRes.ok) {
        userData = (await sessionRes.json().catch(() => ({}))) as Record<string, unknown>;
        userRole = String(userData?.role || 'user').toLowerCase();
      }
    }

    const cookieStore = await cookies();

    if (sid) {
      cookieStore.set('__Secure-sid', sid, {
        httpOnly: true,
        secure: true,
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
        name: (userData?.name as string) || (userRole === 'admin' ? 'Administrador' : 'Aluno'),
        email: body.email,
        username: (userData?.username as string) || body.email.split('@')[0],
        role: userRole,
      },
    });
  } catch (error) {
    console.error('BFF Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Falha na comunicação com o servidor de autenticação' },
      { status: 500 }
    );
  }
}
