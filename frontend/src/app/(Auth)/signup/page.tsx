"use client"

import Head from 'next/head'
import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signUpAction } from '@/app/actions/auth'

export default function SignUp() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [state, formAction] = useActionState(signUpAction, { ok: false, error: null })

  async function clientValidate(e: React.FormEvent<HTMLFormElement>) {
    if (password !== confirmPassword) {
      e.preventDefault()
      toast.error('Les mots de passe ne correspondent pas.')
    }
  }

  useEffect(() => {
    if (state?.ok) { toast.success('Compte créé, vous pouvez vous connecter'); router.replace('/signin') }
    else if (state?.error) toast.error(state.error!)
  }, [state, router])

  return (
    <>
      <Head><title>ANSARA TRACKER - Регистрация</title></Head>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-white text-center mb-8">Создайте свой аккаунт</h1>
          <form action={formAction} onSubmit={clientValidate} className="space-y-4">
            <input type="text" name="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Полное имя"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Введите логин"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Введите пароль"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Подтвердите пароль"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">Зарегистрироваться</button>
          </form>
          <div className="mt-6 text-center text-gray-400">
            <p>Уже есть аккаунт? <Link href="/signin" className="text-white hover:underline">Войти</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}
