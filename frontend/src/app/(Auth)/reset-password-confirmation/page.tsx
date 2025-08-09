"use client"

import Head from 'next/head'
import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { resetConfirmAction } from '@/app/actions/auth'

export default function ResetPasswordConfirmation() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [state, formAction] = useActionState(resetConfirmAction, { ok: false, error: null })

  useEffect(() => {
    if (state?.ok) { toast.success('Mot de passe réinitialisé'); router.replace('/signin') }
    else if (state?.error) toast.error(state.error!)
  }, [state, router])

  return (
    <>
      <Head><title>ANSARA TRACKER -Подтвердите сброс пароля</title></Head>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-white text-center mb-8">Подтвердите сброс пароля</h1>
          <form action={formAction} className="space-y-4">
            <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Введите логин"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            <input type="text" name="code" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Code OTP"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Введите пароль"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">Сбросить пароль</button>
          </form>
          <div className="mt-6 text-center text-gray-400">
            <p>Вернуться к <Link href="/signin" className="text-white hover:underline">входу</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}
