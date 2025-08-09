'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL!;

type ActionState = { ok?: boolean; error?: string | null };

async function parse(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const payload = {
      email: String(formData.get('login') || ''),
      password: String(formData.get('password') || ''),
    };

    const r = await fetch(`${API}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const data = await parse(r);
      const msg =
        typeof data === 'string'
          ? data
          : (Array.isArray((data as any)?.message)
              ? (data as any).message.join(', ')
              : (data as any)?.message) || 'Identifiants invalides';
      return { ok: false, error: msg };
    }

    const data = await r.json() as { access_token?: string; token?: string };
    const accessToken = data.access_token ?? data.token;
    if (!accessToken) return { ok: false, error: 'Réponse inattendue: pas de token' };

    (await cookies()).set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false, // false en dev
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    // Redirection serveur immédiate -> plus de boucle sur /signin
    redirect('/tasks');
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erreur de connexion' };
  }
}
