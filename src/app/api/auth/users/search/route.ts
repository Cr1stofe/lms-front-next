import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api').replace(/\/$/, '');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cookieStore = await cookies();
    const sid = cookieStore.get('__Secure-sid')?.value;

    const res = await fetch(`${BACKEND_URL}/auth/users/search?${searchParams.toString()}`, {
      headers: {
        Cookie: sid ? `__Secure-sid=${sid}` : '',
      },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => []);
    const totalCount = res.headers.get('x-total-count') || '0';

    return NextResponse.json(data, {
      status: res.status,
      headers: {
        'x-total-count': totalCount,
      },
    });
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
