import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface RouteContext {
  params: { id: string };
}

export async function PATCH(_req: NextRequest, context: RouteContext) {
  const token = (await cookies()).get('access_token')?.value;

  const r = await fetch(`${API}/tasks/${context.params.id}/start`, {
    method: 'PATCH',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
