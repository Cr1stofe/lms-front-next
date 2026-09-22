import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/lib/config';

export async function GET(_request: NextRequest) {
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
