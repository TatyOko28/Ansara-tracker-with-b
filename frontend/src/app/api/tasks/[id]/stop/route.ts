import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get('access_token')?.value;
  const r = await fetch(`${API}/tasks/${params.id}/stop`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
