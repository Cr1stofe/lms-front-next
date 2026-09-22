import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api').replace(/\/$/, '');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

async function handleLmsProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join('/');
    const searchStr = request.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/lms/${pathStr}${searchStr}`;

    const cookieStore = await cookies();
    const sid = cookieStore.get('__Secure-sid')?.value;

    const headers: Record<string, string> = {
      Cookie: sid ? `__Secure-sid=${sid}` : '',
    };

    let body: any = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        headers['Content-Type'] = 'application/json';
        body = await request.text();
      } else {
        body = await request.blob();
      }
    }

    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/pdf') || contentType.includes('octet-stream')) {
      const arrayBuffer = await res.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        status: res.status,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': res.headers.get('content-disposition') || 'inline',
        },
      });
    }

    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('BFF LMS Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'Erro no gateway LMS' }, { status: 500 });
  }
}

export { handleLmsProxy as GET, handleLmsProxy as POST, handleLmsProxy as DELETE, handleLmsProxy as PUT, handleLmsProxy as PATCH };
