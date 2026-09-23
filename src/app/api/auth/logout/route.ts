import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/lib/config';

export async function DELETE(_request: NextRequest) {
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

    cookieStore.set('__Secure-sid', '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    cookieStore.set('lms_role', '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
      httpOnly: false,
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('BFF Logout Error:', error);
    return NextResponse.json({ success: true });
  }
}
