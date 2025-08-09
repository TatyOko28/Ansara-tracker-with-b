'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { signInAction } from '@/app/actions/auth';

type State = { ok?: boolean; error?: string | null };

export default function SignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/tasks';

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [state, formAction, pending] = useActionState<State, FormData>(
    signInAction,
    { ok: false, error: null }
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success('Connexion réussie');
      // le cookie httpOnly est déjà posé côté serveur
      router.replace(callbackUrl);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router, callbackUrl]);

  return (
    <>
      <Head>
        <title>ANSARA TRACKER - Connexion</title>
      </Head>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-white text-center mb-8">
            ANSARA TRACKER
          </h1>

          <form action={formAction} className="space-y-4">
            <input
              type="text"
              name="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="username"
              required
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg transition"
            >
              {pending ? 'Connexion…' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            <p>
              Нет аккаунта?{' '}
              <Link href="/signup" className="text-white hover:underline">
                Зарегистрироваться
              </Link>
            </p>
            <p className="mt-2">
              <Link href="/reset-password" className="text-white hover:underline">
                Я забыл пароль
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
