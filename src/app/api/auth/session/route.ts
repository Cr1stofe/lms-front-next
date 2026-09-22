import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api').replace(/\/$/, '');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sid = cookieStore.get('__Secure-sid')?.value;
    const roleCookie = cookieStore.get('lms_role')?.value;

    if (!sid) {
      return NextResponse.json({ role: 'public' }, { status: 200 });
    }

    const sessionRes = await fetch(`${BACKEND_URL}/auth/session`, {
      headers: {
        Cookie: `__Secure-sid=${sid}`,
      },
      cache: 'no-store',
    });

    if (!sessionRes.ok) {
      cookieStore.delete('__Secure-sid');
      cookieStore.delete('lms_role');
      return NextResponse.json({ role: 'public' }, { status: 200 });
    }

    const data = await sessionRes.json().catch(() => ({}));
    const role = (data?.role || roleCookie || 'public').toLowerCase();

    return NextResponse.json({
      role,
      name: data?.name,
      email: data?.email,
      username: data?.username,
    });
  } catch (error) {
    console.error('BFF Session Error:', error);
    return NextResponse.json({ role: 'public' }, { status: 200 });
  }
}
