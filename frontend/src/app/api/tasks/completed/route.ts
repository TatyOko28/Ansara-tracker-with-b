import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function POST(req: NextRequest) {
  const token = (await cookies()).get('access_token')?.value;
  const body = await req.json();

  const r = await fetch(`${API}/tasks/completed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
