'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL!;

type ActionState = { ok?: boolean; error?: string | null };

async function parse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const payload = {
      email: String(formData.get('login') || ''),     // champ "login" = email
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
          : (Array.isArray(data?.message) ? data.message.join(', ') : data?.message) ||
            'Identifiants invalides';
      return { ok: false, error: msg };
    }

    const data = (await r.json()) as any;
    const accessToken: string | undefined = data?.access_token ?? data?.token;
    if (!accessToken) {
      return { ok: false, error: 'Réponse inattendue: pas de token' };
    }

    // Écrit le cookie et redirige côté serveur pour éviter la course avec la navigation client
    (await cookies()).set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    redirect('/tasks');
  } catch (e: any) {
    // Ne pas avaler la redirection Next.js (différents formats possibles)
    if (e?.digest === 'NEXT_REDIRECT' || e?.message === 'NEXT_REDIRECT' || e === 'NEXT_REDIRECT') {
      throw e;
    }
    return { ok: false, error: e?.message || 'Erreur de connexion' };
  }
}

export async function signUpAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    };

    const r = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const data = await parse(r);
      const msg =
        typeof data === 'string'
          ? data
          : (Array.isArray(data?.message) ? data.message.join(', ') : data?.message) ||
            'Inscription impossible';
      return { ok: false, error: msg };
    }

    return { ok: true, error: null };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erreur lors de l’inscription' };
  }
}

export async function resetDemandAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const payload = { email: String(formData.get('email') || '') };

    const r = await fetch(`${API}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const data = await parse(r);
      const msg =
        typeof data === 'string'
          ? data
          : (Array.isArray(data?.message) ? data.message.join(', ') : data?.message) ||
            'Échec envoi code';
      return { ok: false, error: msg };
    }

    return { ok: true, error: null };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erreur lors de la demande' };
  }
}

export async function resetConfirmAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const payload = {
      email: String(formData.get('email') || ''),
      code: String(formData.get('code') || ''),
      password: String(formData.get('password') || ''),
    };

    const r = await fetch(`${API}/auth/reset-password-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const data = await parse(r);
      const msg =
        typeof data === 'string'
          ? data
          : (Array.isArray(data?.message) ? data.message.join(', ') : data?.message) ||
            'Code invalide';
      return { ok: false, error: msg };
    }

    return { ok: true, error: null };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erreur lors de la confirmation' };
  }
}
