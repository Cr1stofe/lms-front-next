import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/schemas/auth';
import { BACKEND_URL } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'E-mail inválido' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/auth/password/forgot`, {
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
