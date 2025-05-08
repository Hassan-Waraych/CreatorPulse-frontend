"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE = rawBase.replace(/\/+$/, "")

export default function PlansPage() {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string|null>(null)
  const [error, setError] = useState<string|null>(null)

  async function handleCheckout(plan: "silver"|"gold") {
    const token = localStorage.getItem("jwt")
    if (!token) {
      // not logged in!
      router.push("/login")
      return
    }

    setLoadingPlan(plan)
    try {
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      })
      if (!res.ok) throw new Error("Could not start checkout")
      const { url } = await res.json()
      window.location.href = url
    } catch (err: any) {
      setError(err.message)
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8a0d23] to-[#14061e] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Silver */}
          <div className="bg-black rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Silver</h2>
            <p className="text-gray-400 mb-4">150 creators / month</p>
            <p className="text-2xl font-bold mb-6">$129 / mo</p>
            <button
              onClick={() => handleCheckout("silver")}
              disabled={loadingPlan !== null}
              className="w-full py-3 bg-[#c31432] rounded-lg hover:bg-[#a01029] transition"
            >
              {loadingPlan==="silver" ? "Redirecting…" : "Select Silver"}
            </button>
          </div>

          {/* Gold */}
          <div className="bg-black rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Gold</h2>
            <p className="text-gray-400 mb-4">300 creators / month + limited outreach</p>
            <p className="text-2xl font-bold mb-6">$299 / mo</p>
            <button
              onClick={() => handleCheckout("gold")}
              disabled={loadingPlan !== null}
              className="w-full py-3 bg-[#c31432] rounded-lg hover:bg-[#a01029] transition"
            >
              {loadingPlan==="gold" ? "Redirecting…" : "Select Gold"}
            </button>
          </div>

          {/* Enterprise (contact form) */}
          <div className="bg-black rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Enterprise</h2>
              <p className="text-gray-400 mb-4">All creators + fully managed</p>
              <p className="text-2xl font-bold mb-6">Contact us</p>
            </div>
            <button
              onClick={() => router.push("/signup/enterprise")}
              className="w-full py-3 bg-[#e04c6c] rounded-lg hover:bg-[#f06c8c] transition"
            >
              Inquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
