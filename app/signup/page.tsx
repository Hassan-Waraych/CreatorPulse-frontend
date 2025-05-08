// app/signup/page.tsx
"use client"

import Link from "next/link"
import { Zap } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE = rawBase.replace(/\/+$/, "")

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Passwords don’t match")
      return
    }

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.detail || body.msg || "Signup failed")
      }

      const { access_token } = await res.json() as { access_token: string }

      // on success, send them to pick a plan (we’ll build /plans next)
      localStorage.setItem("jwt", access_token)
      router.push("/plans")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8a0d23] to-[#14061e] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-10 w-10 rounded-md bg-[#c31432] flex items-center justify-center mr-3">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">CreatorPulse</h1>
        </div>

        {/* Onboarding card */}
        <div className="bg-black rounded-xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Welcome aboard!</h2>
            <p className="text-gray-400 mt-1">
              Let’s set up your account so you can discover top creators for your brand.
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                  Company Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@yourcompany.com"
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c31432] focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c31432] focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm font-medium text-gray-300 block">
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c31432] focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#c31432] hover:bg-[#a01029] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#c31432] focus:ring-offset-2 focus:ring-offset-black"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-[#e04c6c] hover:text-[#f06c8c] font-medium transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>© 2025 CreatorPulse. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
