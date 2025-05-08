"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, ArrowLeft } from "lucide-react"

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE = rawBase.replace(/\/+$/, "")

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const body = new URLSearchParams({
      grant_type: "password",
      username: email,
      password: password,
    }).toString()

    try {
      const res = await fetch(`${API_BASE}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      })

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid email or password")
        throw new Error("Login failed")
      }

      const { access_token } = await res.json()
      localStorage.setItem("jwt", access_token)

      const meRes = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      if (!meRes.ok) throw new Error("Could not fetch user info")
      const me = (await meRes.json()) as { is_admin: boolean }

      if (me.is_admin) {
        router.push("/admin")
      } else {
        router.push("/portal")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex flex-col items-center justify-center p-4">
      {/* Back Home Link */}
      <div className="w-full max-w-md mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-10 w-10 rounded-md bg-[#ff4d8d] flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(255,77,141,0.7)]">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Client Portal</h1>
        </div>

        {/* Sign In Card */}
        <div className="bg-black/20 rounded-xl border border-white/10 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Sign In</h2>
            <p className="text-white/70 mt-1">Access your creator discovery dashboard</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-center">{error}</p>}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/70 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d8d] focus:border-transparent"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-white/70 block">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#ff4d8d] hover:text-[#ff1a6c] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d8d] focus:border-transparent"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-black/30 text-[#ff4d8d] focus:ring-[#ff4d8d] focus:ring-offset-black"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#ff4d8d] hover:bg-[#ff1a6c] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4d8d] focus:ring-offset-2 focus:ring-offset-black"
              >
                Sign In
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#ff4d8d] hover:text-[#ff1a6c] font-medium transition-colors">
                  Get in touch
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-white/60">
          <p>© 2025 CreatorPulse. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
