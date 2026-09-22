import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api').replace(/\/$/, '');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sid = cookieStore.get('__Secure-sid')?.value;

    if (sid) {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'DELETE',
        headers: {
          Cookie: `__Secure-sid=${sid}`,
        },
      }).catch(() => {});
    }

    cookieStore.delete('__Secure-sid');
    cookieStore.delete('lms_role');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('BFF Logout Error:', error);
    return NextResponse.json({ success: true });
  }
}
