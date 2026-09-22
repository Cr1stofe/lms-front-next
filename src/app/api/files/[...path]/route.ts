import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api').replace(/\/$/, '');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

async function handleFilesProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join('/');
    const targetUrl = `${BACKEND_URL}/files/${pathStr}`;

    const cookieStore = await cookies();
    const sid = cookieStore.get('__Secure-sid')?.value;

    const headers: Record<string, string> = {
      Cookie: sid ? `__Secure-sid=${sid}` : '',
    };

    if (request.headers.get('x-filename')) {
      headers['x-filename'] = request.headers.get('x-filename')!;
    }
    if (request.headers.get('x-visibility')) {
      headers['x-visibility'] = request.headers.get('x-visibility')!;
    }
    if (request.headers.get('content-type')) {
      headers['Content-Type'] = request.headers.get('content-type')!;
    }

    let body: any = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.blob();
    }

    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }

    const blob = await res.arrayBuffer();
    return new NextResponse(blob, {
      status: res.status,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
      },
    });
  } catch (error: any) {
    console.error('BFF Files Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'Erro no gateway de arquivos' }, { status: 500 });
  }
}

export { handleFilesProxy as GET, handleFilesProxy as POST };
