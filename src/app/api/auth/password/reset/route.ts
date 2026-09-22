import { NextRequest, NextResponse } from 'next/server';
import { backendResetPasswordSchema } from '@/lib/schemas/auth';

const BACKEND_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api').replace(/\/$/, '');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = backendResetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Dados inválidos' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/auth/password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Erro de comunicação com o servidor' }, { status: 500 });
  }
}
