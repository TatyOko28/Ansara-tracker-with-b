import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function GET() {
  const token = (await cookies()).get('access_token')?.value;
  const r = await fetch(`${API}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}

export async function POST(req: Request) {
  const token = (await cookies()).get('access_token')?.value;
  const body = await req.json();

  // Normalize category from UI localized labels to backend enum values
  const normalizeCategory = (c: any) => {
    if (typeof c !== 'string') return c;
    const map: Record<string, string> = {
      'Сегодня': 'TODAY',
      'Сегодня вечером': 'EVENING',
      'Завтра': 'TOMORROW',
      'Когда-нибудь': 'SOMEDAY',
      'TODAY': 'TODAY',
      'EVENING': 'EVENING',
      'TOMORROW': 'TOMORROW',
      'SOMEDAY': 'SOMEDAY',
    };
    return map[c] ?? c;
  };

  const forwarded = {
    ...body,
    category: normalizeCategory(body?.category),
    ...(body?.startTime ? { startTime: body.startTime } : {}),
  };

  const r = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(forwarded),
  });
  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}
