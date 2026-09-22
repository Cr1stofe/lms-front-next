import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/lib/config';

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
