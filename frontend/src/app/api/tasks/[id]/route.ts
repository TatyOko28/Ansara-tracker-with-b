import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface RouteContext {
  params: { id: string };
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const token = (await cookies()).get('access_token')?.value;

  const r = await fetch(`${API}/tasks/${context.params.id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const token = (await cookies()).get('access_token')?.value;
  const body = await req.json();

  const normalizeCategory = (c: unknown) => {
    if (typeof c !== 'string') return c as any;
    const map: Record<string, string> = {
      'Сегодня': 'TODAY',
      'Сегодня вечером': 'EVENING',
      'Завтра': 'TOMORROW',
      'Когда-нибудь': 'SOMEDAY',
      TODAY: 'TODAY',
      EVENING: 'EVENING',
      TOMORROW: 'TOMORROW',
      SOMEDAY: 'SOMEDAY',
    };
    return map[c] ?? c;
  };

  const forwarded = {
    ...body,
    category: normalizeCategory((body as any)?.category),
    ...(body?.startTime ? { startTime: body.startTime } : {}),
  };

  const r = await fetch(`${API}/tasks/${context.params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(forwarded),
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
